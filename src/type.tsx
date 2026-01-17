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
    },
    patterns: {
      bg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 380 300' width='150'><defs><linearGradient id='crystalGrad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:#00E5FF;stop-opacity:0.4' /><stop offset='50%' style='stop-color:#3498DB;stop-opacity:0.2' /><stop offset='100%' style='stop-color:#0B1D2A;stop-opacity:0.1' /></linearGradient><symbol id='crystal-shard' viewBox='0 0 160 60'><path d='M10,30 L80,5 L150,30 L80,55 Z' fill='url(#crystalGrad)' stroke='#3498DB' stroke-width='1'/><path d='M10,30 L150,30' stroke='#FFFFFF' stroke-width='1' opacity='0.3'/><path d='M80,5 L80,55' stroke='#FFFFFF' stroke-width='1' opacity='0.2'/><path d='M40,15 L60,30 L40,45' fill='none' stroke='#FFFFFF' stroke-width='0.8' opacity='0.3'/><path d='M120,15 L100,30 L120,45' fill='none' stroke='#FFFFFF' stroke-width='0.8' opacity='0.3'/><path d='M80,5 L110,30 L80,55 L50,30 Z' fill='none' stroke='#00E5FF' stroke-width='0.5' opacity='0.2'/><polygon points='80,5 95,15 80,18' fill='white' opacity='0.3' /><polygon points='30,25 50,30 35,35' fill='white' opacity='0.2' /></symbol></defs><g transform='translate(50, 10) rotate(30)'><use href='#crystal-shard' width='160' height='60' /></g><g transform='translate(20, 120)'><use href='#crystal-shard' width='160' height='60' /></g><g transform='translate(50, 230) rotate(-30)'><use href='#crystal-shard' width='160' height='60' /></g><g transform='translate(350, 10) scale(-1, 1) rotate(30)'><use href='#crystal-shard' width='160' height='60' /></g><g transform='translate(380, 120) scale(-1, 1)'><use href='#crystal-shard' width='160' height='60' /></g><g transform='translate(380, 240) scale(-1, 1) rotate(-30)'><use href='#crystal-shard' width='160' height='60' /></g></svg>",
    panel: "<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><g fill='none' stroke='#3498DB' stroke-opacity='0.1' stroke-width='0.5'><g transform='translate(20,20) rotate(15)'><path d='M0-10 L2 0 L10 0 L3 4 L6 12 L0 6 L-6 12 L-3 4 L-10 0 L-2 0 Z'/></g><g transform='translate(70,40) rotate(-20) scale(0.7)'><path d='M0-10 L2 0 L10 0 L3 4 L6 12 L0 6 L-6 12 L-3 4 L-10 0 L-2 0 Z'/></g><g transform='translate(40,80) rotate(45) scale(0.5)'><path d='M0-10 L2 0 L10 0 L3 4 L6 12 L0 6 L-6 12 L-3 4 L-10 0 L-2 0 Z'/></g><circle cx='85' cy='15' r='1' fill='#00E5FF' fill-opacity='0.2'/><circle cx='10' cy='90' r='1.5' fill='#00E5FF' fill-opacity='0.2'/></g></svg>"
    }
  },
  sandbeach: {
    id: 'sandbeach',
    name: 'Sand & Beach',
    colors: {
    bg: "#C2B280",
    panel: "#F5F5DC",
    header: "#2C5E50",
    accent: "#D2691E",
    text: "#1A1A1A",
    textOnBg: "#2F2F2F",
    textOnPanel: "#1A1A1A",
    textOnHeader: "#F0EAD6",
    border: "#A89B74",
    muted: "#8B7D6B"
  },
  patterns: {
    bg: "<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><g fill='#B4A475' fill-opacity='0.4'><path d='M0 50 Q 25 25 50 50 T 100 50 T 150 50' stroke='#9E8F66' stroke-width='2' fill='none'/><path d='M0 70 Q 25 45 50 70 T 100 70 T 150 70' stroke='#9E8F66' stroke-width='1' fill='none'/><circle cx='20' cy='20' r='2'/><circle cx='80' cy='30' r='1.5'/><circle cx='50' cy='80' r='2'/></g></svg>",
    panel: "<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><g fill='none' stroke='#D2B48C' stroke-width='0.8' stroke-opacity='0.6'><path d='M30 0 L60 30 L30 60 L0 30 Z'/><path d='M30 10 L50 30 L30 50 L10 30 Z'/><circle cx='30' cy='30' r='3' fill='#D2B48C' fill-opacity='0.3'/><path d='M0 0 L15 15 M45 45 L60 60 M60 0 L45 15 M15 45 L0 60'/></g></svg>"
    }
  },
  gothic: {
    id: 'gothic',
    name: 'Gothic',
    colors: {
    bg: "#1a0d0d",
  panel: "#d9cebd",
  header: "#2b0a0a",
  accent: "#960018",
  text: "#2e1f1f",
  textOnBg: "#f5f1e8",
  textOnPanel: "#2e1f1f",
  textOnHeader: "#e2d1b3",
  border: "#b8a68d",
  muted: "#7d6e5d",
  },
  patterns: {
    bg: "<svg xmlns='http://www.w3.org/2000/svg' width='80' height='120' viewBox='0 0 80 120'><g stroke='#3d1f1f' stroke-width='1' fill='none' opacity='0.6'><path d='M40 120 V0 M0 60 H80'/><path d='M40 100 Q 40 40 80 40 M40 100 Q 40 40 0 40'/><path d='M40 80 Q 40 20 70 20 M40 80 Q 40 20 10 20'/><path d='M40 0 L50 20 L40 30 L30 20 Z' fill='#3d1f1f'/><circle cx='40' cy='60' r='5'/><path d='M0 100 Q 40 100 40 120 M80 100 Q 40 100 40 120'/><path d='M0 20 Q 40 20 40 0 M80 20 Q 40 20 40 0'/></g></svg>",
    panel: "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><g fill='#8c7a65' fill-opacity='0.15'><path d='M60 20 L62 40 L80 42 L62 44 L60 64 L58 44 L40 42 L58 40 Z'/><path d='M0 0 L10 0 L0 10 Z M120 0 L110 0 L120 10 Z M0 120 L10 120 L0 110 Z M120 120 L110 120 L120 110 Z'/></g><path d='M60 0 Q 60 60 120 60 M120 60 Q 60 60 60 120 M60 120 Q 60 60 0 60 M0 60 Q 60 60 60 0' stroke='#8c7a65' stroke-width='0.5' stroke-opacity='0.3' fill='none'/></svg>"
    // 
    }
  },
};