# BOTCT-ClockTracker

A comprehensive web application for tracking and managing Blood on the Clocktower game sessions, built with React, TypeScript, and Tailwind CSS.

## Features

- **Player Management**: Track player information, status, and roles with detailed notes.
- **Vote History Clock**: Interactive visualization of voting patterns and nominations with "Slide-to-Nominate" gestures.
- **Full Ledger System**: Detailed tables for tracking Players, Votes, Roles, and general Notes.
- **Assignment Modes**: Quickly assign death reasons or custom properties (e.g., Poisoned, Drunk) to players.
- **Theme System**: Choose from built-in themes (Standard, Knights, Grimoire, Puppet Master) or generate your own using AI.
- **Customization**: Create reusable notepad templates and property shortcuts to speed up tracking.
- **Responsive Design**: Works seamlessly on desktop and mobile devices with a layout optimized for game-time speed.
- **Data Persistence**: Automatic local storage of all game data, persisting across refreshes.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Testing**: Vitest & Testing Library

## Project Structure

```
src/
├── components/
│   ├── layout/           # Header and Player Hub
│   ├── ledger/           # Data-heavy table views
│   ├── pickers/          # Custom rotary and clock input UI
│   ├── popitems/         # Popups, Modals, and the Voting Clock
│   ├── PlayerDetailView.tsx # Detailed player focus view
│   └── GlobalVotingView.tsx # Wide-angle game overview
├── hooks/
│   └── useGameState.ts    # Central game logic and persistence
├── type.tsx              # Shared types and constants
└── App.tsx               # App entry and theme management
```

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.
4. Open your browser to the local dev URL.

## Usage Tips

- **Nominations**: Click and drag from a nominating player to a target player on the Voting Clock.
- **Quick Status**: Use the "Execution" or "Night" buttons in the player detail view to manage deaths.
- **Global View**: Toggle Split View in the header to see the Global Voting Clock alongside individual player details.
- **Customization**: Go to Settings -> Customization to add your own shorthand symbols or social read templates.

## License

This project is licensed under the MIT License.