"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  Player, Nomination, Death, CharDict, RoleDist, 
  createInitialChars 
} from '../type';

const getStorage = (key: string, fallback: any) => {
  const saved = localStorage.getItem(`clocktower_${key}`);
  return saved ? JSON.parse(saved) : fallback;
};

export const useGameState = () => {
  const [currentDay, setCurrentDay] = useState(() => getStorage('day', 1));
  const [playerCount, setPlayerCount] = useState(() => getStorage('count', 15));
  const [players, setPlayers] = useState<Player[]>(() => getStorage('players', Array.from({ length: 15 }, (_, i) => ({ no: i + 1, inf: '', day: '', reason: '', red: '', property: '' }))));
  const [nominations, setNominations] = useState<Nomination[]>(() => getStorage('nominations', [{ id: '1', day: 1, f: '-', t: '-', voters: '', note: '' }]));
  const [deaths, setDeaths] = useState<Death[]>(() => getStorage('deaths', [
    { id: 'default-execution', day: 1, playerNo: '', reason: '⚔️', note: '', isConfirmed: true },
    { id: 'default-night', day: 1, playerNo: '', reason: '🌑', note: '', isConfirmed: true }
  ]));
  const [chars, setChars] = useState<CharDict>(() => getStorage('chars', createInitialChars()));
  const [roleDist, setRoleDist] = useState<RoleDist>(() => getStorage('dist', { townsfolk: 0, outsiders: 0, minions: 0, demons: 1 }));
  const [note, setNote] = useState(() => getStorage('note', ''));
  const [fontSize, setFontSize] = useState<'small' | 'mid' | 'large'>(() => getStorage('font', 'mid'));
  const [showHub, setShowHub] = useState(() => getStorage('showHub', true));
  const [splitView, setSplitView] = useState(() => getStorage('splitView', false));

  useEffect(() => {
    localStorage.setItem('clocktower_day', JSON.stringify(currentDay));
    localStorage.setItem('clocktower_count', JSON.stringify(playerCount));
    localStorage.setItem('clocktower_players', JSON.stringify(players));
    localStorage.setItem('clocktower_nominations', JSON.stringify(nominations));
    localStorage.setItem('clocktower_deaths', JSON.stringify(deaths));
    localStorage.setItem('clocktower_chars', JSON.stringify(chars));
    localStorage.setItem('clocktower_dist', JSON.stringify(roleDist));
    localStorage.setItem('clocktower_note', JSON.stringify(note));
    localStorage.setItem('clocktower_font', JSON.stringify(fontSize));
    localStorage.setItem('clocktower_showHub', JSON.stringify(showHub));
    localStorage.setItem('clocktower_splitView', JSON.stringify(splitView));
  }, [currentDay, playerCount, players, nominations, deaths, chars, roleDist, note, fontSize, showHub, splitView]);

  useEffect(() => {
    setPlayers(prev => {
      if (prev.length === playerCount) return prev;
      if (prev.length < playerCount) {
        const extra = Array.from({ length: playerCount - prev.length }, (_, i) => ({
          no: prev.length + i + 1, inf: '', day: '', reason: '', red: '', property: ''
        }));
        return [...prev, ...extra];
      }
      return prev.slice(0, playerCount);
    });
  }, [playerCount]);

  useEffect(() => {
    setPlayers(prev => prev.map(p => {
      const death = deaths.find(d => parseInt(d.playerNo) === p.no);
      return death ? { ...p, day: death.day.toString(), reason: death.reason } : { ...p, day: '', reason: '' };
    }));
  }, [deaths]);

  const deadPlayers = useMemo(() => players.filter(p => p.day !== '' || p.red !== '').map(p => p.no), [players]);

  const resetAll = () => {
    setPlayers(Array.from({ length: playerCount }, (_, i) => ({ no: i + 1, inf: '', day: '', reason: '', red: '', property: '' })));
    setNominations([{ id: Math.random().toString(), day: 1, f: '-', t: '-', voters: '', note: '' }]);
    setDeaths([
      { id: 'default-execution', day: 1, playerNo: '', reason: '⚔️', note: '', isConfirmed: true },
      { id: 'default-night', day: 1, playerNo: '', reason: '🌑', note: '', isConfirmed: true }
    ]);
    setCurrentDay(1);
    setChars(createInitialChars());
    setNote('');
    localStorage.clear();
  };

  return {
    currentDay, setCurrentDay, playerCount, setPlayerCount,
    players, setPlayers, nominations, setNominations,
    deaths, setDeaths, chars, setChars, roleDist, setRoleDist,
    note, setNote, fontSize, setFontSize, showHub, setShowHub,
    splitView, setSplitView, deadPlayers, resetAll
  };
};