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
  createInitialChars,
  THEMES
} from '../type';

export const useGameState = () => {
  const getStorage = (key: string, fallback: any) => {
    const saved = localStorage.getItem(`clocktower_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  };

  const [defaultNotepad, setDefaultNotepad] = useState(() => getStorage('default_notepad', ''));
  const [identityMode, setIdentityMode] = useState<IdentityMode>(() => getStorage('identity_mode', 'number'));

  const [currentDay, setCurrentDay] = useState(() => getStorage('day', 1));
  const [playerCount, setPlayerCount] = useState(() => getStorage('count', 15));
  
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = getStorage('players', []);
    if (saved.length > 0) return saved;
    return Array.from({ length: 20 }, (_, i) => ({ 
      no: i + 1, 
      name: '',
      inf: defaultNotepad, 
      day: '', 
      reason: '', 
      red: '', 
      property: '' 
    }));
  });

  const [nominations, setNominations] = useState<Nomination[]>(() => getStorage('nominations', [{ id: '1', day: 1, f: '-', t: '-', voters: '', note: '' }]));
  const [deaths, setDeaths] = useState<Death[]>(() => getStorage('deaths', [
    { id: 'default-execution', day: 1, playerNo: '', reason: '⚔️', note: '', isConfirmed: true },
    { id: 'default-night', day: 1, playerNo: '', reason: '🌑', note: '', isConfirmed: true }
  ]));
  const [chars, setChars] = useState<CharDict>(() => getStorage('chars', createInitialChars()));
  const [roleDist, setRoleDist] = useState<RoleDist>(() => getStorage('dist', { townsfolk: 9, outsiders: 1, minions: 2, demons: 1 }));
  const [note, setNote] = useState(() => getStorage('note', ''));
  const [fontSize, setFontSize] = useState<'small' | 'mid' | 'large'>(() => getStorage('font', 'mid'));
  const [language, setLanguage] = useState(() => getStorage('lang', 'Eng'));
  const [showHub, setShowHub] = useState(() => getStorage('showHub', false));
  const [splitView, setSplitView] = useState(() => getStorage('splitView', false));
  
  const [activeTheme, setActiveTheme] = useState<ThemeType>(() => getStorage('active_theme', 'standard'));
  const [customThemeColors, setCustomThemeColors] = useState<ThemeColors | null>(() => getStorage('custom_theme_colors', null));
  const [customThemePatterns, setCustomThemePatterns] = useState<ThemePatterns | null>(() => getStorage('custom_theme_patterns', null));
  const [savedCustomThemes, setSavedCustomThemes] = useState<Theme[]>(() => getStorage('saved_custom_themes', []));
  const [aiThemeInput, setAiThemeInput] = useState(() => getStorage('ai_theme_input', ''));

  const [notepadTemplates, setNotepadTemplates] = useState<NotepadTemplate[]>(() => getStorage('notepad_templates', [
    { id: 't1', label: 'SOCIAL READ', content: 'Reads: \nTrust: \nSuspicion: ' },
    { id: 't2', label: 'WORLD INFO', content: 'Day 1: \nDay 2: \nDay 3: ' }
  ]));
  const [propTemplates, setPropTemplates] = useState<PropTemplate[]>(() => getStorage('prop_templates', [
    { id: 'p1', label: 'RedTeam', value: '🔴' },
    { id: 'p2', label: 'Crystal', value: '🔮' },
    { id: 'p3', label: 'Glasses', value: '👓' }
  ]));

  useEffect(() => {
    const state = {
      day: currentDay, count: playerCount, players, nominations, deaths, chars, dist: roleDist,
      note, font: fontSize, lang: language, showHub, splitView, notepad_templates: notepadTemplates, 
      prop_templates: propTemplates, active_theme: activeTheme, custom_theme_colors: customThemeColors,
      custom_theme_patterns: customThemePatterns,
      saved_custom_themes: savedCustomThemes, default_notepad: defaultNotepad, ai_theme_input: aiThemeInput,
      identity_mode: identityMode
    };
    Object.entries(state).forEach(([key, val]) => localStorage.setItem(`clocktower_${key}`, JSON.stringify(val)));
  }, [currentDay, playerCount, players, nominations, deaths, chars, roleDist, note, fontSize, language, showHub, splitView, notepadTemplates, propTemplates, activeTheme, customThemeColors, customThemePatterns, savedCustomThemes, defaultNotepad, aiThemeInput, identityMode]);

  useEffect(() => {
    setPlayers(prev => prev.map(p => {
      const death = deaths.find(d => parseInt(d.playerNo) === p.no);
      return death ? { ...p, day: death.day.toString(), reason: death.reason } : { ...p, day: '', reason: '' };
    }));
  }, [deaths]);

  const activePlayers = useMemo(() => players.slice(0, playerCount), [players, playerCount]);
  const deadPlayers = useMemo(() => activePlayers.filter(p => p.day !== '' || p.red !== '').map(p => p.no), [activePlayers]);

  const reset = () => {
    setPlayers(Array.from({ length: 20 }, (_, i) => ({ 
      no: i + 1, 
      name: '',
      inf: defaultNotepad, 
      day: '', 
      reason: '', 
      red: '', 
      property: '' 
    })));
    setNominations([{ id: Math.random().toString(), day: 1, f: '-', t: '-', voters: '', note: '' }]);
    setDeaths([
      { id: 'default-execution', day: 1, playerNo: '', reason: '⚔️', note: '', isConfirmed: true },
      { id: 'default-night', day: 1, playerNo: '', reason: '🌑', note: '', isConfirmed: true }
    ]);
    setCurrentDay(1);
    setChars(prev => {
      const newChars = { ...prev };
      (Object.keys(newChars) as (keyof CharDict)[]).forEach(cat => {
        newChars[cat] = newChars[cat].map(c => ({ ...c, status: '—', note: '' }));
      });
      return newChars;
    });
    setNote('');
    toast.success('Session reset (Roles preserved)');
  };

  const resetCustomization = () => {
    setNotepadTemplates([
      { id: 't1', label: 'SOCIAL READ', content: 'Reads: \nTrust: \nSuspicion: ' },
      { id: 't2', label: 'WORLD INFO', content: 'Day 1: \nDay 2: \nDay 3: ' }
    ]);
    setPropTemplates([
      { id: 'p1', label: 'RedTeam', value: '🔴' },
      { id: 'p2', label: 'Crystal', value: '🔮' },
      { id: 'p3', label: 'Glasses', value: '👓' }
    ]);
    setDefaultNotepad('');
    toast.success('Customizations reset to default');
  };

  const updatePlayerInfo = (no: number, text: string) => setPlayers(prev => prev.map(p => p.no === no ? { ...p, inf: text } : p));
  const updatePlayerName = (no: number, name: string) => setPlayers(prev => prev.map(p => p.no === no ? { ...p, name } : p));
  const updatePlayerProperty = (no: number, text: string) => setPlayers(prev => prev.map(p => p.no === no ? { ...p, property: text } : p));
  
  const togglePlayerAlive = (no: number) => {
    if (deadPlayers.includes(no)) {
      setDeaths(deaths.filter(d => parseInt(d.playerNo) !== no));
    } else {
      setDeaths([...deaths, { id: Math.random().toString(), day: currentDay, playerNo: no.toString(), reason: '⚔️', note: '', isConfirmed: true }]);
    }
  };

  const reorderPlayers = (fromIndex: number, toIndex: number) => {
    setPlayers(prev => {
      const newPlayers = [...prev];
      const [moved] = newPlayers.splice(fromIndex, 1);
      newPlayers.splice(toIndex, 0, moved);
      return newPlayers.map((p, idx) => ({ ...p, no: idx + 1 }));
    });
  };

  const addPlayer = () => {
    if (playerCount >= 20) return;
    setPlayerCount(prev => prev + 1);
  };

  const removePlayer = (no: number) => {
    if (playerCount <= 5) return;
    setPlayers(prev => {
      const filtered = prev.filter(p => p.no !== no);
      return filtered.map((p, idx) => ({ ...p, no: idx + 1 }));
    });
    setPlayerCount(prev => prev - 1);
  };

  const currentTheme = useMemo(() => {
    if (activeTheme === 'custom' && customThemeColors) {
      return { id: 'custom' as ThemeType, name: 'AI Custom Theme', colors: customThemeColors, patterns: customThemePatterns || {} };
    }
    const savedTheme = savedCustomThemes.find(t => t.id === activeTheme);
    if (savedTheme) return savedTheme;
    return THEMES[activeTheme as keyof typeof THEMES] || THEMES.standard;
  }, [activeTheme, customThemeColors, customThemePatterns, savedCustomThemes]);

  const saveCustomTheme = (name: string) => {
    if (!customThemeColors) return;
    const id = `custom-${Date.now()}`;
    const newTheme: Theme = { id, name, colors: customThemeColors, patterns: customThemePatterns || {} };
    setSavedCustomThemes(prev => [...prev, newTheme]);
    setActiveTheme(id);
    toast.success(`Theme "${name}" saved!`);
  };

  const deleteCustomTheme = (id: string) => {
    setSavedCustomThemes(prev => prev.filter(t => t.id !== id));
    if (activeTheme === id) setActiveTheme('standard');
    toast.success('Theme deleted');
  };

  const renameCustomTheme = (id: string, newName: string) => {
    setSavedCustomThemes(prev => prev.map(t => t.id === id ? { ...t, name: newName } : t));
    toast.success('Theme renamed');
  };

  const reorderNotepadTemplates = (fromIndex: number, toIndex: number) => {
    setNotepadTemplates(prev => {
      const newArr = [...prev];
      const [moved] = newArr.splice(fromIndex, 1);
      newArr.splice(toIndex, 0, moved);
      return newArr;
    });
  };

  const reorderPropTemplates = (fromIndex: number, toIndex: number) => {
    setPropTemplates(prev => {
      const newArr = [...prev];
      const [moved] = newArr.splice(fromIndex, 1);
      newArr.splice(toIndex, 0, moved);
      return newArr;
    });
  };

  return {
    currentDay, setCurrentDay, playerCount, setPlayerCount, 
    players: activePlayers,
    setPlayers,
    nominations, setNominations, deaths, setDeaths, chars, setChars, roleDist, setRoleDist,
    note, setNote, fontSize, setFontSize, language, setLanguage, showHub, setShowHub,
    splitView, setSplitView, notepadTemplates, setNotepadTemplates, propTemplates, setPropTemplates,
    deadPlayers, reset, resetCustomization, updatePlayerInfo, updatePlayerName, updatePlayerProperty, togglePlayerAlive,
    activeTheme, setActiveTheme, customThemeColors, setCustomThemeColors, customThemePatterns, setCustomThemePatterns,
    currentTheme,
    savedCustomThemes, saveCustomTheme, deleteCustomTheme, renameCustomTheme, reorderNotepadTemplates, reorderPropTemplates,
    defaultNotepad, setDefaultNotepad, aiThemeInput, setAiThemeInput, identityMode, setIdentityMode,
    reorderPlayers, addPlayer, removePlayer
  };
};