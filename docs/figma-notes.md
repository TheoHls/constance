# Relevé Figma

Lu dans le fichier, sert de référence quand Figma n'est pas accessible.

## Button (41:1399)
Props : Kind (Primary, Secondary, Ghost, Accent, Danger), Size (L, M, S), State (Default, Disabled), Label, Show leading icon (false), Leading icon (Add), Show trailing icon (false), Trailing icon (Chevron right).
- Rayon full, gap Spacing/8, padding vertical 0, largeur Hug. Disabled = opacité 40 %.
- L : h 48, px Spacing/20, Text lg. M : h 40, px 16, Text sm. S : h 32, px 12, Text sm.
- Fond / texte : Primary inverted / inverted, Secondary elevated / default, Ghost aucun / default, Accent accent / on-accent, Danger elevated / danger.
- Taille des icônes : non lue.

## Icon button (41:1436)
Props : Kind (mêmes), Size (L 48, M 40, S 32), Icon (Add). Pas d'état Disabled. Rayon full, mêmes couleurs que Button.
- Icône : L 22, M 20, S 18 (déduit du décalage du tracé 3,67 / 3,33 / 3).

## Segmented control (47:2166)
Props : Selected (First, Second), Option 1 « Build a habit », Option 2 « Quit a habit ». 350 x 48 dans le kit. Détails internes non lus.

## Color dot (54:25186)
48 px, rayon full. Selected = ombres spread 2 Neutral/900 + spread 4 couleur.

## Day dot (75:16158)
S 8, M 12, L 16, « M + note » = M + Note icon. Done = Background/accent, Not done = Background/elevated. Today = 2 ombres (blanc spread 2 + surface spread 1).

## Habit card (42:7796)
374 de large, p Spacing/20, gap 16, rayon 24, Background/surface, bordure Border/default. Titre Text xl, Neutral/200. Points : gap 7, alignés à droite, débordement masqué. Bouton check 40 px : non coché elevated + bordure 2,5 Neutral/500, icône Border/strong ; coché accent, icône on-accent. Check : `M5 13.2592L7.58583 15.9568C8.2525 16.6523 8.58583 17 9.00004 17C9.41425 17 9.74759 16.6523 10.4143 15.9568L19 7`, trait 3.
