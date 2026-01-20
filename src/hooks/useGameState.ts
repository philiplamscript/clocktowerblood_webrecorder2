"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
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
  const [globalPath] = useState(() => {
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

  const getSessionValue = useCallback((sessionId: string, key: string, fallback: any) => {
    const saved = localStorage.getItem(`${globalPath}/save/${sessionId}/${key}`);
    return saved ? JSON.parse(saved) : fallback;
  }, [globalPath]);

  // Global State (Customizations)
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

  // Session-Specific Game Data
  const [currentDay, setCurrentDay] = useState(() => getSessionValue(activeSessionId, 'day', 1));
  const [playerCount, setPlayerCount] = useState(() => getSessionValue(activeSessionId, 'count', 15));
  const [players, setPlayers] = useState<Player[]>(() => getSessionValue(activeSessionId, 'players', Array.from({ length: 20 }, (_, i) => ({ 
    no: i + 1, name: '', inf: defaultNotepad, day: '', reason: '', red: '', property: '' 
  }))));
  const [nominations, setNominations] = useState<Nomination[]>(() => getSessionValue(activeSessionId, 'nominations', [{ id: '1', day: 1, f: '-', t: '-', voters: '', note: '' }]));
  const [deaths, setDeaths] = useState<Death[]>(() => getSessionValue(activeSessionId, 'deaths', []));
  const [chars, setChars] = useState<CharDict>(() => getSessionValue(activeSessionId, 'chars', createInitialChars()));
  const [roleDist, setRoleDist] = useState<RoleDist>(() => getSessionValue(activeSessionId, 'dist', { townsfolk: 9, outsiders: 1, minions: 2, demons: 1 }));
  const [note, setNote] = useState(() => getSessionValue(activeSessionId, 'note', ''));
  const [showHub, setShowHub] = useState(() => getSessionValue(activeSessionId, 'showHub', false));
  const [splitView, setSplitView] = useState(() => getSessionValue(activeSessionId, 'splitView', false));

  const [sessions, setSessions] = useState<SessionMeta[]>(() => {
    const saved = localStorage.getItem(`${globalPath}_sessions_index`);
    return saved ? JSON.parse(saved) : [{ id: 'default', name: 'Primary Session', lastSaved: Date.now(), storagePrefix: 'default' }];
  });

  const copySessionData = useCallback((fromId: string, toId: string) => {
    const keys = ['day', 'count', 'players', 'nominations', 'deaths', 'chars', 'dist', 'note', 'showHub', 'splitView'];
    keys.forEach(k => {
      const val = localStorage.getItem(`${globalPath}/save/${fromId}/${k}`);
      if (val !== null) {
        localStorage.setItem(`${globalPath}/save/${toId}/${k}`, val);
      }
    });
  }, [globalPath]);

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

  const saveSessionSnapshot = (name: string) => {
    const snapshotId = `ct_snap_${Date.now()}`;
    const newSession = { id: snapshotId, name, lastSaved: Date.now(), storagePrefix: snapshotId };
    copySessionData(activeSessionId, snapshotId);
    setSessions(prev => [newSession, ...prev]);
    toast.success(`Snapshot "${name}" created!`);
  };

  const loadSession = (session: SessionMeta) => {
    copySessionData(session.id, activeSessionId);
    setCurrentDay(getSessionValue(activeSessionId, 'day', 1));
    setPlayerCount(getSessionValue(activeSessionId, 'count', 15));
    setPlayers(getSessionValue(activeSessionId, 'players', []));
    setNominations(getSessionValue(activeSessionId, 'nominations', []));
    setDeaths(getSessionValue(activeSessionId, 'deaths', []));
    setChars(getSessionValue(activeSessionId, 'chars', {}));
    setRoleDist(getSessionValue(activeSessionId, 'dist', {}));
    setNote(getSessionValue(activeSessionId, 'note', ''));
    setShowHub(getSessionValue(activeSessionId, 'showHub', false));
    setSplitView(getSessionValue(activeSessionId, 'splitView', false));
    toast.success(`Applied snapshot "${session.name}" to current session`);
  };

  const reset = () => {
    setPlayers(Array.from({ length: 20 }, (_, i) => ({ no: i + 1, name: '', inf: defaultNotepad, day: '', reason: '', red: '', property: '' })));
    setNominations([{ id: '1', day: 1, f: '-', t: '-', voters: '', note: '' }]);
    setDeaths([]);
    setChars(prev => {
      const newChars = { ...prev };
      (Object.keys(newChars) as (keyof CharDict)[]).forEach(cat => {
        newChars[cat] = newChars[cat].map(c => ({ ...c, status: '—', note: '' }));
      });
      return newChars;
    });
    setCurrentDay(1);
    setNote('');
    toast.success('Session Reset Complete');
  };

  const updatePlayerInfo = (no: number, inf: string) => setPlayers(prev => prev.map(p => p.no === no ? { ...p, inf } : p));
  const updatePlayerProperty = (no: number, property: string) => setPlayers(prev => prev.map(p => p.no === no ? { ...p, property } : p));
  const updatePlayerName = (no: number, name: string) => setPlayers(prev => prev.map(p => p.no === no ? { ...p, name } : p));
  
  const updateDeathInfo = (no: number, day: number | null, reason: string | null) => {
    setPlayers(prev => prev.map(p => {
      if (p.no === no) {
        return { 
          ...p, 
          day: day ? day.toString() : '', 
          reason: reason || p.reason || '', 
          red: day ? 'DEAD' : '' 
        };
      }
      return p;
    }));

    if (day === null) {
      setDeaths(prev => prev.filter(d => d.playerNo !== no.toString()));
    } else {
      setDeaths(prev => {
        const exists = prev.find(d => d.playerNo === no.toString());
        if (exists) {
          return prev.map(d => d.playerNo === no.toString() ? { ...d, day, reason: reason || d.reason } : d);
        }
        return [...prev, { 
          id: Math.random().toString(36).substr(2, 9), 
          day, 
          playerNo: no.toString(), 
          reason: reason || '⚔️', 
          note: '', 
          isConfirmed: true 
        }];
      });
    }
  };

  const togglePlayerAlive = (no: number) => {
    const player = players.find(p => p.no === no);
    if (!player) return;

    const isDead = player.day !== '' || player.red !== '';

    if (isDead) {
      updateDeathInfo(no, null, null);
      toast.success(`Player ${no} is now alive`);
    } else {
      updateDeathInfo(no, currentDay, '⚔️');
      toast.success(`Player ${no} executed`);
    }
  };

  const deleteSession = (id: string) => {
    if (id === 'default') return;
    setSessions(sessions.filter(s => s.id !== id));
    const keys = ['day', 'count', 'players', 'nominations', 'deaths', 'chars', 'dist', 'note', 'showHub', 'splitView'];
    keys.forEach(k => localStorage.removeItem(`${globalPath}/save/${id}/${k}`));
    toast.success('Snapshot deleted');
  };

  return {
    globalPath,
    activeSessionId, sessions, saveSessionSnapshot, loadSession, deleteSession,
    currentDay, setCurrentDay, playerCount, setPlayerCount, players, setPlayers,
    nominations, setNominations, deaths, setDeaths, chars, setChars, roleDist, setRoleDist,
    note, setNote, showHub, setShowHub, splitView, setSplitView, deadPlayers, activePlayers,
    activeTheme, setActiveTheme, customThemeColors, setCustomThemeColors, customThemePatterns, setCustomThemePatterns,
    savedCustomThemes, setSavedCustomThemes, saveCustomTheme: (name: string) => {
      const id = `theme_${Date.now()}`;
      setSavedCustomThemes([...savedCustomThemes, { id, name, colors: customThemeColors!, patterns: customThemePatterns || {} }]);
    },
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
    defaultNotepad, setDefaultNotepad, aiThemeInput, setAiThemeInput, resetCustomization: (part?: any) => {
      if (!part || part === 'theme') {
        setActiveTheme('standard');
        setSavedCustomThemes([]);
      }
      toast.success('Reset triggered');
    },
    fontSize, setFontSize, language, setLanguage, identityMode, setIdentityMode,
    updatePlayerInfo, updatePlayerProperty, updatePlayerName, togglePlayerAlive, updateDeathInfo, reset,
    reorderPlayers: (from: number, to: number) => {
      const copy = [...players];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      setPlayers(copy.map((p, i) => ({ ...p, no: i + 1 })));
    },
    addPlayer: () => setPlayers([...players, { no: players.length + 1, name: '', inf: defaultNotepad, day: '', reason: '', red: '', property: '' }]),
    removePlayer: (no: number) => setPlayers(players.filter(p => p.no !== no).map((p, i) => ({ ...p, no: i + 1 }))), 
    currentTheme
  };
};