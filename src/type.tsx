"use client";

// --- TYPES & INTERFACES ---

export type ThemeType = 'standard' | 'knights' | 'grimoire' | 'puppet' | 'crino' | 'nebula' | 'custom' | string;

export type IdentityMode = 'number' | 'name';

export interface ThemeColors {
  bg: string;
  panel: string;
  header: string;
  accent: string;
  text: string;
  textOnBg?: string;
  textOnPanel?: string;
  textOnHeader?: string;
  border: string;
  muted: string;
  // New Enriched Fields
  roleTown: string;
  roleOutsider: string;
  roleMinion: string;
  roleDemon: string;
  gradient?: string; // CSS gradient string
  glassEffect?: boolean; // Toggle glassmorphism
}

export interface Theme {
  id: ThemeType;
  name: string;
  colors: ThemeColors;
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
      roleTown: '#3b82f6',
      roleOutsider: '#818cf8',
      roleMinion: '#f97316',
      roleDemon: '#ef4444'
    }
  },
  knights: {
    id: 'knights',
    name: 'Knights Order',
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
      roleTown: '#63b3ed',
      roleOutsider: '#7f9cf5',
      roleMinion: '#ed8936',
      roleDemon: '#e53e3e',
      gradient: 'linear-gradient(135deg, #1a2238 0%, #2d3748 100%)'
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
      roleTown: '#5d6d7e',
      roleOutsider: '#a67c52',
      roleMinion: '#92400e',
      roleDemon: '#7f1d1d'
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
      roleTown: "#21618C",
      roleOutsider: "#5DADE2",
      roleMinion: "#CA6F1E",
      roleDemon: "#922B21",
      glassEffect: true
    }
  },
  nebula: {
    id: 'nebula',
    name: 'Cosmic Nebula',
    colors: {
      bg: "#0f0c29",
      panel: "rgba(30, 27, 75, 0.7)",
      header: "#6d28d9",
      accent: "#ec4899",
      text: "#ffffff",
      textOnBg: "#a5b4fc",
      textOnPanel: "#ffffff",
      textOnHeader: "#ffffff",
      border: "rgba(236, 72, 153, 0.3)",
      muted: "#818cf8",
      roleTown: "#38bdf8",
      roleOutsider: "#c084fc",
      roleMinion: "#fb923c",
      roleDemon: "#f43f5e",
      gradient: "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
      glassEffect: true
    }
  }
};