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
- Use CSS variables (defined in `App.tsx`) for theme-aware styling (e.g., `var(--bg-color)`, `var(--accent-color)`).

### 2. Component Structure
- Keep components small and focused (under 100 lines where possible).
- Store reusable UI pieces in `src/components/` and specialized sub-sections in their respective folders.
- Every new component or hook must reside in its own file.
- **Directory names** must be all lower-case (e.g., `src/components/ledger`).

### 3. Iconography
- Use **Lucide React** exclusively for consistency across the application.

### 4. Data & State
- Define all shared interfaces and constants in `src/type.tsx`.
- Use `useMemo` for derived data (like filtering dead players) to optimize performance.
- When updating complex state, always use functional updates to ensure consistency.
- Shared logic (storage, theme management, session snapshots) lives in `useGameState.ts`.

### 5. Best Practices
- Use **Toasts** (react-hot-toast) for important user feedback.
- Avoid `try/catch` blocks for general logic to allow errors to bubble up during development.

## Project Structure

```
src/
├── components/
│   ├── layout/           # Layout-level components (Header, Hub)
│   ├── ledger/           # Table-based ledger components
│   │   ├── DeathLedger/
│   │   ├── PlayerGrid/
│   │   └── VoteLedger/
│   ├── pickers/          # Interactive input components (Rotary, Clock)
│   ├── player-detail/    # Specialized sections for PlayerDetailView
│   ├── tabs/             # Content tabs used within LedgerTabsPopup
│   ├── popitems/         # UI popups and modularized clock
│   │   ├── popups/       # Modals (Settings, About, Roster, etc.)
│   │   │   └── settings/ # Nested settings sub-sections
│   │   ├── VoteHistoryClock/ # Modularized SVG clock components
│   │   ├── FAB.tsx       # Floating Action Button
│   │   └── GreetingPopup.tsx
│   ├── Sidebar.tsx       # Main navigation drawer
│   ├── PlayerDetailView.tsx # Main player focus view
│   └── GlobalVotingView.tsx # Global game state overview
├── hooks/
│   └── useGameState.ts    # Centralized game state and storage logic
├── type.tsx              # TypeScript type definitions and constants
├── App.tsx               # Root component and theme provider
├── main.tsx              # Application entry point
└── index.css             # Global styles and Tailwind imports