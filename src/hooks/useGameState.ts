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
  type Theme,
  createInitialChars,
  THEMES
} from '../type';

export const useGameState = () => {
  const getStorage = (key: string, fallback: any) => {
    const saved = localStorage.getItem(`clocktower_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  };

  const [defaultNotepad, setDefaultNotepad] = useState(() => getStorage('default_notepad', ''));

  const [currentDay, setCurrentDay] = useState(() => getStorage('day', 1));
  const [playerCount, setPlayerCount] = useState(() => getStorage('count', 15));
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = getStorage('players', []);
    if (saved.length > 0) return saved;
    // Create new players with default notepad
    return Array.from({ length: getStorage('count', 15) }, (_, i) => ({ no: i + 1, inf: defaultNotepad, day: '', reason: '', red: '', property: '' }));
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
  
  // Theme State
  const [activeTheme, setActiveTheme] = useState<ThemeType>(() => getStorage('active_theme', 'standard'));
  const [customThemeColors, setCustomThemeColors] = useState<ThemeColors | null>(() => getStorage('custom_theme_colors', null));
  const [savedCustomThemes, setSavedCustomThemes] = useState<Theme[]>(() => getStorage('saved_custom_themes', []));

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
      saved_custom_themes: savedCustomThemes, default_notepad: defaultNotepad
    };
    Object.entries(state).forEach(([key, val]) => localStorage.setItem(`clocktower_${key}`, JSON.stringify(val)));
  }, [currentDay, playerCount, players, nominations, deaths, chars, roleDist, note, fontSize, language, showHub, splitView, notepadTemplates, propTemplates, activeTheme, customThemeColors, savedCustomThemes, defaultNotepad]);

  useEffect(() => {
    setPlayers(prev => prev.map(p => {
      const death = deaths.find(d => parseInt(d.playerNo) === p.no);
      return death ? { ...p, day: death.day.toString(), reason: death.reason } : { ...p, day: '', reason: '' };
    }));
  }, [deaths]);

  const deadPlayers = useMemo(() => players.filter(p => p.day !== '' || p.red !== '').map(p => p.no), [players]);

  const reset = () => {
    setPlayers(Array.from({ length: playerCount }, (_, i) => ({ no: i + 1, inf: defaultNotepad, day: '', reason: '', red: '', property: '' })));
    setNominations([{ id: Math.random().toString(), day: 1, f: '-', t: '-', voters: '', note: '' }]);
    setDeaths([
      { id: 'default-execution', day: 1, playerNo: '', reason: '⚔️', note: '', isConfirmed: true },
      { id: 'default-night', day: 1, playerNo: '', reason: '🌑', note: '', isConfirmed: true }
    ]);
    setCurrentDay(1);
    setChars(createInitialChars());
    setNote('');
    toast.success('Session reset successfully');
  };

  const updatePlayerInfo = (no: number, text: string) => setPlayers(prev => prev.map(p => p.no === no ? { ...p, inf: text } : p));
  const updatePlayerProperty = (no: number, text: string) => setPlayers(prev => prev.map(p => p.no === no ? { ...p, property: text } : p));
  
  const togglePlayerAlive = (no: number) => {
    if (deadPlayers.includes(no)) {
      setDeaths(deaths.filter(d => parseInt(d.playerNo) !== no));
    } else {
      setDeaths([...deaths, { id: Math.random().toString(), day: currentDay, playerNo: no.toString(), reason: '⚔️', note: '', isConfirmed: true }]);
    }
  };

  const currentTheme = useMemo(() => {
    if (activeTheme === 'custom' && customThemeColors) {
      return { id: 'custom' as ThemeType, name: 'AI Custom Theme', colors: customThemeColors };
    }
    const savedTheme = savedCustomThemes.find(t => t.id === activeTheme);
    if (savedTheme) return savedTheme;
    return THEMES[activeTheme as keyof typeof THEMES] || THEMES.standard;
  }, [activeTheme, customThemeColors, savedCustomThemes]);

  const saveCustomTheme = (name: string) => {
    if (!customThemeColors) return;
    const id = `custom-${Date.now()}`;
    const newTheme: Theme = { id, name, colors: customThemeColors };
    setSavedCustomThemes(prev => [...prev, newTheme]);
    setActiveTheme(id);
    toast.success(`Theme "${name}" saved!`);
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
    currentDay, setCurrentDay, playerCount, setPlayerCount, players, setPlayers,
    nominations, setNominations, deaths, setDeaths, chars, setChars, roleDist, setRoleDist,
    note, setNote, fontSize, setFontSize, language, setLanguage, showHub, setShowHub,
    splitView, setSplitView, notepadTemplates, setNotepadTemplates, propTemplates, setPropTemplates,
    deadPlayers, reset, updatePlayerInfo, updatePlayerProperty, togglePlayerAlive,
    activeTheme, setActiveTheme, customThemeColors, setCustomThemeColors, currentTheme,
    savedCustomThemes, saveCustomTheme, reorderNotepadTemplates, reorderPropTemplates,
    defaultNotepad, setDefaultNotepad
  };
};