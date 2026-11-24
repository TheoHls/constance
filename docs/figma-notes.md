# Relevé Figma

Lu dans le fichier, sert de référence quand Figma n'est pas accessible.

## Button (41:1399)
Props : Kind (Primary, Secondary, Ghost, Accent, Danger), Size (L, M, S), State (Default, Disabled), Label, Show leading icon (false), Leading icon (Add), Show trailing icon (false), Trailing icon (Chevron right).
- Rayon full, gap Spacing/8, padding vertical 0, largeur Hug. Disabled = opacité 40 %.
- L : h 48, px Spacing/20, Text lg. M : h 40, px 16, Text sm. S : h 32, px 12, Text sm.
- Fond / texte : Primary inverted / inverted, Secondary elevated / default, Ghost aucun / default, Accent accent / on-accent, Danger elevated / danger.
- Icônes : L 20, M 20, S 16.

## Icon button (41:1436)
Props : Kind (mêmes), Size (L 48, M 40, S 32), Icon (Add). Pas d'état Disabled. Rayon full, mêmes couleurs que Button.
- Icône : L 22, M 20, S 18.

## Segmented control (47:2166)
Props : Selected (First, Second), Option 1 « Build a habit », Option 2 « Quit a habit ». 350 x 48, p Spacing/4, gap 4, rayon full, Background/elevated, bordure 1 Border/strong. Segment actif Background/selected, Text-Icon/default ; autre Text-Icon/secondary. Text sm. (Couleur du segment actif et du texte inactif déduites des couleurs de sélection et du rendu.)

## Color dot (54:25186)
48 px, rayon full. Selected = ombres spread 2 Neutral/900 + spread 4 couleur.

## Day dot (75:16158)
S 8, M 12, L 16, « M + note » = M + Note icon. Done = Background/accent, Not done = Background/elevated. Today = 2 ombres (blanc spread 2 + surface spread 1).

## Habit card (42:7796)
374 de large, p Spacing/20, gap 16, rayon 24, Background/surface, bordure Border/default. Titre Text xl, Neutral/200. Points : gap 7, alignés à droite, débordement masqué. Bouton check 40 px : non coché elevated + bordure 2,5 Neutral/500, icône Border/strong ; coché accent, icône on-accent. Check : `M5 13.2592L7.58583 15.9568C8.2525 16.6523 8.58583 17 9.00004 17C9.41425 17 9.74759 16.6523 10.4143 15.9568L19 7`, trait 3.

## Text input (41:1479)
340 large, gap 8. Label Text sm secondary. Champ h 52, px 16, gap 12, rayon 16, Background/elevated, valeur Text md, icône 20. Bordure intérieure 1,5 : Empty/Filled/Disabled Border/default, Error Border/danger ; Focus 2 Border/focus. Placeholder tertiary. Disabled = opacité 45 %.
Helper : Text sm tertiary, danger en Error.

## Large text input (41:1490)
Même cadre, p 16, champ 92 (valeur 57 min). Pas de compteur ni de limite (décision utilisateur). Disabled 45 %.

## Picker column (47:2406)
160 x 171, gap 8, centré. Label caption tertiary. Items h 44, rayon 12, Text md tertiary ; Item 1 opacité 50 %. Selected Background/elevated, Text-Icon/default.

## Note icon (86:5831)
Rectangles 6x1 (y 0), 6x1 (y 2), 4x1 (y 4). Light Background/inverted, Dark Background/surface.
