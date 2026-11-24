# Constance · Design System

> Reference for AI agents (Claude Code) and developers.
> **Source of truth: Figma** → https://www.figma.com/design/Fd7UWF1snuqUVdf2ocQJco/Habit-app (fileKey `Fd7UWF1snuqUVdf2ocQJco`).
> This file is a snapshot (2026-11-24). If it disagrees with Figma, Figma wins. Never edit Figma from code.

## Rules

1. Components use **Alias** variables only. Primitives are only used for the habit color palette.
2. Never hardcode a hex, size, spacing or radius that is not listed here or in Figma.
3. Dark mode only (single mode `Dark`).
4. **Dynamic accent**: yellow in the mockups is an example. Each habit has a color (a Tailwind hue). In code:
   - `Background/accent` and `Text-Icon/accent` = habit hue **/300** (exception: Yellow → **/200**)
   - `Text-Icon/on-accent` = same hue **/950**
   - Implement as CSS variables (`--accent`, `--accent-on`) set on each habit's container.
5. Missing token, state or screen in Figma → stop and ask, do not invent.

---

## 1. Variables

### Collections

| Collection | Modes | Role |
|---|---|---|
| Primitive | Mode 1 | Raw values: Tailwind colors, Black, White, Spacing, Radius |
| Alias | Dark | Semantic tokens used by components |

### 1.1 Alias colors (use these in components)

| Token | → Primitive | Value | Figma scopes | Usage |
|---|---|---|---|---|
| `Background/default` | Black | `#000000` | frame, shape fill | Page background. |
| `Background/surface` | Neutral/900 | `#171717` | frame, shape fill | Cards, inputs, sheets, calendar and pickers. |
| `Background/elevated` | Neutral/800 | `#262626` | frame, shape fill | Secondary buttons, chips, elements on a surface. Not-done day dot. |
| `Background/selected` | Neutral/700 | `#404040` | frame, shape fill | Selected or pressed state of neutral elements. |
| `Background/inverted` | White | `#ffffff` | frame, shape fill | Primary button, high-emphasis elements. Text on it: `Text-Icon/inverted`. |
| `Background/overlay` | Black alpha/50 | `#00000080` | frame, shape fill | Dim layer behind modals and bottom sheets. |
| `Background/accent` | Yellow/200 *(dynamic)* | `#fff085` | frame, shape fill | Accent buttons, done days, note dot. Text on it: `Text-Icon/on-accent`. |
| `Text-Icon/default` | White | `#ffffff` | shape, text fill, stroke | Main text and icons. |
| `Text-Icon/secondary` | Neutral/400 | `#a1a1a1` | shape, text fill, stroke | Labels, supporting text. |
| `Text-Icon/tertiary` | Neutral/500 | `#737373` | shape, text fill, stroke | Placeholders, hints, disabled or future items. |
| `Text-Icon/inverted` | Neutral/950 | `#0a0a0a` | shape, text fill, stroke | Text and icons on `Background/inverted`. |
| `Text-Icon/danger` | Red/400 | `#ff6467` | shape, text fill, stroke | Error messages, destructive actions. |
| `Text-Icon/accent` | Yellow/200 *(dynamic)* | `#fff085` | shape, text fill, stroke | Accent text and icons on dark backgrounds (today in calendar, edit icon, Undo). |
| `Text-Icon/on-accent` | Yellow/950 *(dynamic)* | `#432004` | shape, text fill, stroke | Text and icons on `Background/accent`. |
| `Border/default` | Neutral/800 | `#262626` | stroke | Default border of cards and inputs. |
| `Border/strong` | Neutral/700 | `#404040` | stroke | Stronger border, visible dividers. |
| `Border/focus` | White | `#ffffff` | stroke | Focused input, selected note, ring of the current day. |
| `Border/danger` | Red/400 | `#ff6467` | stroke | Input in error. |

### 1.2 Primitive colors

| Name | Value | Note |
|---|---|---|
| `Black` | `#000000` | Behind `Background/default`. |
| `White` | `#ffffff` | |
| `Black alpha/50` | `#00000080` | Behind `Background/overlay`. |

Tailwind palette (v4 values). Habit colors = **/300** of each hue (Yellow = **/200**); text on accent = **/950**. Neutral feeds the Background / Text-Icon / Border aliases.

| Hue | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Neutral | `#fafafa` | `#f5f5f5` | `#e5e5e5` | `#d4d4d4` | `#a1a1a1` | `#737373` | `#525252` | `#404040` | `#262626` | `#171717` | `#0a0a0a` |
| Red | `#fef2f2` | `#ffe2e2` | `#ffc9c9` | `#ffa2a2` | `#ff6467` | `#fb2c36` | `#e7000b` | `#c10007` | `#9f0712` | `#82181a` | `#460809` |
| Orange | `#fff7ed` | `#ffedd4` | `#ffd6a7` | `#ffb86a` | `#ff8904` | `#ff6900` | `#f54900` | `#ca3500` | `#9f2d00` | `#7e2a0c` | `#441306` |
| Amber | `#fffbeb` | `#fef3c6` | `#fee685` | `#ffd230` | `#ffb900` | `#fe9a00` | `#e17100` | `#bb4d00` | `#973c00` | `#7b3306` | `#461901` |
| Yellow | `#fefce8` | `#fef9c2` | `#fff085` | `#ffdf20` | `#fdc700` | `#f0b100` | `#d08700` | `#a65f00` | `#894b00` | `#733e0a` | `#432004` |
| Lime | `#f7fee7` | `#ecfcca` | `#d8f999` | `#bbf451` | `#9ae600` | `#7ccf00` | `#5ea500` | `#497d00` | `#3c6300` | `#35530e` | `#192e03` |
| Green | `#f0fdf4` | `#dcfce7` | `#b9f8cf` | `#7bf1a8` | `#05df72` | `#00c950` | `#00a63e` | `#008235` | `#016630` | `#0d542b` | `#032e15` |
| Emerald | `#ecfdf5` | `#d0fae5` | `#a4f4cf` | `#5ee9b5` | `#00d492` | `#00bc7d` | `#009966` | `#007a55` | `#006045` | `#004f3b` | `#002c22` |
| Teal | `#f0fdfa` | `#cbfbf1` | `#96f7e4` | `#46ecd5` | `#00d5be` | `#00bba7` | `#009689` | `#00786f` | `#005f5a` | `#0b4f4a` | `#022f2e` |
| Cyan | `#ecfeff` | `#cefafe` | `#a2f4fd` | `#53eafd` | `#00d3f3` | `#00b8db` | `#0092b8` | `#007595` | `#005f78` | `#104e64` | `#053345` |
| Sky | `#f0f9ff` | `#dff2fe` | `#b8e6fe` | `#74d4ff` | `#00bcff` | `#00a6f4` | `#0084d1` | `#0069a8` | `#00598a` | `#024a70` | `#052f4a` |
| Blue | `#eff6ff` | `#dbeafe` | `#bedbff` | `#8ec5ff` | `#51a2ff` | `#2b7fff` | `#155dfc` | `#1447e6` | `#193cb8` | `#1c398e` | `#162456` |
| Indigo | `#eef2ff` | `#e0e7ff` | `#c6d2ff` | `#a3b3ff` | `#7c86ff` | `#615fff` | `#4f39f6` | `#432dd7` | `#372aac` | `#312c85` | `#1e1a4d` |
| Violet | `#f5f3ff` | `#ede9fe` | `#ddd6ff` | `#c4b3ff` | `#a684ff` | `#8e51ff` | `#7f22fe` | `#7008e7` | `#5d0ec0` | `#4d179a` | `#2f0d68` |
| Purple | `#faf5ff` | `#f3e8ff` | `#e9d4ff` | `#dab2ff` | `#c27aff` | `#ad46ff` | `#9810fa` | `#8200db` | `#6e11b0` | `#59168b` | `#3c0366` |
| Fuchsia | `#fdf4ff` | `#fae8ff` | `#f6cfff` | `#f4a8ff` | `#ed6aff` | `#e12afb` | `#c800de` | `#a800b7` | `#8a0194` | `#721378` | `#4b004f` |
| Pink | `#fdf2f8` | `#fce7f3` | `#fccee8` | `#fda5d5` | `#fb64b6` | `#f6339a` | `#e60076` | `#c6005c` | `#a3004c` | `#861043` | `#510424` |
| Rose | `#fff1f2` | `#ffe4e6` | `#ffccd3` | `#ffa1ad` | `#ff637e` | `#ff2056` | `#ec003f` | `#c70036` | `#a50036` | `#8b0836` | `#4d0218` |

### 1.3 Spacing (padding and gap)

`Spacing/0` 0 · `Spacing/2` 2 · `Spacing/4` 4 · `Spacing/6` 6 · `Spacing/8` 8 · `Spacing/12` 12 · `Spacing/16` 16 · `Spacing/20` 20 · `Spacing/24` 24 · `Spacing/32` 32 · `Spacing/40` 40 · `Spacing/80` 80 · `Spacing/120` 120 (px)

Exception kept on purpose: the dots row of `Habit card` uses a 7px gap.

### 1.4 Radius

`Radius/0` 0 · `Radius/2` 2 · `Radius/4` 4 · `Radius/6` 6 · `Radius/8` 8 · `Radius/12` 12 · `Radius/16` 16 · `Radius/24` 24 · `Radius/32` 32 · `Radius/40` 40 · `Radius/full` 9999 (pills, circles) (px)

---

## 2. Text styles

| Style | Font | Weight | Size | Line height | Letter spacing | Case | Usage |
|---|---|---|---|---|---|---|---|
| `H1` | Plus Jakarta Sans | SemiBold | 28 | auto | -4% | | Screen title (Home "Constance", sign-in title). |
| `H2` | Plus Jakarta Sans | SemiBold | 20 | auto | -2% | | Sheet and modal titles. |
| `H3` | Plus Jakarta Sans | SemiBold | 16 | auto | -1% | | Section and card titles (Notes, habit name in headers). |
| `Text xl` | Inter | Medium | 20 | auto | 0 | | Large body text. |
| `Text lg` | Inter | Medium | 18 | auto | 0 | | Button L labels, emphasized body. |
| `Text md` | Inter | Regular | 16 | auto | 0 | | Default body: inputs, notes, habit names on cards. |
| `Text sm` | Inter | Regular | 14 | auto | 0 | | Labels, dates, helper text, small buttons. |
| `Text xs` | Inter | Regular | 12 | auto | 0 | | Weekday labels in the heatmap. |
| `caption` | Inter | Regular | 12 | auto | 0 | UPPERCASE | Month labels in the heatmap. |

---

## 3. Icons

Hugeicons free set, **stroke** style (`@hugeicons/react` + `@hugeicons/core-free-icons`). Color them with `Text-Icon/*`.

`Icon/Search` · `Icon/Settings` · `Icon/Add` · `Icon/Close` · `Icon/Chevron left` · `Icon/Chevron right` · `Icon/Chevron down` · `Icon/Calendar` · `Icon/Edit` · `Icon/Trash`

---

## 4. Components (Figma page "Ui-kit")

One React component per Figma component, **same name, same properties**. Variants become typed props.

### Buttons & controls

**Button** (`41:1399`, 30 variants)
- Props: `Label` text · `Show leading icon` bool · `Leading icon` icon · `Show trailing icon` bool · `Trailing icon` icon · `Kind` Primary / Secondary / Ghost / Accent / Danger · `Size` L / M / S · `State` Default / Disabled
- Primary = main action not tied to a habit (e.g. "Create a habit" on Home), max 1 per view. Secondary = alternative actions (Cancel, Edit, All notes, month navigation). Ghost = low emphasis. Accent = main action inside a habit, in its accent color (Save, Show month, Add a note). Danger = destructive (Don't save, Delete habit), always next to a safe option.
- Size L in sheets and footers (full width), M inline, S in dense rows. Disabled when the action is not available yet.

**Icon button** (`41:1436`, 15 variants)
- Props: `Icon` icon · `Kind` Primary / Secondary / Ghost / Accent / Danger · `Size` L / M / S
- Round, icon only. Header actions (Close, Back, Add), navigation (chevrons), action next to a main button (Calendar next to Save). Danger = red icon on Secondary background (delete habit).

**Segmented control** (`47:2166`)
- Props: `Option 1` text · `Option 2` text · `Selected` First / Second
- Exactly 2 mutually exclusive options (Build a habit / Quit a habit).

**Color dot** (`54:25186`)
- Props: `State` Default / Selected
- Habit color swatch in Edit habit. Fill = a primitive hue /300 (Yellow /200). One selected at a time (ring). The chosen color becomes the habit accent.

### Inputs

**Text input** (`41:1479`)
- Props: `Label` · `Value` · `Show icon` · `Icon` · `Show helper` · `Helper` · `Show label` · `State` Empty / Filled / Focus / Error / Disabled
- Single line (habit name, email). Error → turn on `Show helper` with the message.

**Large text input** (`41:1490`)
- Props: `Label` · `Value` · `Counter` · `Show label` · `Helper` · `Show helper` · `Show counter` · `State` Empty / Filled / Focus / Error / Disabled
- Multi-line (description, note). `Show counter` = used/max characters (e.g. 33/200).

**Picker column** (`47:2406`)
- Props: `Label` · `Item 1` · `Item 2` · `Selected`
- One wheel-picker column. Two side by side for month + year ("Choose month").

### Calendar

**Calendar day** (`48:14991`)
- Props: `Day number` text · `Show note` bool · `Show habit done` bool · `Day` Default / Prev/Next month / Current · `Habit` Done / Not done
- Current = today. Prev/Next month = greyed days outside the month. Done = accent color. Only inside Calendar.

**Calendar** (`86:6314`)
- Monthly calendar of one habit: weekday row, 6 weeks of Calendar day, footer (month selector, Today, previous/next). Press and hold a day to add a note.

### Cards & lists

**Habit card** (`42:7796`)
- Props: `Label` text · `Color` Grey / Yellow · `State` Checked / Not checked / Loading · `Type` Build (check) / Quit (cross)
- Home row: name, last 14 days as Day dot L (most recent on the right), check button. Checked = done today. In code, done dots and check use the habit accent. Cards stacked with 8px gap.

**Day dot** (`75:16158`, 16 variants)
- Props: `Size` S / M / L / M + note · `Habit` Done / Not done / Inactive (M only, Not done at 60%, Heatmap) · `Today` false / true
- Done = `Background/accent`, Not done = `Background/elevated`.
- Today = ring made with 2 drop shadows (white spread 2 + `Background/surface` spread 1), **no stroke**, clip content on.
- L 16px (Habit card), M 12px (Heatmap, Note item), S 8px, "M + note" = M with the Note icon inside (Notes heatmap).

**Note icon** (`86:5831`)
- Props: `Color` Light / Dark
- Only inside Day dot "M + note": Dark on a Done dot, Light on a Not done dot.

**Note item** (`47:2405`, 4 variants)
- Props: `Date` text · `Relative date` text · `Note` text · `State` Default / Selected · `Habit` Done / Not done
- Day dot M on the left (Done = accent, Not done = grey). Selected = `Border/focus` border + Edit button visible; Default keeps the Edit button at opacity 0 so the height does not change.

**Heatmap** (`90:6586`)
- Props: `Type` Default / Notes
- Last 26 weeks, one column per week, Mon → Sun, Day dot M. Default = Habit detail. Notes = Notes screen, days with a note use Day dot "M + note".

**Notes card** (`90:6589`)
- Props: `State` Default / Empty
- Notes preview on Habit detail: title + count, "All notes" button, latest 2 Note items. Empty = "No notes yet" + "Add a note".

### Overlays

**Bottom sheet** (`47:2113`)
- Props: `Content` slot
- Slides up over a full-screen frame filled with `Background/overlay`. Actions at the bottom: Button L full width, main action first (Accent inside a habit), then Secondary or Danger.

**Sheet footer** (`235:9800`)
- Main action fixed at the bottom of a tall Bottom sheet, `Background/surface` 75% + blur 16, content scrolls under it.

---

## 5. Screens (Figma page "Design")

| Flow | Screens |
|---|---|
| Sign in (magic link) | Sign in · Sign in · Email filled · Sign in · Check your email · Sign in · Link expired |
| Home | Home · Home · Empty |
| Habit detail | Habit detail · Habit detail - No notes · Habit detail · Choose month · Habit detail · Pick a date |
| Notes | Notes · Notes · Add note · Notes · Empty |
| Habit edit | Create habit · Edit habit · Edit habit · Unsaved changes · Edit habit · Delete habit |

Read each screen with the Figma MCP (`get_design_context`, `get_screenshot`) and compare your render to the screenshot.
