# AI Rules & Project Guidelines

## Tech Stack
- **Framework**: React 18 with TypeScript for type-safe UI development.
- **Build Tool**: Vite for fast development and optimized production builds.
- **Styling**: Tailwind CSS for all layout, spacing, and component styling.
- **Icons**: Lucide React for a consistent and lightweight icon set.
- **UI Components**: Shadcn/UI (Radix UI primitives) for accessible, reusable components.
- **State Management**: React's built-in hooks (`useState`, `useMemo`, `useCallback`) for local and lifting state.
- **Navigation**: React Router for client-side routing.

## Development Rules

### 1. Styling & Layout
- Always use **Tailwind CSS** utility classes. Avoid writing custom CSS in `.css` files unless handling specific browser overrides (e.g., scrollbars, mobile Safari hacks).
- Ensure all designs are **mobile-responsive** using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`).
- Maintain the "dark/slate" aesthetic established in the header and sidebars.

### 2. Component Structure
- Keep components small and focused (under 100 lines where possible).
- Store reusable UI pieces in `src/components/` and full views in `src/pages/`.
- Every new component or hook must reside in its own file.
- **Refactoring Guideline**: When components exceed 100 lines or become complex, refactor into smaller sub-components. Break down by logical sections (e.g., headers, controls, sections) to improve maintainability. Ensure all existing features (e.g., state, interactions, UI behaviors) are preserved during refactoring. Test thoroughly to confirm no functionality is lost.

### 3. Iconography
- Use **Lucide React** exclusively. Do not import other icon libraries to keep the bundle size small and the design language unified.

### 4. Data & State
- Define all shared interfaces and constants in `src/type.tsx`.
- Use `useMemo` for derived data (like filtering dead players) to optimize performance.
- When updating complex state (like arrays of objects), always use functional updates to ensure state consistency.

### 5. Best Practices
- Use **Toasts** for important user feedback (success/error).
- Avoid `try/catch` blocks for general logic to allow errors to bubble up during development for easier debugging.
- Keep the "Ledger" aesthetic: compact, high-density information, and monospaced fonts for numerical data.

## Project Structure

```
src/
├── components/
│   ├── layout/           # Layout components
│   │   ├── Header.tsx
│   │   └── PlayerHub.tsx
│   ├── ledger/           # Main ledger components
│   │   ├── PlayerGrid.tsx
│   │   ├── VoteLedger.tsx
│   │   └── DeathLedger.tsx
│   ├── pickers/          # Interactive picker components
│   │   ├── RotaryPicker/
│   │   │   ├── RotaryPicker.tsx
│   │   │   └── TextRotaryPicker.tsx
│   │   └── ClockPicker/
│   │       └── ClockPicker.tsx
│   ├── tabs/             # Tab content components
│   │   ├── PlayersTab.tsx
│   │   ├── VotesTab.tsx
│   │   ├── CharsTab.tsx
│   │   └── NotesTab.tsx
│   ├── popitems/         # UI components and popups
│   │   ├── popups/
│   │   │   ├── LedgerTabsPopup.tsx
│   │   │   ├── RoleSelectorPopup.tsx
│   │   │   ├── RoleUpdatePopup.tsx
│   │   │   ├── ResetConfirmation.tsx
│   │   │   ├── SettingsPopup.tsx
│   │   │   └── AboutPopup.tsx
│   │   ├── VoteHistoryClock/
│   │   │   ├── VoteHistoryClock.tsx
│   │   │   ├── ClockFace.tsx
│   │   │   ├── PlayerSlices.tsx
│   │   │   ├── VoteArrows.tsx
│   │   │   └── ClockCenter.tsx
│   │   ├── FAB.tsx
│   │   └── Sidebar.tsx
│   ├── player-detail/    # Player detail view sub-components
│   │   ├── DetailHeader.tsx
│   │   ├── AssignmentControls.tsx
│   │   ├── NoteSection.tsx
│   │   └── StatusSection.tsx
│   ├── PlayerDetailView.tsx # Main player focus view
│   └── GlobalVotingView.tsx # Global game state view
├── hooks/
│   └── useGameState.ts    # Custom hook for game state management
├── type.tsx              # TypeScript type definitions
├── App.tsx               # Main application component
├── main.tsx              # Application entry point
└── index.css             # Global styles
```

Directory names MUST be all lower-case (src/pages, src/components, etc.). File names may use mixed-case if you like.