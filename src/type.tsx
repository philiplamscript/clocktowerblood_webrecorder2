// --- TYPES & INTERFACES ---

export type ThemeType = 'standard' | 'knights' | 'grimoire' | 'puppet' | 'custom' | string; // Allow string for custom theme IDs

export interface ThemeColors {
  bg: string;
  panel: string;
  header: string;
  accent: string;
  text: string;
  border: string;
  muted: string;
}

export interface Theme {
  id: ThemeType;
  name: string;
  colors: ThemeColors;
}

export interface Player {
  no: number;
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

export const ROLE_PARSING_PROMPT = `Please analyze this Blood on the Clocktower script image and output the role names in the following plain text format. Do not include descriptions or icons, just the names under the category headers. Use traditional Chinese characters for the headers:

鎮民:
[Role Name 1]
[Role Name 2]
...

外來者:
[Role Name 1]
...

爪牙:
[Role Name 1]
...

惡魔:
[Role Name 1]
...`;

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
      border: '#e2e8f0',
      muted: '#64748b'
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
      border: '#4a5568',
      muted: '#a0aec0'
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
      border: '#d2b48c',
      muted: '#8c7851'
    }
  },
  crino: {
    id: 'crino',
    name: 'Ice Fairy',
    colors: {
  "bg": "#1A3A5F",
  "panel": "#D0EFFF",
  "header": "#0074D9",
  "accent": "#FF4136",
  "text": "#002B5B",
  "border": "#A5D8FF",
  "muted": "#5A8BB0"
}
  }
};