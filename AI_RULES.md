# AI Rules & Project Guidelines

## Tech Stack
- **Framework**: React 18 with TypeScript for type-safe UI development.
- **Build Tool**: Vite for fast development and optimized production builds.
- **Styling**: Tailwind CSS for all layout, spacing, and component styling.
- **Icons**: Lucide React for a consistent and lightweight icon set.
- **UI Components**: Custom-built accessible components with a "Ledger" aesthetic.
- **State Management**: React's built-in hooks (`useState`, `useMemo`, `useCallback`) for local and lifting state.
- **State Logic**: Centralized logic in `src/hooks/useGameState.ts`.

## Development Rules

### 1. Styling & Layout
- Always use **Tailwind CSS** utility classes.
- Ensure all designs are **mobile-responsive** using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`).
- Maintain the established aesthetic: compact, high-density information, and monospaced fonts for numerical data.
- Use CSS variables (defined in `App.tsx`) for theme-aware styling.

### 2. Component Structure
- Keep components small and focused (under 100 lines where possible).
- Store reusable UI pieces in `src/components/` and full views in `src/components/` as well (e.g., `PlayerDetailView.tsx`).
- Every new component or hook must reside in its own file.
- **Directory names** must be all lower-case (e.g., `src/components/ledger`).

### 3. Iconography
- Use **Lucide React** exclusively for consistency.

### 4. Data & State
- Define all shared interfaces and constants in `src/type.tsx`.
- Use `useMemo` for derived data (like filtering dead players) to optimize performance.
- When updating complex state, always use functional updates to ensure consistency.

### 5. Best Practices
- Use **Toasts** (react-hot-toast) for important user feedback.
- Avoid `try/catch` blocks for general logic to allow errors to bubble up during development.

## Project Structure

```
src/
├── components/
│   ├── layout/           # Layout-level components
│   │   ├── Header.tsx
│   │   └── PlayerHub.tsx
│   ├── ledger/           # Table-based ledger components
│   │   ├── PlayerGrid.tsx
│   │   ├── VoteLedger.tsx
│   │   └── DeathLedger.tsx
│   ├── pickers/          # Interactive input components
│   │   ├── RotaryPicker/
│   │   └── ClockPicker/
│   ├── tabs/             # Tab content for the Ledger Popup
│   ├── popitems/         # UI popups and overlay elements
│   │   ├── popups/       # Modals (Settings, About, Ledger, etc.)
│   │   │   └── settings/ # Nested settings sections
│   │   ├── VoteHistoryClock/ # Modularized clock components
│   │   ├── FAB.tsx
│   │   └── GreetingPopup.tsx
│   ├── Sidebar.tsx       # Main navigation drawer
│   ├── PlayerDetailView.tsx # Main player focus view
│   └── GlobalVotingView.tsx # Global game state view
├── hooks/
│   └── useGameState.ts    # Centralized game state management
├── type.tsx              # TypeScript type definitions and constants
├── App.tsx               # Root component and theme provider
├── main.tsx              # Application entry point
└── index.css             # Global styles and Tailwind imports