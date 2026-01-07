"use client";

// --- TYPES & INTERFACES ---

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
  status: string; // "—" | "POSS" | "CONF" | "NOT"
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

// --- CONSTANTS ---

export const INITIAL_PLAYERS = 15;
export const REASON_CYCLE = ['⚔️', '☀️', '🌑'];
export const STATUS_OPTIONS = ["—", "POSS", "CONF", "NOT"];

export const createInitialChars = (): CharDict => ({
  Townsfolk: Array(8).fill(null).map(() => ({ name: '', status: '—', note: '' })),
  Outsider: Array(8).fill(null).map(() => ({ name: '', status: '—', note: '' })),
  Minion: Array(8).fill(null).map(() => ({ name: '', status: '—', note: '' })),
  Demon: Array(8).fill(null).map(() => ({ name: '', status: '—', note: '' })),
});