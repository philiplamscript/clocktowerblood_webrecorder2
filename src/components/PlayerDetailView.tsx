"use client";

import React, { useState } from 'react';
import { 
  Skull,
  Vote,
  Tag,
  Calendar,
  Key,
  X
} from 'lucide-react';

import { REASON_CYCLE } from '../type';
import TextRotaryPicker from './pickers/RotaryPicker/TextRotaryPicker';
import VoteHistoryClock from './popitems/VoteHistoryClock';

interface PlayerDetailViewProps {
  playerNo: number;
  setPlayerNo: (no: number) => void;
  playerCount: number;
  players: any[];
  deadPlayers: number[];
  updatePlayerInfo: (no: number, text: string) => void;
  updatePlayerProperty: (no: number, text: string) => void;
  togglePlayerAlive: (no: number) => void;
  chars: any;
  nominations: any[];
  setNominations: (noms: any[]) => void;
  voteHistoryMode: 'vote' | 'beVoted' | 'allReceive';
  setVoteHistoryMode: (mode: 'vote' | 'beVoted' | 'allReceive') => void;
  setShowRoleSelector: (selector: { playerNo: number; roles: { role: string; category: string }[] } | null) => void;
  deaths: any[];
  setDeaths: (deaths: any[]) => void;
  currentDay: number;
  setCurrentDay: (day: number) => void;
  assignmentMode?: 'death' | 'property' | null;
  selectedReason?: string;
  selectedProperty?: string;
  onPlayerClick?: (num: number) => void;
  setAssignmentMode?: (mode: 'death' | 'property' | null) => void;
  setSelectedReason?: (reason: string) => void;
  setSelectedProperty?: (property: string) => void;
}

const PlayerDetailView: React.FC<PlayerDetailViewProps> = ({
  playerNo,
  setPlayerNo,
  playerCount,
  players,
  deadPlayers,
  updatePlayerInfo,
  updatePlayerProperty,
  togglePlayerAlive,
  chars,
  nominations,
  setNominations,
  voteHistoryMode,
  setVoteHistoryMode,
  setShowRoleSelector,
  deaths,
  setDeaths,
  currentDay,
  setCurrentDay,
  assignmentMode,
  selectedReason,
  selectedProperty,
  onPlayerClick,
  setAssignmentMode,
  setSelectedReason,
  setSelectedProperty
}) => {
  const [pendingNom, setPendingNom] = useState<{ f: string; t: string; voters: string[] } | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [filterDay, setFilterDay] = useState<number | 'all'>('all');
  const [showKeywords, setShowKeywords] = useState(false);
  const [showDeathIcons, setShowDeathIcons] = useState(true);

  const handleToggleVotingPhase = () => {
    if (!pendingNom) return;
    
    if (!isVoting) {
      setIsVoting(true);
    } else {
      const newNom = {
        id: Math.random().toString(36).substr(2, 9),
        day: currentDay,
        f: pendingNom.f,
        t: pendingNom.t,
        voters: pendingNom.voters.join(','),
        note: ''
      };
      setNominations([...nominations, newNom]);
      setPendingNom(null);
      setIsVoting(false);
    }
  };

  const handleVoterToggle = (voterNo: string, forceAction?: 'add' | 'remove') => {
    if (!isVoting || !pendingNom) return;
    setPendingNom(prev => {
      if (!prev) return null;
      let voters = [...prev.voters];
      const hasVoter = voters.includes(voterNo);
      
      if (forceAction === 'add') {
        if (!hasVoter) voters.push(voterNo);
      } else if (forceAction === 'remove') {
        voters = voters.filter(v => v !== voterNo);
      } else {
        voters = hasVoter ? voters.filter(v => v !== voterNo) : [...voters, voterNo];
      }
      
      return { ...prev, voters: voters.sort((a, b) => parseInt(a) - parseInt(b)) };
    });
  };

  const handleNominationSlideEnd = (from: string, to: string) => {
    setPendingNom({ f: from, t: to, voters: [] });
    setIsVoting(false);
  };

  const currentPlayer = players.find(p => p.no === playerNo);
  const isDead = deadPlayers.includes(playerNo);
  const dayOptions = ['ALL', ...Array.from({ length: currentDay }, (_, i) => `D${i + 1}`)];
  const currentFilterText = filterDay === 'all' ? 'ALL' : `D${filterDay}`;

  const modeLabels = {
    vote: 'Votes',
    beVoted: 'Received',
    allReceive: 'All Global'
  };

  const death = deaths.find(d => d.playerNo === playerNo.toString());

  const updateDeathDay = (playerNo: number, newDay: number) => {
    setDeaths(deaths.map(d => d.playerNo === playerNo.toString() ? { ...d, day: newDay } : d));
  };

  const updateDeathReason = (playerNo: number, newReason: string) => {
    setDeaths(deaths.map(d => d.playerNo === playerNo.toString() ? { ...d, reason: newReason } : d));
  };

  const cycleDeathReason = () => {
    const currentReason = death?.reason || '⚔️';
    const currentIndex = REASON_CYCLE.indexOf(currentReason);
    const nextIndex = (currentIndex + 1) % REASON_CYCLE.length;
    updateDeathReason(playerNo, REASON_CYCLE[nextIndex]);
  };

  const allRoles = [
    ...chars.Townsfolk.map((c: any) => ({ role: c.name, category: 'Townsfolk' })).filter((item: any) => item.role),
    ...chars.Outsider.map((c: any) => ({ role: c.name, category: 'Outsider' })).filter((item: any) => item.role),
    ...chars.Minion.map((c: any) => ({ role: c.name, category: 'Minion' })).filter((item: any) => item.role),
    ...chars.Demon.map((c: any) => ({ role: c.name, category: 'Demon' })).filter((item: any) => item.role)
  ];

  const categoryBg = {
    Townsfolk: 'bg-blue-100 hover:bg-blue-200',
    Outsider: 'bg-blue-50 hover:bg-blue-100',
    Minion: 'bg-orange-50 hover:bg-orange-100',
    Demon: 'bg-red-100 hover:bg-red-200'
  };

  return (
    <div className="h-full bg-white overflow-hidden">
      <div className="h-full overflow-y-auto p-4 space-y-4">
        <div className="space-y-4">
          {/* Voting Patterns Section */}
          <div className="bg-slate-50 rounded-lg border p-4 space-y-3 shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Vote size={14} className="text-blue-600" />
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
                  {isVoting ? 'Voting Recording' : 'Voting Patterns'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {!isVoting && !pendingNom && (
                  <div className="flex items-center gap-1 bg-white border rounded-full px-2 h-7 shadow-sm">
                    <Calendar size={12} className="text-slate-400" />
                    <div className="w-10">
                      <TextRotaryPicker 
                        value={currentFilterText} 
                        options={dayOptions} 
                        onChange={(val) => setFilterDay(val === 'ALL' ? 'all' : parseInt(val.replace('D', '')))}
                        color="text-slate-800"
                      />
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={() => setShowDeathIcons(!showDeathIcons)}
                  className={`p-1 rounded transition-colors ${showDeathIcons ? 'text-red-500 hover:bg-red-50' : 'text-slate-400 hover:bg-slate-100'}`}
                >
                  <Skull size={14} />
                </button>
                
                <button 
                  onClick={() => {
                    if (voteHistoryMode === 'vote') setVoteHistoryMode('beVoted');
                    else if (voteHistoryMode === 'beVoted') setVoteHistoryMode('allReceive');
                    else setVoteHistoryMode('vote');
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-full text-[9px] font-black uppercase transition-colors shadow-sm min-w-[80px]"
                  disabled={isVoting}
                >
                  {modeLabels[voteHistoryMode]}
                </button>
              </div>
            </div>

            {/* Assignment Row */}
            <div className="w-full flex items-center gap-2">
              <div className="flex items-center bg-slate-900 rounded-lg h-8 overflow-hidden border border-slate-700 shadow-lg">
                <button 
                  onClick={() => setAssignmentMode?.(assignmentMode === 'death' ? null : 'death')} 
                  className={`px-2 h-full text-[8px] font-black uppercase tracking-widest transition-colors ${assignmentMode === 'death' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  DEATH
                </button>
                <button 
                  onClick={() => {
                    if (setSelectedReason) {
                      const currentIndex = REASON_CYCLE.indexOf(selectedReason || '⚔️');
                      const nextIndex = (currentIndex + 1) % REASON_CYCLE.length;
                      setSelectedReason(REASON_CYCLE[nextIndex]);
                    }
                  }}
                  className="bg-slate-800 text-white text-[10px] border-none focus:ring-0 h-full px-2 hover:bg-slate-700 transition-colors"
                >
                  {selectedReason || '⚔️'}
                </button>
              </div>

              <div className="flex items-center bg-slate-900 rounded-lg h-8 overflow-hidden border border-slate-700 shadow-lg">
                <button 
                  onClick={() => setAssignmentMode?.(assignmentMode === 'property' ? null : 'property')} 
                  className={`px-2 h-full text-[8px] font-black uppercase tracking-widest transition-colors ${assignmentMode === 'property' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  PROP
                </button>
                <input 
                  type="text" 
                  value={selectedProperty || ''} 
                  onChange={(e) => setSelectedProperty?.(e.target.value)} 
                  placeholder="Type property..." 
                  className="bg-slate-800 text-white text-[10px] border-none focus:ring-0 h-full px-1 w-20"
                />
              </div>
            </div>
            
            <VoteHistoryClock 
              playerNo={playerNo} 
              nominations={nominations} 
              playerCount={playerCount} 
              deadPlayers={deadPlayers} 
              mode={voteHistoryMode} 
              players={players}
              deaths={deaths}
              filterDay={filterDay}
              onPlayerClick={(num) => onPlayerClick?.(num)}
              pendingNom={pendingNom}
              isVoting={isVoting}
              onNominationSlideEnd={handleNominationSlideEnd}
              onVoterToggle={handleVoterToggle}
              onToggleVotingPhase={handleToggleVotingPhase}
              currentDay={currentDay}
              setCurrentDay={setCurrentDay}
              showDeathIcons={showDeathIcons}
              assignmentMode={assignmentMode}
              selectedReason={selectedReason}
              selectedProperty={selectedProperty}
              setSelectedReason={setSelectedReason}
            />

            {pendingNom && !isVoting && (
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 animate-bounce shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full" />
                Nomination Ready: {pendingNom.f} ➔ {pendingNom.t}
                <button 
                  onClick={() => setPendingNom(null)} 
                  className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-[8px] font-bold flex items-center gap-1"
                >
                  <X size={10} /> CANCEL
                </button>
              </div>
            )}
          </div>

          {/* Expandable Keywords Section */}
          {showKeywords && (
            <div className="bg-white border rounded-lg p-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
              {allRoles.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <h4 className="text-[8px] font-black text-blue-400 uppercase">Townsfolk</h4>
                    {allRoles.filter(r => r.category === 'Townsfolk').map((item, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => {
                          updatePlayerInfo(playerNo, (currentPlayer?.inf || '') + (currentPlayer?.inf ? '\n' : '') + item.role);
                        }}
                        className={`${categoryBg[item.category as keyof typeof categoryBg]} text-slate-900 px-2 py-1 rounded text-[9px] font-bold transition-colors text-left`}
                      >
                        {item.role}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[8px] font-black text-blue-200 uppercase">Outsider</h4>
                    {allRoles.filter(r => r.category === 'Outsider').map((item, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => {
                          updatePlayerInfo(playerNo, (currentPlayer?.inf || '') + (currentPlayer?.inf ? '\n' : '') + item.role);
                        }}
                        className={`${categoryBg[item.category as keyof typeof categoryBg]} text-slate-900 px-2 py-1 rounded text-[9px] font-bold transition-colors text-left`}
                      >
                        {item.role}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[8px] font-black text-red-400 uppercase">Minions & Demons</h4>
                    {allRoles.filter(r => r.category === 'Minion' || r.category === 'Demon').map((item, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => {
                          updatePlayerInfo(playerNo, (currentPlayer?.inf || '') + (currentPlayer?.inf ? '\n' : '') + item.role);
                        }}
                        className={`${categoryBg[item.category as keyof typeof categoryBg]} text-slate-900 px-2 py-1 rounded text-[9px] font-bold transition-colors text-left`}
                      >
                        {item.role}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-xs">No roles defined yet.</p>
              )}
            </div>
          )}

          {/* Player Note Section with Keyword button on the right */}
          <div className="flex gap-2 items-start">
            <textarea 
              className="flex-1 min-h-[100px] border border-slate-200 bg-white rounded-lg p-4 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none font-medium leading-relaxed shadow-sm"
              placeholder="Type social reads, role claims, or night info here..."
              value={currentPlayer?.inf || ''}
              onChange={(e) => updatePlayerInfo(playerNo, e.target.value)}
            />
            <button 
              onClick={() => setShowKeywords(!showKeywords)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-sm transition-all"
            >
              <Key size={14} />
            </button>
          </div>

          {/* Death Status and Prop in one row, always visible */}
          <div className="flex items-center gap-2">
            {isDead ? (
              <div className="flex-[8] flex items-center gap-1 h-10">
                <button 
                  onClick={() => togglePlayerAlive(playerNo)} 
                  className="flex-1 h-full bg-red-600 text-white rounded-lg flex items-center justify-center shadow-sm transition-all"
                >
                  <Skull size={14} />
                </button>
                <input 
                  type="number" 
                  value={death?.day || currentDay} 
                  onChange={(e) => updateDeathDay(playerNo, parseInt(e.target.value) || currentDay)} 
                  className="flex-1 h-full bg-white border rounded-lg text-center text-[10px] font-black focus:ring-0" 
                />
                <button 
                  onClick={cycleDeathReason}
                  className="flex-[2] h-full bg-white border rounded-lg text-center text-[12px] font-black hover:bg-slate-50 transition-colors"
                >
                  {death?.reason || '⚔️'}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => togglePlayerAlive(playerNo)}
                className="flex-[8] h-10 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 shadow-sm bg-emerald-<dyad-write path="src/App.tsx" description="Adding setSelectedReason prop to App and passing it down to GlobalVotingView and PlayerDetailView.">
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
            <Eye size={14} />
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
              setCurrentDay={setCurrentDay}
              assignmentMode={assignmentMode}
              selectedReason={selectedReason}
              selectedProperty={selectedProperty}
              onPlayerClick={handlePlayerClick}
              setAssignmentMode={setAssignmentMode}
              setSelectedReason={setSelectedReason}
              setSelectedProperty={setSelectedProperty}
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
                setCurrentDay={setCurrentDay}
                onPlayerClick={handlePlayerClick}
                assignmentMode={assignmentMode}
                selectedReason={selectedReason}
                selectedProperty={selectedProperty}
                setSelectedReason={setSelectedReason}
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