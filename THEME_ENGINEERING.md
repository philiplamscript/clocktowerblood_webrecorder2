# BOTCT-ClockTracker: Theme & Layering Architecture

This document details how our specific application implements theme-aware design and visual hierarchy.

## 1. Functional Variables (Implemented in `App.tsx`)

Our theme engine uses a fixed set of semantic variables defined in `src/type.tsx` and applied in the root `App.tsx`.

| CSS Variable | App Role | Specific Components |
| :--- | :--- | :--- |
| `--bg-color` | Global Backdrop | Main screen background, sidebar overlay. |
| `--panel-color` | Interaction Surface | Player slices in the clock, detail view cards, ledger rows. |
| `--header-color` | Identity & Focus | Top navigation, the center ball of the Vote Clock. |
| `--accent-color` | Critical Action | Active nominations, voting highlights, primary buttons. |
| `--text-color` | Primary Content | Player notes, role names, numerical data. |
| `--border-color` | Structural Divider | Clock rings, axis lines, table borders. |
| `--muted-color` | Contextual History | Past day rings, secondary labels (D1, D2), placeholder text. |

---

## 2. Layering Strategy (The Vote History Clock)

The `VoteHistoryClock` is built using a "Top-Down" SVG stack. Higher layers in the code appear "closer" to the user.

### Layer 1: Behavioral (Top)
*   **Components**: `VoteArrows.tsx`, `ClockCenter.tsx`.
*   **Visuals**: Bright reds/purples for active nominations. The center ball pulses when in "Voting Mode".
*   **Logic**: Uses `--accent-color` for high visibility.

### Layer 2: Contextual (Interaction)
*   **Components**: `PlayerSlices.tsx` (Labels & Tags).
*   **Visuals**: Player numbers (1-15), Property tags (🔴, 🔮), and Death reason icons (⚔️).
*   **Logic**: Uses `--text-color` for legibility and specialized status colors (Red/Blue/Green) for assignment modes.

### Layer 3: Historical (Data)
*   **Components**: `PlayerSlices.tsx` (Rings).
*   **Visuals**: Concentric rings representing vote counts from previous days.
*   **Logic**: Uses `rgba()` variants of theme colors with low opacity so multiple days remain visible simultaneously.

### Layer 4: Structural (Base)
*   **Components**: `ClockFace.tsx`.
*   **Visuals**: The cross-axis, ring dividers, and day markers (D1, D2).
*   **Logic**: Uses `--border-color` and `--muted-color` at ~20% opacity to provide a grid without distracting from game data.

---

## 3. Extension Protocol

When adding new features (e.g., "Madness" or "Poison" markers):
1.  **Placement**: Add them to the **Contextual Layer** (`PlayerSlices.tsx`).
2.  **Coloring**: Use a theme-aware stroke (e.g., `stroke: var(--accent-color)`) if the state is active, or a fill override if it is a persistent state.
3.  **Consistency**: Ensure the new element respects the `rotationAngle` defined in `ClockFace.tsx` so it aligns with the player's slice regardless of screen orientation.