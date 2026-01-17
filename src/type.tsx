// --- TYPES & INTERFACES ---

import { pattern } from "framer-motion/client";

export type ThemeType = 'standard' | 'knights' | 'grimoire' | 'puppet' | 'custom' | string;

export type IdentityMode = 'number' | 'name';

export interface ThemeColors {
  bg: string;
  panel: string;
  header: string;
  accent: string;
  text: string;
  textOnBg?: string;    // Text for global background
  textOnPanel?: string; // Text for cards/ledgers
  textOnHeader?: string; // Text for header areas
  border: string;
  muted: string;
}
export interface ThemePatterns {
  bg?: string;    // SVG background-image value
  panel?: string; // SVG background-image value
}

export interface Theme {
  id: ThemeType;
  name: string;
  colors: ThemeColors;
  patterns?: ThemePatterns;
}

export interface Player {
  no: number;
  name: string; 
  inf: string;
  day: string; 
  reason: string; 
  red: string;
  property: string;
}

export interface Nomination {
  id: string;
  day: number;
  f: string;
  t: string;
  voters: string; 
  note: string;
}

export interface Death {
  id: string;
  day: number;
  playerNo: string;
  reason: string;
  note: string;
  isConfirmed?: boolean;
}

export interface Character {
  name: string;
  status: string;
  note: string;
}

export interface CharDict {
  Townsfolk: Character[];
  Outsider: Character[];
  Minion: Character[];
  Demon: Character[];
}

export interface RoleDist {
  townsfolk: number;
  outsiders: number;
  minions: number;
  demons: number;
}

export interface SortConfig {
  key: keyof Player | null;
  direction: 'asc' | 'desc';
}

export interface NotepadTemplate {
  id: string;
  label: string;
  content: string;
}

export interface PropTemplate {
  id: string;
  label: string;
  value: string;
}

// --- CONSTANTS ---

export const INITIAL_PLAYERS = 15;
export const REASON_CYCLE = ['⚔️', '☀️', '🌑'];
export const STATUS_OPTIONS = ["—", "POSS", "CONF", "NOT"];

export const ROLE_PARSING_PROMPT = `
Please analyze this Blood on the Clocktower script image and output the role names. 
Do not include descriptions or icons, just the names under the category headers. 
Use English characters for the headers, but keep Role Names in same language as the photo attached.
find the most suitable icon that represent the role name.
Alternate lines for each category and each role name.
Start with \`\`\`bash and End with \`\`\`.


Example output format:
\`\`\`bash
Townsfolk: \n
[icon for townsfolk Role Name 1][townsfolk Role Name 1] \n
[icon for townsfolk Role Name 2][townsfolk Role Name 2] \n
...
\n
Outsider: \n
[icon for outsider Role Name 1][outsider Role Name 1] \n
[icon for outsider Role Name 2][outsider Role Name 2] \n
...
 \n
Minion: \n
[icon for minion Role Name 1][minion Role Name 1] \n
[icon for minion Role Name 2][minion Role Name 2] \n
...
 \n
Demon: \n
[icon for demon Role Name 1][demon Role Name 1] \n
[icon for demon Role Name 2][demon Role Name 2] \n
...

\`\`\``;

export const createInitialChars = (): CharDict => ({
  Townsfolk: Array(8).fill(null).map(() => ({ name: '', status: '—', note: '' })),
  Outsider: Array(8).fill(null).map(() => ({ name: '', status: '—', note: '' })),
  Minion: Array(8).fill(null).map(() => ({ name: '', status: '—', note: '' })),
  Demon: Array(8).fill(null).map(() => ({ name: '', status: '—', note: '' })),
});

// --- PATTERN GENERATOR ---



const DOT_SVG = `
<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
  <g fill="#2011f7" fill-opacity="0.5" fill-rule="evenodd">
    <circle cx="3" cy="3" r="3"/>
  </g>
</svg>
`;

const GRID_SVG = `
<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" fill-rule="evenodd">
    <path d="M0 40h40V0H0v40zM1 39V1h38v38H1z" fill="#000" fill-opacity="0.1"/>
  </g>
</svg> 
`;


const parchment_SVG = `
<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <filter id="parchment">
    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
    <feDiffuseLighting in="noise" lighting-color="#f2e8c9" surfaceScale="2">
      <feDistantLight azimuth="45" elevation="60" />
    </feDiffuseLighting>
  </filter>

  <rect width="100%" height="100%" fill="#f2e8c9" />
  <rect width="100%" height="100%" filter="url(#parchment)" opacity="0.7" />
</svg>
`;

const DIAMOND_SVG = `
<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 0h40v40H0V0zm20 20L0 40h40L20 20zM0 0l20 20L40 0H0z" fill="#000" fill-opacity="0.3" fill-rule="evenodd"/>
</svg>
`;


export const THEMES: Record<Exclude<ThemeType, string>, Theme> = {
  standard: {
    id: 'standard',
    name: 'Tracker Standard',
    colors: {
      bg: '#f1f5f9',
      panel: '#ffffff',
      header: '#0f172a',
      accent: '#ef4444',
      text: '#0f172a',
      textOnBg: '#475569',
      textOnPanel: '#0f172a',
      textOnHeader: '#ffffff',
      border: '#e2e8f0',
      muted: '#64748b',

    },
    patterns: {
      bg:GRID_SVG
    }
  },
  knights: {
    id: 'knights',
    name: 'Knights of the Round Table',
    colors: {
      bg: '#1a2238',
      panel: '#2d3748',
      header: '#b7924a',
      accent: '#d4af37',
      text: '#f7fafc',
      textOnBg: '#f7fafc',
      textOnPanel: '#f7fafc',
      textOnHeader: '#1a2238',
      border: '#4a5568',
      muted: '#a0aec0',
    },
    patterns: {
      bg:DOT_SVG,
      panel:DIAMOND_SVG
    }
  },
  grimoire: {
    id: 'grimoire',
    name: 'Ancient Grimoire',
    colors: {
      bg: '#f4ece1',
      panel: '#fffcf5',
      header: '#4a3728',
      accent: '#8b4513',
      text: '#2d241e',
      textOnBg: '#4a3728',
      textOnPanel: '#2d241e',
      textOnHeader: '#f4ece1',
      border: '#d2b48c',
      muted: '#8c7851',
    },
    patterns: {
      bg:parchment_SVG,
      panel:parchment_SVG
    }
  },
  crino: {
    id: 'crino',
    name: 'Ice Fairy',
    colors: {
      bg: "#0B1D2A",
      panel: "#D6EFFF",
      header: "#3498DB",
      accent: "#00E5FF",
      text: "#0B1D2A",
      textOnBg: "#FFFFFF",
      textOnPanel: "#0B1D2A",
      textOnHeader: "#FFFFFF",
      border: "#85C1E9",
      muted: "#5D6D7E",
      bgSVG: DOT_SVG
    },
    patterns: {
      bg:DOT_SVG,
    }
  }
};