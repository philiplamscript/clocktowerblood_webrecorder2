"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldAlert, 
  Plus, 
  Minus,
  Eye,
  EyeOff,
  BookOpen,
  Split
} from 'lucide-react';


import {
  type Player,
  type Nomination,
  type Death,
  type CharDict,
  type RoleDist,
  
  REASON_CYCLE,
  createInitialChars,
} from './type'


import PlayerDetailView from './components/PlayerDetailView';
import GlobalVotingView from './components/GlobalVotingView';
import LedgerTabsPopup from './components/popitems/popups/LedgerTabsPopup';
import RoleSelectorPopup from './components/popitems/popups/RoleSelectorPopup';
import RoleUpdatePopup from './components/popitems/popups/RoleUpdatePopup';
import ResetConfirmation from './components/popitems/popups/ResetConfirmation';
import FAB from './components/popitems/FAB';

export default function App() {
  const getStorage = (key: string, fallback: any) => {
    const saved = localStorage.getItem(`clocktower_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  };

  const [activeTab, setActiveTab] = useState<'players' | 'votes' | 'chars' | 'notes'>('players');
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
  
  const [showReset, setShowReset] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [focusPlayerNo, setFocusPlayerNo] = useState<number>(1);
  const [showRoleSelector, setShowRoleSelector] = useState<{ playerNo: number; roles: { role: string; category: string }[] } | null>(null);
  const [showRoleUpdate, setShowRoleUpdate] = useState(false);
  const [showLedger, setShowLedger] = useState(false);
  const [roleUpdateText, setRoleUpdateText] = useState('');
  const [voteHistoryMode, setVoteHistoryMode] = useState<'vote' | 'beVoted' | 'allReceive'>('allReceive');

  const [assignmentMode, setAssignmentMode] = useState<'death' | 'property' | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>('🌑');
  const [selectedProperty, setSelectedProperty] = useState<string>('');

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

  const fontSizeClass = {
    small: 'text-[10px]',
    mid: 'text-xs',
    large: 'text-sm'
  }[fontSize];

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
      if (death) {
        return { ...p, day: death.day.toString(), reason: death.reason };
      } else {
        return { ...p, day: '', reason: '' };
      }
    }));
  }, [deaths]);

  const [isDragging, setIsDragging] = useState(false);
  const [dragAction, setDragAction] = useState<'add' | 'remove' | null>(null);
  const [lastDraggedPlayer, setLastDraggedPlayer] = useState<number | null>(null);

  const deadPlayers = useMemo(() => {
    return players.filter(p => p.day !== '' || p.red !== '').map(p => p.no);
  }, [players]);

  const reset = () => {
    setPlayers(Array.from({ length: playerCount }, (_, i) => ({ no: i + 1, inf: '', day: '', reason: '', red: '', property: '' })));
    setNominations([{ id: Math.random().toString(), day: 1, f: '-', t: '-', voters: '', note: '' }]);
    setDeaths([
      { id: 'default-execution', day: 1, playerNo: '', reason: '⚔️', note: '', isConfirmed: true },
      { id: 'default-night', day: 1, playerNo: '', reason: '🌑', note: '', isConfirmed: true }
    ]);
    setCurrentDay(1);
    setChars(prev => ({
      Townsfolk: prev.Townsfolk.map(c => ({ ...c, status: '—', note: '' })),
      Outsider: prev.Outsider.map(c => ({ ...c, status: '—', note: '' })),
      Minion: prev.Minion.map(c => ({ ...c, status: '—', note: '' })),
      Demon: prev.Demon.map(c => ({ ...c, status: '—', note: '' })),
    }));
    setNote('');
    localStorage.clear();
    setShowReset(false);
  };

  const addNomination = () => {
    setNominations([...nominations, { id: Math.random().toString(), day: currentDay, f: '-', t: '-', voters: '', note: '' }]);
    setFabOpen(false);
    setShowLedger(true);
    setActiveTab('votes');
  };

  const addDeath = () => {
    setDeaths([...deaths, { id: Math.random().toString(), day: currentDay, playerNo: '', reason: '🌑', note: '', isConfirmed: true }]);
    setFabOpen(false);
    setShowLedger(true);
    setActiveTab('players');
  };

  const updatePlayerInfo = (no: number, text: string) => {
    setPlayers(prev => prev.map(p => p.no === no ? { ...p, inf: text } : p));
  };

  const updatePlayerProperty = (no: number, text: string) => {
    setPlayers(prev => prev.map(p => p.no === no ? { ...p, property: text } : p));
  };

  const togglePlayerAlive = (no: number) => {
    if (deadPlayers.includes(no)) {
      setDeaths(deaths.filter(d => parseInt(d.playerNo) !== no));
    } else {
      setDeaths([...deaths, { id: Math.random().toString(), day: currentDay, playerNo: no.toString(), reason: '⚔️', note: '', isConfirmed: true }]);
    }
  };

  const parseRoleUpdate = () => {
    const lines = roleUpdateText.split('\n').map(l => l.trim()).filter(l => l);
    const newChars: any = {
      Townsfolk: [],
      Outsider: [],
      Minion: [],
      Demon: []
    };
    let currentCategory: string | null = null;
    lines.forEach(line => {
      if (line.includes('鎮民:')) currentCategory = 'Townsfolk';
      else if (line.includes('外來者:')) currentCategory = 'Outsider';
      else if (line.includes('爪牙:')) currentCategory = 'Minion';
      else if (line.includes('惡魔:')) currentCategory = 'Demon';
      else if (currentCategory && line) {
        newChars[currentCategory].push({ name: line, status: '—', note: '' });
      }
    });
    Object.keys(newChars).forEach(cat => {
      while (newChars[cat].length < 8) {
        newChars[cat].push({ name: '', status: '—', note: '' });
      }
    });
    setChars(newChars);
    setShowRoleUpdate(false);
    setRoleUpdateText('');
  };

  const handlePlayerClick = (num: number) => {
    if (assignmentMode === 'death') {
      const existingDeath = deaths.find(d => parseInt(d.playerNo) === num);
      if (existingDeath) {
        setDeaths(deaths.map(d => d.id === existingDeath.id ? { ...d, reason: selectedReason, day: currentDay } : d));
      } else {
        setDeaths([...deaths, { id: Math.random().toString(), day: currentDay, playerNo: num.toString(), reason: selectedReason, note: '', isConfirmed: true }]);
      }
    } else if (assignmentMode === 'property') {
      setPlayers(prev => prev.map(p => {
        if (p.no === num) {
          const currentProps = p.property ? p.property.split('|').map(pr => pr.trim()) : [];
          if (!currentProps.includes(selectedProperty.trim())) {
            const newProps = [...currentProps, selectedProperty.trim()].filter(pr => pr).join('|');
            return { ...p, property: newProps };
          }
        }
        return p;
      }));
    } else {
      setFocusPlayerNo(num);
    }
  };

  const cycleSelectedReason = () => {
    const currentIndex = REASON_CYCLE.indexOf(selectedReason);
    const nextIndex = (currentIndex + 1) % REASON_CYCLE.length;
    setSelectedReason(REASON_CYCLE[nextIndex]);
  };

  const categoryBg = {
    Townsfolk: 'bg-blue-100 hover:bg-blue-200',
    Outsider: 'bg-blue-50 hover:bg-blue-100',
    Minion: 'bg-orange-50 hover:bg-orange-100',
    Demon: 'bg-red-100 hover:bg-red-200'
  };

  return (
    <div className={`fixed inset-0 bg-slate-100 flex flex-col font-sans select-none ${fontSizeClass}`} onMouseUp={() => setIsDragging(false)}>
      
      <header className="flex-none bg-slate-900 text-white px-3 py-2 flex justify-between items-center shadow-md z-50">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="text-red-500" size={14} />
          <h1 className="font-black text-xs uppercase italic tracking-tighter">LEDGER PRO v3.8</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSplitView(!splitView)} 
            className={`p-1 rounded transition-colors ${splitView ? 'text-blue-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'}`}
          >
            <Split size={14} />
          </button>
          <button 
            onClick={() => setShowLedger(true)} 
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all shadow-sm"
          >
            <BookOpen size={12} /> Full Ledger
          </button>
          <div className="h-4 w-px bg-slate-700 mx-1" />
          <button 
            onClick={() => setShowHub(!showHub)} 
            className={`p-1 rounded transition-colors ${showHub ? 'text-blue-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'}`}
          >
            {showHub ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        </div>
      </header>

      {showHub && (
        <div className="flex-none bg-slate-800 border-b border-slate-700 p-2 shadow-inner animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-wrap items-center gap-1.5 max-w-5xl mx-auto">
            <div className="flex items-center bg-slate-900 rounded-lg h-7 overflow-hidden border border-slate-700 shadow-lg mr-1 w-[58px]">
              <button onClick={() => setCurrentDay(Math.max(1, currentDay - 1))} className="flex-1 hover:bg-slate-800 text-slate-500 transition-colors flex items-center justify-center"><Minus size={10} /></button>
              <div className="w-6 font-black text-[9px] text-white bg-slate-800 h-full flex items-center justify-center tracking-tighter border-x border-slate-700">D{currentDay}</div>
              <button onClick={() => setCurrentDay(currentDay + 1)} className="flex-1 hover:bg-slate-800 text-slate-500 transition-colors flex items-center justify-center"><Plus size={10} /></button>
            </div>

            <div className="flex items-center gap-1 mr-2">
              <div className="flex items-center bg-slate-900 rounded-lg h-7 overflow-hidden border border-slate-700 shadow-lg">
                <button 
                  onClick={() => setAssignmentMode(assignmentMode === 'death' ? null : 'death')} 
                  className={`px-2 h-full text-[8px] font-black uppercase tracking-widest transition-colors ${assignmentMode === 'death' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  DEATH
                </button>
                <button 
                  onClick={cycleSelectedReason}
                  className="bg-slate-800 text-white text-[10px] border-none focus:ring-0 h-full px-2 hover:bg-slate-700 transition-colors"
                >
                  {selectedReason}
                </button>
              </div>

              <div className="flex items-center bg-slate-900 rounded-lg h-7 overflow-hidden border border-slate-700 shadow-lg">
                <button 
                  onClick={() => setAssignmentMode(assignmentMode === 'property' ? null : 'property')} 
                  className={`px-2 h-full text-[8px] font-black uppercase tracking-widest transition-colors ${assignmentMode === 'property' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  PROP
                </button>
                <input 
                  type="text" 
                  value={selectedProperty} 
                  onChange={(e) => setSelectedProperty(e.target.value)} 
                  placeholder="Type property..." 
                  className="bg-slate-800 text-white text-[10px] border-none focus:ring-0 h-full px-1 w-20"
                />
              </div>
            </div>

            {/* Player Tabs */}
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: playerCount }, (_, i) => i + 1).map(num => {
                const isDead = deadPlayers.includes(num);
                const hasInfo = players.find(p => p.no === num)?.inf !== '';
                const hasProperty = players.find(p => p.no === num)?.property !== '';
                const death = deaths.find(d => parseInt(d.playerNo) === num);
                const deathReason = death?.reason || '';
                return (
                  <button 
                    key={num} 
                    onClick={() => handlePlayerClick(num)}
                    className={`flex-none px-3 py-1 rounded-full text-[10px] font-black transition-all border-2 shadow-sm ${
                      assignmentMode ? 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600' :
                      num === focusPlayerNo ? 'bg-white text-slate-900 border-red-500 scale-105 z-10' :
                      isDead ? 'bg-slate-900 text-white border-red-900/50' : 
                      hasInfo ? 'bg-blue-600 text-white border-blue-400' : 
                      hasProperty ? 'bg-green-600 text-white border-green-400' : 
                      'bg-slate-700 text-slate-300 border-slate-600'
                    } active:scale-90`}
                  >
                    <span>{num}</span>
                    {isDead && <span className="ml-1 text-[8px] leading-none opacity-75">{deathReason}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-hidden relative">
        <div className={`h-full ${splitView ? 'grid grid-cols-2 divide-x divide-slate-300' : ''}`}>
          <div className={`${splitView ? 'overflow-hidden' : 'h-full'}`}>
            <PlayerDetailView 
              playerNo={focusPlayerNo}
              setPlayerNo={setFocusPlayerNo}
              playerCount={playerCount}
              players={players}
              deadPlayers={deadPlayers}
              updatePlayerInfo={updatePlayerInfo}
              updatePlayerProperty={updatePlayerProperty}
              togglePlayerAlive={togglePlayerAlive}
              chars={chars}
              nominations={nominations}
              setNominations={setNominations}
              voteHistoryMode={voteHistoryMode}
              setVoteHistoryMode={setVoteHistoryMode}
              setShowRoleSelector={setShowRoleSelector}
              deaths={deaths}
              setDeaths={setDeaths}
              currentDay={currentDay}
            />
          </div>
          {splitView && (
            <div className="overflow-hidden">
              <GlobalVotingView 
                nominations={nominations}
                playerCount={playerCount}
                deadPlayers={deadPlayers}
                players={players}
                deaths={deaths}
                currentDay={currentDay}
                onPlayerClick={setFocusPlayerNo}
              />
            </div>
          )}
        </div>
      </main>

      <LedgerTabsPopup 
        isOpen={showLedger}
        onClose={() => setShowLedger(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        players={players}
        setPlayers={setPlayers}
        nominations={nominations}
        setNominations={setNominations}
        chars={chars}
        setChars={setChars}
        note={note}
        setNote={setNote}
        playerCount={playerCount}
        setPlayerCount={setPlayerCount}
        roleDist={roleDist}
        setRoleDist={setRoleDist}
        deadPlayers={deadPlayers}
        addNomination={addNomination}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        dragAction={dragAction}
        setDragAction={setDragAction}
        lastDraggedPlayer={lastDraggedPlayer}
        setLastDraggedPlayer={setLastDraggedPlayer}
      />

      <RoleSelectorPopup
        showRoleSelector={showRoleSelector}
        setShowRoleSelector={setShowRoleSelector}
        updatePlayerInfo={updatePlayerInfo}
        players={players}
        categoryBg={categoryBg}
      />

      <RoleUpdatePopup
        showRoleUpdate={showRoleUpdate}
        setShowRoleUpdate={setShowRoleUpdate}
        roleUpdateText={roleUpdateText}
        setRoleUpdateText={setRoleUpdateText}
        parseRoleUpdate={parseRoleUpdate}
      />

      <ResetConfirmation
        showReset={showReset}
        setShowReset={setShowReset}
        reset={reset}
      />

      <FAB
        fabOpen={fabOpen}
        setFabOpen={setFabOpen}
        setShowReset={setShowReset}
        setShowRoleUpdate={setShowRoleUpdate}
        addNomination={addNomination}
        addDeath={addDeath}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      <div className="bg-white border-t px-3 py-1 text-[9px] font-bold text-slate-400 flex justify-between items-center z-50">
        <span>PLAYERS REGISTERED: {players.filter(p => p.inf).length} / {playerCount}</span>
        <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-red-500" style={{ width: `${(players.filter(p => p.inf).length / playerCount) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}