# Constance

PWA de suivi d'habitudes (régularité, pas performance). Un seul utilisateur, dark mode uniquement, iPhone 390 px d'abord.
En ligne : https://theohls.github.io/constance/ (repo public TheoHls/constance, déployé à chaque push sur main).

**Mets ce fichier à jour à la fin de chaque session** (état, décisions, points ouverts). Il est public : aucune donnée personnelle ni clé.

## Règles
- Figma est la source de vérité : fileKey `Fd7UWF1snuqUVdf2ocQJco`. Pages : Ui-kit `41:827`, Design `47:2414`, Moodboard (à ignorer).
- `DESIGN_SYSTEM.md` = référence globale (tokens, styles, composants, écrans). En cas d'écart, Figma gagne.
- Figma en LECTURE SEULE : lire avec le connecteur au moment de construire (get_design_context + get_screenshot sur le nœud). Ne jamais modifier le fichier. Info manquante ou quota atteint : demander.
- N'inventer aucune valeur. S'il manque un état, une valeur ou un écran : s'arrêter et demander.
- Lire les descriptions des composants Figma. Un composant React par composant Figma, mêmes noms, variantes = props typées.
- Les composants n'utilisent que les alias, sauf la palette d'habitude. Pas d'hexa en dur.
- Comparer chaque écran à get_screenshot.
- Une phase à la fois : commit + push, résumé, puis attendre la validation. Répondre en français.

## Stack
Vite + React + TypeScript strict, Tailwind 4, React Router, vite-plugin-pwa, Hugeicons, Supabase (phase 5). `base` = `/constance/`, `404.html` copié au build.
Commandes : `npm run dev`, `npm run build` (typecheck inclus), `npm run preview`.
`.nvmrc` fixe Node (donc npm) à l'identique en local et en CI, sinon `npm ci` échoue sur le lockfile.

## Structure
- `src/styles/tokens.css` : primitives + alias. `src/styles/theme.css` : thème Tailwind et styles de texte (`type-h1`, `type-text-md`…).
- Classes : `bg-background-*`, `text-text-icon-*`, `border-border-*`, espacements et rayons nommés comme dans Figma (`p-16` = 16 px, `rounded-24`).
- `src/lib/dates.ts` : dates locales `YYYY-MM-DD` (type `Day`), semaines, formats.
- `src/lib/habitColors.ts` : `accentStyle(color)` pose `--accent` et `--accent-on` sur le conteneur de l'habitude.
- `src/components/` : un composant par composant Figma. États Empty/Filled/Focus des inputs = valeur + focus.
- `src/pages/` : Home, HabitDetail, Notes, SignIn + sheets (HabitSheets, NoteSheet, ChooseMonthSheet). Routes `/`, `/habits/:id`, `/habits/:id/notes`, `/sign-in` (`?expired`), `/kit`.
- `src/data/store.tsx` : données factices en mémoire derrière `useStore()`, à remplacer par Supabase en phase 6.
- `src/components/Icon.tsx` : icônes Icon/*, trait 2 px à toutes les tailles. `src/pages/Kit.tsx` : page `/kit`.

## Décisions
- Accent = teinte /300 (Yellow /200), on-accent = /950. Primary (blanc) jamais lié à une habitude, Accent oui.
- Typo selon Figma : titres Plus Jakarta Sans SemiBold, textes Inter Regular et Medium (le brief disait Inter Regular et Semi Bold).
- Letter-spacing des titres en %, line-height 100 = Auto.
- Tokens alignés sur `DESIGN_SYSTEM.md`.
- Text-Icon/inverted = Neutral/950.
- Connexion : lien magique + code à saisir dans la PWA (iOS sépare Safari et PWA). Le champ code reste à dessiner dans Figma (Check your email).
- `anon key` et URL Supabase : secrets GitHub, jamais dans le code.
- 18 couleurs d'habitude : 17 teintes + Neutral/300, Yellow par défaut.
- Large text input : ni compteur ni limite de caractères.
- Segment actif `Background/selected`, texte inactif secondary : validé.
- Auteur des commits : adresse noreply GitHub.
- Web : pas de responsive, colonne mobile de 390 px centrée dès 640 px. Les overlays (Bottom sheet…) doivent rester dans cette colonne.

## Règles métier
- Semaine lundi-dimanche, dates locales.
- Home : le bouton check = aujourd'hui (optimiste), précédé de 14 Day dot pour les jours d'avant (hier à droite).
- Bottom sheet : poignée glissée vers le bas = Cancel.
- Heatmap : 26 semaines défilantes, anneau Today. Fondu de chaque côté où il reste à défiler, grille jusqu'au bord droit de la carte. Nom de mois aligné sur la colonne du 1er du mois (Figma les place au hasard). Écran Notes : Day dot « M + note » les jours avec note.
- Rattrapage d'un jour passé : sheet Add note, Pick a date puis bouton check.
- Calendar : choix du mois, appui long = ajouter une note.
- Note = un jour + un texte, liée à une habitude, Done/Not done selon le check du jour.
- Create : Save désactivé si nom vide. Edit : quitter avec changements ouvre Unsaved changes. Delete habit supprime checks et notes.

## Données (phase 5)
Toutes avec `user_id uuid default auth.uid()` et RLS `user_id = auth.uid()`, SQL en migration :
- habits : id, name, description, type (build | quit), color, position, created_at
- checkins : id, habit_id (cascade), day, unique(habit_id, day)
- notes : id, habit_id (cascade), day, body, created_at, updated_at
Auth : supabase-js, flowType pkce, session persistante. Expliquer ensuite comment désactiver les inscriptions.

## Phases
- [x] 0. Projet, PWA, GitHub Pages
- [x] 1. Tokens, typo, icônes
- [x] 2. Composants de base + /kit
- [x] 3. Composants composés
- [ ] 4. Écrans, données factices : codé, à valider
- [ ] 5. Supabase, RLS, auth
- [ ] 6. Vraies données
- [ ] 7. Finitions PWA (icônes, safe areas, iPhone)

## Points ouverts
- Quota Figma MCP (plan Starter) atteint : lire dans le navigateur intégré (panneau de droite, lien `?node-id=`, ~15 s de chargement, clic Cmd pour un calque, jamais d'édition). Relevé : `docs/figma-notes.md`.
- Large text input : dans Figma, Counter existe encore mais Show counter = False par défaut ; non repris dans le code.
- Habit card : DESIGN_SYSTEM dit Text md pour le nom ; le code suit Figma, Text xl et Neutral/200 (primitive, seule exception aux alias, aussi pour le titre de Add note).
- Icône check de Habit card : pas un Icon/*, tracé repris dans `docs/figma-notes.md`.
- `Visuels/` (originaux, non commités) : Background_Visual = Sign in, Habit_Empty = Home vide, Note_Empty = Notes vide. Copies utilisées dans `src/assets/`. Icône de l'app à fournir.
- npm audit : 4 alertes modérées via vite-plugin-pwa, build seulement.
- Choix hors Figma : défilement de la Heatmap, appui long 500 ms, animation de la sheet 250 ms, glissement de fermeture 80 px ou geste rapide, « Today ».
- `focus-ring` (focus clavier, Border/focus) n'existe pas dans Figma : ajout d'accessibilité.
- Manquent dans Figma : supprimer une note, déconnexion, réordonner les habitudes, champ code de Check your email. Plusieurs notes possibles le même jour.
- Text-Icon/inverted est lié au H1 de Home et Habit detail dans Figma, mais rendu blanc : le code utilise default.
- Phase 7 : clavier iOS devant les sheets, à tester.
