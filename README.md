# BOTCT-ClockTracker

Fan-made note companion for *Blood on the Clocktower*. During a live game, track player reads, nominations, votes, deaths, and role-script info on a clock-style board — then review or export the session later. Data stays in the browser (localStorage). Not an official product.

## Core loop

1. Select a player from the hub or detail view.
2. Record social reads, role claims, and notes.
3. Slide from nominee to target on the Vote History Clock to create a nomination.
4. Enter voting mode and mark voters.
5. Assign death reasons or properties by day as the game progresses.
6. Open the Full Ledger for tables, role script, and notes — or save/export the session.

## Main UI map

| Surface | What it does |
| :--- | :--- |
| **Header** | Open sidebar, Full Ledger, and Player Hub toggle |
| **Player Hub** | Day controls, player chips, death/property assignment modes |
| **Player Detail** | Focused notes, status, and the Vote History Clock |
| **FAB / Full Ledger** | Players, Votes, Chars (role script), and Notes tabs |
| **Sidebar** | Reset, roster, settings, about, and help |

## Features

- **Player Management**: Track player information, status, and roles with detailed notes.
- **Vote History Clock**: Interactive visualization of voting patterns and nominations with slide-to-nominate gestures.
- **Full Ledger System**: Tables for Players, Votes, Roles, and general Notes.
- **Assignment Modes**: Quickly assign death reasons or custom properties (e.g., Poisoned, Drunk) to players.
- **Role Script Keywords**: Load the session script so role names can be inserted into notes.
- **Session Save / Load / Export**: Snapshot games and move them between devices via import/export.
- **Theme System**: Choose from built-in themes (Standard, Knights, Grimoire, Puppet Master) or generate your own using AI.
- **Customization**: Create reusable notepad templates and property shortcuts to speed up tracking.
- **Responsive Design**: Layout optimized for game-time speed on desktop and mobile.
- **Data Persistence**: Automatic local storage of game data across refreshes.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Project Structure

```
src/
├── components/
│   ├── layout/              # Header, Player Hub
│   ├── ledger/              # Dense table views (PlayerGrid, VoteLedger, …)
│   ├── pickers/             # Rotary and clock input UI
│   ├── player-detail/       # Notes, status, assignment controls
│   ├── tabs/                # Ledger tabs (Players, Votes, Chars, Notes)
│   ├── popitems/
│   │   ├── popups/          # Greeting, Settings, About, Roster, Ledger, Roles
│   │   ├── VoteHistoryClock/ # SVG nomination / vote history clock
│   │   └── FAB.tsx
│   ├── Sidebar.tsx
│   ├── PlayerDetailView.tsx # Focused player view + clock
│   └── GlobalVotingView.tsx # Optional wide-angle clock overview
├── hooks/
│   └── useGameState.ts      # Game state, sessions, and persistence
├── type.tsx                 # Shared types and constants
├── App.tsx                  # Shell, theme CSS variables, modal orchestration
├── main.tsx                 # Application entry point
└── index.css                # Global styles and Tailwind imports
```

For coding conventions, see [AI_RULES.md](AI_RULES.md). For Vote History Clock layers and theme CSS variables, see [THEME_ENGINEERING.md](THEME_ENGINEERING.md).

## Getting Started

Use **npm** (scripts and `package-lock.json` assume npm).

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.
4. Open your browser to the local Vite URL.

Production build and hosting steps: [DEPLOYMENT.md](DEPLOYMENT.md).

## Usage Tips

- **Nominations**: Slide from the nominee to the target on the Vote History Clock to create a link.
- **Quick Status**: Use death or property assignment mode, then tap players to tag them.
- **Day**: Swipe or adjust the center control to change the current game day.
- **Customization**: Settings → Customization for shorthand symbols and notepad templates.

## Related docs

| Doc | Purpose |
| :--- | :--- |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Build, env vars, and static hosting |
| [AI_RULES.md](AI_RULES.md) | Stack conventions and component rules |
| [THEME_ENGINEERING.md](THEME_ENGINEERING.md) | Theme variables and clock layering |

## Updating these docs

When you change the app, update docs in the matching place:

- Product or feature change → **What it is** / Features / Usage tips in this README.
- New `src/components/` folder or major view → Project Structure here (and the tree in `AI_RULES.md` if needed).
- Build, host, or env change → [DEPLOYMENT.md](DEPLOYMENT.md).
- Theme or CSS variable change → [THEME_ENGINEERING.md](THEME_ENGINEERING.md).
- User-facing version or product name → `type.tsx` / Header / About, not only this README.

## License

This project is licensed under the Apache 2.0 License — see [LICENSE](LICENSE).
