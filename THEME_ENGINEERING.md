# Theme Engineering & Visual Layering Guidelines

This document outlines the architectural principles for maintaining a scalable, theme-aware UI in the BOTCT-ClockTracker application.

## 1. Functional Variables (Semantic Naming)

Instead of naming variables based on their literal appearance (e.g., `--red-color`), we name them based on their **function** or **purpose**.

### Core Concept
Variables should answer the question: *"What does this element represent?"* rather than *"What color is it?"*

### Implementation Examples
| Type | Functional Variable | Usage |
| :--- | :--- | :--- |
| **Structural** | `--bg-color` | The main canvas or backdrop. |
| **Surface** | `--panel-color` | Secondary containers, cards, or clock slices. |
| **Action** | `--accent-color` | Primary buttons, active nominations, or focus states. |
| **Status** | `--muted-color` | Secondary text, historical data, or disabled states. |

### Benefits
*   **Theme Portability**: A "Dark Theme" can swap a white `--panel-color` for a charcoal one without changing a single line of component logic.
*   **Predictability**: Developers know exactly which variable to use for a new feature based on its semantic role.

---

## 2. Layering Strategy (Visual Hierarchy)

The Vote History Clock and Ledger are data-dense. Layering ensures that information remains legible even when multiple data points overlap.

### The Priority Stack (Z-Order)
1.  **Behavioral Layer (Top)**: Active gestures, current nomination lines, and hover spotlights. (High opacity, vibrant colors).
2.  **Contextual Layer (Middle)**: Current game day data, "Dead" status icons, and property tags. (Medium-high opacity).
3.  **Historical Layer (Bottom)**: Past voting patterns and previous days' rings. (Lower opacity, muted tones).
4.  **Structural Layer (Base)**: Clock axes, grid lines, and slice borders. (Very low opacity, subtle borders).

### Techniques for Clarity
*   **Variable Opacity**: Use `rgba` wrappers around functional variables (e.g., `rgba(var(--text-color-rgb), 0.2)`) to create depth without introducing new colors.
*   **Stroke Weight Differentiation**: Use thicker strokes for "Active" states and hairline strokes for "Structural" backgrounds.
*   **Shadows & Glows**: Use theme-aware shadows (using `--accent-color`) to lift behavioral elements off the contextual layer.

---

## 3. Applying to New Features

When adding features like **"Drunk/Poisoned"** or **"Madness"** indicators:
1.  **Define the Logic**: Determine if the indicator is *Global* (structural) or *Player-Specific* (contextual).
2.  **Assign a Functional Variable**: If the state is critical, use a derivative of `--accent-color`. If it is informative, use a derivative of `--muted-color`.
3.  **Position in the Stack**: Place the new indicator in the **Contextual Layer** so it doesn't interfere with the **Behavioral Layer** (voting gestures) but remains clearly visible over the **Historical Layer** (past patterns).