"use client";

import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import {
  type Player,
  type Nomination,
  type Death,
  type CharDict,
  type RoleDist,
  type NotepadTemplate,
  type PropTemplate,
  type ThemeType,
  type ThemeColors,
  type ThemePatterns,
  type Theme,
  type IdentityMode,
  type SessionMeta,
  createInitialChars,
  THEMES
} from '../type';

const APP_GLOBAL_KEY = 'ct_app_config';

export const useGameState = () => {
  // 1. Global Application Config
  const [globalPath, setGlobalPath] = useState(() => {
    const saved = localStorage.getItem(`${APP_GLOBAL_KEY}_path`);
    return saved ? JSON.parse(saved) : 'main';
  });

  const [activeSessionId, setActiveSessionId] = useState(() => {
    const saved = localStorage.getItem(`${globalPath}_active_session`);
    return saved ? JSON.parse(saved) : 'default';
  });

  const getGlobal = (key: string, fallback: any) => {
    const saved = localStorage.getItem(`${APP_GLOBAL_KEY}_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  };

  const getSession = (key: string, fallback: any) => {
    const saved = localStorage.getItem(`${globalPath}/save/${activeSessionId}/${key}`);
    return saved ? JSON.parse(saved) : fallback;
  };

  // 2. Global State (Customizations)
  const [activeTheme, setActiveTheme] = useState<ThemeType>(() => getGlobal('active_theme', 'standard'));
  const [customThemeColors, setCustomThemeColors] = useState<ThemeColors | null>(() => getGlobal('custom_theme_colors', null));
  const [customThemePatterns, setCustomThemePatterns] = useState<ThemePatterns | null>(() => getGlobal('custom_theme_patterns', null));
  const [savedCustomThemes, setSavedCustomThemes] = useState<Theme[]>(() => getGlobal('saved_custom_themes', []));
  const [notepadTemplates, setNotepadTemplates] = useState<NotepadTemplate[]>(() => getGlobal('notepad_templates', [
    { id: 't1', label: 'SOCIAL READ', content: 'Reads: \nTrust: \nSuspicion: ' },
    { id: 't2', label: 'WORLD INFO', content: 'Day 1: \nDay 2: \nDay 3: ' }
  ]));
  const [propTemplates, setPropTemplates] = useState<PropTemplate[]>(() => getGlobal('prop_templates', [
    { id: 'p1', label: 'RedTeam', value: '🔴' },
    { id: 'p2', label: 'Crystal', value: '🔮' },
    { id: 'p3', label: 'Glasses', value: '👓' }
  ]));
  const [defaultNotepad, setDefaultNotepad] = useState(() => getGlobal('default_notepad', ''));
  const [aiThemeInput, setAiThemeInput] = useState(() => getGlobal('ai_theme_input', ''));
  const [fontSize, setFontSize] = useState<'small' | 'mid' | 'large'>(() => getGlobal('font', 'mid'));
  const [language, setLanguage] = useState(() => getGlobal('lang', 'Eng'));
  const [identityMode, setIdentityMode] = useState<IdentityMode>(() => getGlobal('identity_mode', 'number'));

  // 3. Session-Specific Game Data
  const [currentDay, setCurrentDay] = useState(() => getSession('day', 1));
  const [playerCount, setPlayerCount] = useState(() => getSession('count', 15));
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = getSession('players', []);
    if (saved.length > 0) return saved;
    return Array.from({ length: 20 }, (_, i) => ({ 
      no: i + 1, name: '', inf: defaultNotepad, day: '', reason: '', red: '', property: '' 
    }));
  });
  const [nominations, setNominations] = useState<Nomination[]>(() => getSession('nominations', [{ id: '1', day: 1, f: '-', t: '-', voters: '', note: '' }]));
  const [deaths, setDeaths] = useState<Death[]>(() => getSession('deaths', [
    { id: 'default-execution', day: 1, playerNo: '', reason: '⚔️', note: '', isConfirmed: true },
    { id: 'default-night', day: 1, playerNo: '', reason: '🌑', note: '', isConfirmed: true }
  ]));
  const [chars, setChars] = useState<CharDict>(() => getSession('chars', createInitialChars()));
  const [roleDist, setRoleDist] = useState<RoleDist>(() => getSession('dist', { townsfolk: 9, outsiders: 1, minions: 2, demons: 1 }));
  const [note, setNote] = useState(() => getSession('note', ''));
  const [showHub, setShowHub] = useState(() => getSession('showHub', false));
  const [splitView, setSplitView] = useState(() => getSession('splitView', false));

  const [sessions, setSessions] = useState<SessionMeta[]>(() => {
    const saved = localStorage.getItem(`${globalPath}_sessions_index`);
    return saved ? JSON.parse(saved) : [{ id: 'default', name: 'Primary Session', lastSaved: Date.now(), storagePrefix: 'default' }];
  });

  useEffect(() => {
    const config = {
      active_theme: activeTheme, custom_theme_colors: customThemeColors, custom_theme_patterns: customThemePatterns,
      saved_custom_themes: savedCustomThemes, notepad_templates: notepadTemplates, prop_templates: propTemplates,
      default_notepad: defaultNotepad, ai_theme_input: aiThemeInput, font: fontSize, lang: language, identity_mode: identityMode
    };
    Object.entries(config).forEach(([key, val]) => localStorage.setItem(`${APP_GLOBAL_KEY}_${key}`, JSON.stringify(val)));
    localStorage.setItem(`${APP_GLOBAL_KEY}_path`, JSON.stringify(globalPath));
  }, [globalPath, activeTheme, customThemeColors, customThemePatterns, savedCustomThemes, notepadTemplates, propTemplates, defaultNotepad, aiThemeInput, fontSize, language, identityMode]);

  useEffect(() => {
    const data = {
      day: currentDay, count: playerCount, players, nominations, deaths, chars, dist: roleDist, note, showHub, splitView
    };
    Object.entries(data).forEach(([key, val]) => {
      localStorage.setItem(`${globalPath}/save/${activeSessionId}/${key}`, JSON.stringify(val));
    });
    localStorage.setItem(`${globalPath}_active_session`, JSON.stringify(activeSessionId));
    localStorage.setItem(`${globalPath}_sessions_index`, JSON.stringify(sessions));
  }, [globalPath, activeSessionId, currentDay, playerCount, players, nominations, deaths, chars, roleDist, note, showHub, splitView, sessions]);

  const activePlayers = useMemo(() => players.slice(0, playerCount), [players, playerCount]);
  const deadPlayers = useMemo(() => activePlayers.filter(p => p.day !== '' || p.red !== '').map(p => p.no), [activePlayers]);

  const currentTheme = useMemo(() => {
    if (activeTheme === 'custom' && customThemeColors) {
      return { id: 'custom', name: 'Custom AI Theme', colors: customThemeColors, patterns: customThemePatterns || {} } as Theme;
    }
    const saved = savedCustomThemes.find(t => t.id === activeTheme);
    if (saved) return saved;
    return THEMES[activeTheme as keyof typeof THEMES] || THEMES.standard;
  }, [activeTheme, customThemeColors, customThemePatterns, savedCustomThemes]);

  const reset = () => {
    setPlayers(Array.from({ length: 20 }, (_, i) => ({ no: i + 1, name: '', inf: defaultNotepad, day: '', reason: '', red: '', property: '' })));
    setNominations([{ id: '1', day: 1, f: '-', t: '-', voters: '', note: '' }]);
    setDeaths([
      { id: 'default-execution', day: 1, playerNo: '', reason: '⚔️', note: '', isConfirmed: true },
      { id: 'default-night', day: 1, playerNo: '', reason: '🌑', note: '', isConfirmed: true }
    ]);
    setChars(createInitialChars());
    setCurrentDay(1);
    setNote('');
    toast.success('Session Reset Complete');
  };

  const resetCustomization = (part?: 'theme' | 'notepad' | 'props') => {
    if (!part || part === 'notepad') {
      setNotepadTemplates([
        { id: 't1', label: 'SOCIAL READ', content: 'Reads: \nTrust: \nSuspicion: ' },
        { id: 't2', label: 'WORLD INFO', content: 'Day 1: \nDay 2: \nDay 3: ' }
      ]);
      setDefaultNotepad('');
    }
    if (!part || part === 'props') {
      setPropTemplates([
        { id: 'p1', label: 'RedTeam', value: '🔴' },
        { id: 'p2', label: 'Crystal', value: '🔮' },
        { id: 'p3', label: 'Glasses', value: '👓' }
      ]);
    }
    if (!part || part === 'theme') {
      setActiveTheme('standard');
      setSavedCustomThemes([]);
      setCustomThemeColors(null);
      setCustomThemePatterns(null);
    }
    toast.success(`${part ? part.charAt(0).toUpperCase() + part.slice(1) : 'All'} customizations restored`);
  };

  const updatePlayerInfo = (no: number, inf: string) => setPlayers(prev => prev.map(p => p.no === no ? { ...p, inf } : p));
  const updatePlayerProperty = (no: number, property: string) => setPlayers(prev => prev.map(p => p.no === no ? { ...p, property } : p));
  const updatePlayerName = (no: number, name: string) => setPlayers(prev => prev.map(p => p.no === no ? { ...p, name } : p));
  const togglePlayerAlive = (no: number) => setPlayers(prev => prev.map(p => {
    if (p.no === no) {
      const isDead = p.day !== '';
      return { ...p, day: isDead ? '' : currentDay.toString(), reason: isDead ? '' : '⚔️', red: isDead ? '' : 'DEAD' };
    }
    return p;
  }));

  const reorderPlayers = (from: number, to: number) => {
    const newPlayers = [...players];
    const [moved] = newPlayers.splice(from, 1);
    newPlayers.splice(to, 0, moved);
    setPlayers(newPlayers.map((p, i) => ({ ...p, no: i + 1 })));
  };

  const addPlayer = () => setPlayers([...players, { no: players.length + 1, name: '', inf: defaultNotepad, day: '', reason: '', red: '', property: '' }]);
  const removePlayer = (no: number) => {
    const filtered = players.filter(p => p.no !== no);
    setPlayers(filtered.map((p, i) => ({ ...p, no: i + 1 })));
  };

  const saveSessionSnapshot = (name: string) => {
    const id = `ct_session_${Math.random().toString(36).substr(2, 9)}`;
    const newSession = { id, name, lastSaved: Date.now(), storagePrefix: id };
    setSessions([...sessions, newSession]);
    setActiveSessionId(id);
    toast.success(`Snapshot "${name}" saved!`);
  };

  const loadSession = (session: SessionMeta) => {
    setActiveSessionId(session.id);
    toast.success(`Switched to "${session.name}"`);
  };

  const deleteSession = (id: string) => {
    if (id === 'default') return;
    setSessions(sessions.filter(s => s.id !== id));
    if (activeSessionId === id) setActiveSessionId('default');
    const keys = ['day', 'count', 'players', 'nominations', 'deaths', 'chars', 'dist', 'note'];
    keys.forEach(k => localStorage.removeItem(`${globalPath}/save/${id}/${k}`));
  };

  const saveCustomTheme = (name: string) => {
    if (!customThemeColors) return;
    const id = `theme_${Date.now()}`;
    const newTheme: Theme = { id, name, colors: customThemeColors, patterns: customThemePatterns || {} };
    setSavedCustomThemes([...savedCustomThemes, newTheme]);
    setActiveTheme(id);
    toast.success(`Theme "${name}" saved!`);
  };

  return {
    globalPath, setGlobalPath, switchStoragePath: setGlobalPath,
    activeSessionId, sessions, saveSessionSnapshot, loadSession, deleteSession,
    currentDay, setCurrentDay, playerCount, setPlayerCount, players, setPlayers,
    nominations, setNominations, deaths, setDeaths, chars, setChars, roleDist, setRoleDist,
    note, setNote, showHub, setShowHub, splitView, setSplitView, deadPlayers, activePlayers,
    activeTheme, setActiveTheme, customThemeColors, setCustomThemeColors, customThemePatterns, setCustomThemePatterns,
    savedCustomThemes, setSavedCustomThemes, saveCustomTheme,
    updateCustomTheme: (id: string, theme: Theme) => setSavedCustomThemes(savedCustomThemes.map(t => t.id === id ? theme : t)),
    renameCustomTheme: (id: string, name: string) => setSavedCustomThemes(savedCustomThemes.map(t => t.id === id ? { ...t, name } : t)),
    notepadTemplates, setNotepadTemplates, propTemplates, setPropTemplates,
    reorderNotepadTemplates: (from: number, to: number) => {
      const copy = [...notepadTemplates];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      setNotepadTemplates(copy);
    },
    reorderPropTemplates: (from: number, to: number) => {
      const copy = [...propTemplates];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      setPropTemplates(copy);
    },
    defaultNotepad, setDefaultNotepad, aiThemeInput, setAiThemeInput, resetCustomization,
    fontSize, setFontSize, language, setLanguage, identityMode, setIdentityMode,
    updatePlayerInfo, updatePlayerProperty, updatePlayerName, togglePlayerAlive, reset,
    reorderPlayers, addPlayer, removePlayer, currentTheme
  };
};