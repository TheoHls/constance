# Constance

PWA de suivi d'habitudes (régularité, pas performance). Un seul utilisateur, dark mode uniquement, iPhone 390 px d'abord.
En ligne : https://theohls.github.io/constance/ (repo public TheoHls/constance, déployé à chaque push sur main).

**Mets ce fichier à jour à la fin de chaque session** (état, décisions, points ouverts). Il est public : aucune donnée personnelle ni clé.

## Règles
- Figma est la source de vérité : fileKey `Fd7UWF1snuqUVdf2ocQJco`. Pages : Ui-kit `41:827`, Design `47:2414`, Moodboard (à ignorer).
- Figma en LECTURE SEULE, avec get_variable_defs, get_design_context, get_screenshot, get_metadata. Ne jamais modifier le fichier.
- N'inventer aucune valeur. S'il manque un état, une valeur ou un écran : s'arrêter et demander.
- Lire les descriptions des composants Figma. Un composant React par composant Figma, mêmes noms, variantes = props typées.
- Les composants n'utilisent que les alias, sauf la palette d'habitude. Pas d'hexa en dur.
- Comparer chaque écran à get_screenshot.
- Une phase à la fois : commit + push, résumé, puis attendre la validation. Répondre en français.

## Stack
Vite + React + TypeScript strict, Tailwind 4, React Router, vite-plugin-pwa, Hugeicons, Supabase (phase 5). `base` = `/constance/`, `404.html` copié au build.
Commandes : `npm run dev`, `npm run build` (typecheck inclus), `npm run preview`.
Le dev server du navigateur intégré n'a pas accès au dossier Bureau : lancer depuis le shell. `.nvmrc` fixe Node (donc npm) à l'identique en local et en CI, sinon `npm ci` échoue sur le lockfile.

## Structure
- `src/styles/tokens.css` : primitives + alias. `src/styles/theme.css` : thème Tailwind et styles de texte (`type-h1`, `type-text-md`…).
- Classes : `bg-background-*`, `text-text-icon-*`, `border-border-*`, espacements et rayons nommés comme dans Figma (`p-16` = 16 px, `rounded-24`).
- `src/lib/habitColors.ts` : `accentStyle(color)` pose `--accent` et `--accent-on` sur le conteneur de l'habitude.
- `src/components/Icon.tsx` : icônes Icon/*, 24 px, trait 2. `src/pages/Kit.tsx` : page `/kit`.

## Décisions
- Accent = teinte /300 (Yellow /200), on-accent = /950. Primary (blanc) jamais lié à une habitude, Accent oui.
- Typo selon Figma : titres Plus Jakarta Sans SemiBold, textes Inter Regular et Medium (le brief disait Inter Regular et Semi Bold).
- Letter-spacing des titres en %, line-height 100 = Auto.
- Palette complète reprise de Tailwind 4 : 26 des 27 valeurs lues dans Figma sont identiques, Violet/300 vient de Figma.
- Text-Icon/inverted = #0a0a0a (Ui-kit). Les écrans renvoient aussi #fafafa, origine à confirmer.
- Connexion : lien magique + code à saisir dans la PWA (iOS sépare Safari et PWA). Le champ code reste à dessiner dans Figma (Check your email).
- `anon key` et URL Supabase : secrets GitHub, jamais dans le code.
- Auteur des commits : adresse noreply GitHub.
- Web : pas de responsive, colonne mobile de 390 px centrée dès 640 px. Les overlays (Bottom sheet…) doivent rester dans cette colonne.

## Règles métier
- Semaine lundi-dimanche, dates locales.
- Home : 14 derniers jours (récent à droite), check d'aujourd'hui optimiste.
- Heatmap : 26 semaines, anneau Today. Écran Notes : Day dot « M + note » les jours avec note.
- Calendar : choix du mois, rattrapage d'un jour passé, appui long = ajouter une note.
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
- [ ] 1. Tokens, typo, icônes : codé, à valider
- [ ] 2. Composants de base + /kit
- [ ] 3. Composants composés
- [ ] 4. Écrans, données factices
- [ ] 5. Supabase, RLS, auth
- [ ] 6. Vraies données
- [ ] 7. Finitions PWA (icônes, safe areas, iPhone)

## Points ouverts
- Quota d'appels Figma (plan Starter) atteint pendant la phase 1 : descriptions des variables, espacements et rayons non utilisés dans les nœuds lus, non récupérés.
- L'icône check de Habit card n'est pas un Icon/* dans Figma.
- `Visuels/` (3 images) non commité, usage à vérifier en phase 4. Icône de l'app à fournir.
- npm audit : 4 alertes modérées via vite-plugin-pwa, build seulement.
- Neutral/300 est utilisé dans l'écran Edit habit : 18e couleur d'habitude ou non, à confirmer (aujourd'hui 17 teintes).
