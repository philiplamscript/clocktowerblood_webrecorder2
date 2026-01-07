# Clocktower Ledger Pro

A comprehensive web application for tracking and managing Clocktower (Blood on the Clocktower) game sessions, built with React, TypeScript, and Tailwind CSS.

## Features

- **Player Management**: Track player information, status, and roles with detailed popups and player detail views
- **Vote Ledger**: Record and analyze voting patterns with interactive clock pickers and drag-and-drop voting
- **Death Ledger**: Log player deaths with reasons and notes
- **Role Management**: Organize and track character roles and distributions with role update functionality
- **Notes System**: Keep detailed social reads and game observations
- **Assignment Modes**: Quickly assign death reasons or custom properties to players via the player hub
- **Vote History Clock**: Visualize voting patterns and nominations in an interactive clock interface with multiple view modes
- **Font Size Selector**: Adjust text size for better readability (small, mid, large)
- **Data Export**: Export all game data for external use (FAB button placeholder)
- **Split View Mode**: Toggle between single player detail view and split view with global voting overview
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Data Persistence**: Automatic local storage of all game data

## Project Structure

```
src/
├── components/
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
│   │   │   └── ResetConfirmation.tsx
│   │   ├── VoteHistoryClock.tsx
│   │   └── FAB.tsx
│   ├── PlayerDetailView.tsx # Main player focus view with voting patterns
│   └── GlobalVotingView.tsx # Global game state view with voting overview
├── type.tsx              # TypeScript type definitions
├── App.tsx               # Main application component
├── main.tsx              # Application entry point
└── index.css             # Global styles
```

## Tech Stack

- **Framework**: React 18 with TypeScript for type-safe UI development.
- **Build Tool**: Vite for fast development and optimized production builds.
- **Styling**: Tailwind CSS for all layout, spacing, and component styling.
- **Icons**: Lucide React for a consistent and lightweight icon set.
- **UI Components**: Shadcn/UI (Radix UI primitives) for accessible, reusable components.
- **State Management**: React's built-in hooks (`useState`, `useMemo`, `useCallback`) for local and lifting state.
- **Navigation**: React Router for client-side routing (not currently used).

## Development Rules

### 1. Styling & Layout
- Always use **Tailwind CSS** utility classes. Avoid writing custom CSS in `.css` files unless handling specific browser overrides (e.g., scrollbars, mobile Safari hacks).
- Ensure all designs are **mobile-responsive** using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`).
- Maintain the "dark/slate" aesthetic established in the header and sidebars.

### 2. Component Structure
- Keep components small and focused (under 100 lines where possible).
- Store reusable UI pieces in `src/components/` and full views in `src/pages/`.
- Every new component or hook must reside in its own file.

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

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser to `http://localhost:5173`

## Usage

- Click on player numbers in the hub to open detailed player info popups or assign in assignment mode
- Use the day controls to navigate through game days
- Enable assignment modes (Death or Property) to quickly assign reasons or properties to players
- Add nominations and deaths using the FAB (Floating Action Button)
- Track voting patterns with the interactive vote ledger and drag-and-drop
- Manage roles and distributions in the Roles tab, with role update popup for bulk changes
- Keep notes for social reads and observations
- Adjust font size via the FAB for better readability
- Toggle split view to see global voting patterns alongside player details
- Export data when needed (feature placeholder in FAB)

## Contributing

1. Follow the established component organization structure
2. Maintain TypeScript type safety
3. Use Tailwind CSS for all styling
4. Keep components modular and reusable
5. Test on both desktop and mobile devices

## License

This project is licensed under the MIT License.