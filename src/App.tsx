"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Vote, 
  ShieldAlert, 
  FileText, 
  Plus, 
  Skull, 
  Minus,
  Eye,
  EyeOff
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


import PlayersTab from './components/tabs/PlayersTab';
import VotesTab from './components/tabs/VotesTab';
import CharsTab from './components/tabs/CharsTab';
import NotesTab from './components/tabs/NotesTab';

import PlayerInfoPopup from './components/popitems/popups/PlayerInfoPopup';
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
  
  const [showReset, setShowReset] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [popupPlayerNo, setPopupPlayerNo] = useState<number | null>(null);
  const [showRoleSelector, setShowRoleSelector] = useState<{ playerNo: number; roles: { role: string; category: string }[] } | null>(null);
  const [showRoleUpdate, setShowRoleUpdate] = useState(false);
  const [roleUpdateText, setRoleUpdateText] = useState('');
  const [voteHistoryMode, setVoteHistoryMode] = useState<'vote' | 'beVoted' | 'allReceive'>('allReceive');

  const [assignmentMode, setAssignmentMode] = useState<'death' | 'property' | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>('⚔️');
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
  }, [currentDay, playerCount, players, nominations, deaths, chars, roleDist, note, fontSize, showHub]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

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
    setActiveTab('votes');
    setFabOpen(false);
  };

  const addDeath = () => {
    setDeaths([...deaths, { id: Math.random().toString(), day: currentDay, playerNo: '', reason: '🌑', note: '', isConfirmed: true }]);
    setFabOpen(false);
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
      setDeaths([...deaths, { id: Math.random().toString(), day: currentDay, playerNo: no.toString(), reason: '🌑', note: '', isConfirmed: true }]);
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

  const categoryBg = {
    Townsfolk: 'bg-blue-100 hover:bg-blue-200',
    Outsider: 'bg-blue-50 hover:bg-blue-100',
    Minion: 'bg-orange-50 hover:bg-orange-100',
    Demon: 'bg-red-100 hover:bg-red-200'
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
      setPopupPlayerNo(num);
    }
  };

  return (
    <div className={`fixed inset-0 bg-slate-100 flex flex-col font-sans select-none ${fontSizeClass}`} onMouseUp={() => setIsDragging(false)}>
      
      <header className="flex-none bg-slate-900 text-white px-3 py-2 flex justify-between items-center shadow-md z-50">
        <div className="flex items-center gap-1.5"><ShieldAlert className="text-red-500" size={14} /><h1 className="font-black text-xs uppercase italic tracking-tighter">LEDGER PRO v3.8</h1></div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowHub(!showHub)} 
            className={`p-1 rounded transition-colors ${showHub ? 'text-blue-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'}`}
          >
            {showHub ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">v3.8.0</div>
        </div>
      </header>

      {showHub && (
        <div className="flex-none bg-slate-800 border-b border-slate-700 p-2 shadow-inner animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-wrap items-center gap-1.5 max-w-4xl mx-auto">
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
                <select 
                  value={selectedReason} 
                  onChange={(e) => setSelectedReason(e.target.value)} 
                  className="bg-slate-800 text-white text-[10px] border-none focus:ring-0 h-full px-1"
                >
                  {REASON_CYCLE.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
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
                  className={`flex-none w-7 h-7 rounded-full flex flex-col items-center justify-center text-[10px] font-black transition-all border-2 shadow-sm ${assignmentMode ? 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600' : isDead ? 'bg-slate-900 text-white border-red-900/50' : hasInfo ? 'bg-blue-600 text-white border-blue-400' : hasProperty ? 'bg-green-600 text-white border-green-400' : 'bg-slate-700 text-slate-300 border-slate-600'} active:scale-90`}
                >
                  <span>{num}</span>
                  {isDead && <span className="text-[5px] leading-none opacity-75">{deathReason}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <nav className="flex-none bg-white border-b flex shadow-sm z-40">
        {[
          { id: 'players', icon: Users, label: 'PLAYERS' },
          { id: 'votes', icon: Vote, label: 'VOTES' },
          { id: 'chars', icon: ShieldAlert, label: 'ROLES' },
          { id: 'notes', icon: FileText, label: 'NOTES' },
        ].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`flex-1 py-2 flex flex-col items-center gap-0.5 border-b-2 transition-all ${activeTab === t.id ? 'border-red-600 bg-red-50 text-red-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            <t.icon size={12} /><span className="text-[8px] font-black">{t.label}</span>
          </button>
        ))}
      </nav>

      <main className="flex-1 overflow-y-auto p-3 no-scrollbar relative">
        <div className="max-w-4xl mx-auto space-y-3 pb-24">
          {activeTab === 'players' && <PlayersTab players={players} setPlayers={setPlayers} />}
          {activeTab === 'votes' && <VotesTab nominations={nominations} setNominations={setNominations} isDragging={isDragging} setIsDragging={setIsDragging} dragAction={dragAction} setDragAction={setDragAction} lastDraggedPlayer={lastDraggedPlayer} setLastDraggedPlayer={setLastDraggedPlayer} deadPlayers={deadPlayers} playerCount={playerCount} addNomination={addNomination} />}
          {activeTab === 'chars' && <CharsTab chars={chars} setChars={setChars} playerCount={playerCount} setPlayerCount={setPlayerCount} roleDist={roleDist} setRoleDist={setRoleDist} />}
          {activeTab === 'notes' && <NotesTab note={note} setNote={setNote} />}
        </div>
      </main>

      <PlayerInfoPopup
        popupPlayerNo={popupPlayerNo}
        setPopupPlayerNo={setPopupPlayerNo}
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

      <div className="bg-white border-t px-3 py-1 text-[9px] font-bold text-slate-400 flex justify-between items-center">
        <span>PLAYERS REGISTERED: {players.filter(p => p.inf).length} / {playerCount}</span>
        <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-red-500" style={{ width: `${(players.filter(p => p.inf).length / playerCount) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}