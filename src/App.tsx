"use client";

import React, { useState } from 'react';
import { REASON_CYCLE } from './type';
import { useGameState } from './hooks/useGameState';
import PlayerDetailView from './components/PlayerDetailView';
import GlobalVotingView from './components/GlobalVotingView';
import Header from './components/layout/Header';
import Hub from './components/layout/Hub';
import LedgerTabsPopup from './components/popitems/popups/LedgerTabsPopup';
import RoleSelectorPopup from './components/popitems/popups/RoleSelectorPopup';
import RoleUpdatePopup from './components/popitems/popups/RoleUpdatePopup';
import ResetConfirmation from './components/popitems/popups/ResetConfirmation';
import FAB from './components/popitems/FAB';

export default function App() {
  const g = useGameState();
  const [activeTab, setActiveTab] = useState<'players' | 'votes' | 'chars' | 'notes'>('players');
  const [focusPlayerNo, setFocusPlayerNo] = useState<number>(1);
  const [showRoleSelector, setShowRoleSelector] = useState<{ playerNo: number; roles: any[] } | null>(null);
  const [showRoleUpdate, setShowRoleUpdate] = useState(false);
  const [showLedger, setShowLedger] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [roleUpdateText, setRoleUpdateText] = useState('');
  const [voteHistoryMode, setVoteHistoryMode] = useState<'vote' | 'beVoted' | 'allReceive'>('allReceive');
  const [assignmentMode, setAssignmentMode] = useState<'death' | 'property' | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>('🌑');
  const [selectedProperty, setSelectedProperty] = useState<string>('');

  const handlePlayerClick = (num: number) => {
    if (assignmentMode === 'death') {
      const existing = g.deaths.find(d => parseInt(d.playerNo) === num);
      if (existing) g.setDeaths(g.deaths.map(d => d.id === existing.id ? { ...d, reason: selectedReason, day: g.currentDay } : d));
      else g.setDeaths([...g.deaths, { id: Math.random().toString(), day: g.currentDay, playerNo: num.toString(), reason: selectedReason, note: '', isConfirmed: true }]);
    } else if (assignmentMode === 'property') {
      g.setPlayers(prev => prev.map(p => p.no === num ? { ...p, property: [...(p.property ? p.property.split('|') : []), selectedProperty].filter(x => x).join('|') } : p));
    } else setFocusPlayerNo(num);
  };

  const parseRoleUpdate = () => {
    const lines = roleUpdateText.split('\n').map(l => l.trim()).filter(l => l);
    const newChars: any = { Townsfolk: [], Outsider: [], Minion: [], Demon: [] };
    let cat: string | null = null;
    lines.forEach(l => {
      if (l.includes('鎮民:')) cat = 'Townsfolk';
      else if (l.includes('外來者:')) cat = 'Outsider';
      else if (l.includes('爪牙:')) cat = 'Minion';
      else if (l.includes('惡魔:')) cat = 'Demon';
      else if (cat) newChars[cat].push({ name: l, status: '—', note: '' });
    });
    g.setChars(newChars);
    setShowRoleUpdate(false);
  };

  const fontSizeClass = { small: 'text-[10px]', mid: 'text-xs', large: 'text-sm' }[g.fontSize];

  return (
    <div className={`fixed inset-0 bg-slate-100 flex flex-col font-sans select-none ${fontSizeClass}`}>
      <Header splitView={g.splitView} setSplitView={g.setSplitView} showHub={g.showHub} setShowHub={g.setShowHub} setShowLedger={setShowLedger} />
      {g.showHub && (
        <Hub 
          currentDay={g.currentDay} setCurrentDay={g.setCurrentDay} playerCount={g.playerCount} players={g.players} 
          deadPlayers={g.deadPlayers} deaths={g.deaths} focusPlayerNo={focusPlayerNo} handlePlayerClick={handlePlayerClick}
          assignmentMode={assignmentMode} setAssignmentMode={setAssignmentMode} selectedReason={selectedReason}
          cycleSelectedReason={() => setSelectedReason(REASON_CYCLE[(REASON_CYCLE.indexOf(selectedReason) + 1) % REASON_CYCLE.length])}
          selectedProperty={selectedProperty} setSelectedProperty={setSelectedProperty}
        />
      )}
      <main className="flex-1 overflow-hidden relative">
        <div className={`h-full ${g.splitView ? 'grid grid-cols-2 divide-x divide-slate-300' : ''}`}>
          <PlayerDetailView 
            playerNo={focusPlayerNo} setPlayerNo={setFocusPlayerNo} playerCount={g.playerCount} players={g.players} 
            deadPlayers={g.deadPlayers} updatePlayerInfo={(no, t) => g.setPlayers(p => p.map(x => x.no === no ? { ...x, inf: t } : x))}
            updatePlayerProperty={(no, t) => g.setPlayers(p => p.map(x => x.no === no ? { ...x, property: t } : x))}
            togglePlayerAlive={(no) => g.deadPlayers.includes(no) ? g.setDeaths(g.deaths.filter(d => parseInt(d.playerNo) !== no)) : g.setDeaths([...g.deaths, { id: Math.random().toString(), day: g.currentDay, playerNo: no.toString(), reason: '⚔️', note: '', isConfirmed: true }])}
            chars={g.chars} nominations={g.nominations} setNominations={g.setNominations} voteHistoryMode={voteHistoryMode} setVoteHistoryMode={setVoteHistoryMode}
            setShowRoleSelector={setShowRoleSelector} deaths={g.deaths} setDeaths={g.setDeaths} currentDay={g.currentDay}
          />
          {g.splitView && <GlobalVotingView nominations={g.nominations} playerCount={g.playerCount} deadPlayers={g.deadPlayers} players={g.players} deaths={g.deaths} currentDay={g.currentDay} onPlayerClick={setFocusPlayerNo} />}
        </div>
      </main>
      <LedgerTabsPopup isOpen={showLedger} onClose={() => setShowLedger(false)} activeTab={activeTab} setActiveTab={setActiveTab} players={g.players} setPlayers={g.setPlayers} nominations={g.nominations} setNominations={g.setNominations} chars={g.chars} setChars={g.setChars} note={g.note} setNote={g.setNote} playerCount={g.playerCount} setPlayerCount={g.setPlayerCount} roleDist={g.roleDist} setRoleDist={g.setRoleDist} deadPlayers={g.deadPlayers} addNomination={() => { g.setNominations([...g.nominations, { id: Math.random().toString(), day: g.currentDay, f: '-', t: '-', voters: '', note: '' }]); setShowLedger(true); setActiveTab('votes'); }} isDragging={false} setIsDragging={() => {}} dragAction={null} setDragAction={() => {}} lastDraggedPlayer={null} setLastDraggedPlayer={() => {}} />
      <RoleSelectorPopup showRoleSelector={showRoleSelector} setShowRoleSelector={setShowRoleSelector} updatePlayerInfo={(no, t) => g.setPlayers(p => p.map(x => x.no === no ? { ...x, inf: t } : x))} players={g.players} categoryBg={{ Townsfolk: 'bg-blue-100 hover:bg-blue-200', Outsider: 'bg-blue-50 hover:bg-blue-100', Minion: 'bg-orange-50 hover:bg-orange-100', Demon: 'bg-red-100 hover:bg-red-200' }} />
      <RoleUpdatePopup showRoleUpdate={showRoleUpdate} setShowRoleUpdate={setShowRoleUpdate} roleUpdateText={roleUpdateText} setRoleUpdateText={setRoleUpdateText} parseRoleUpdate={parseRoleUpdate} />
      <ResetConfirmation showReset={showReset} setShowReset={setShowReset} reset={g.resetAll} />
      <FAB fabOpen={fabOpen} setFabOpen={setFabOpen} setShowReset={setShowReset} setShowRoleUpdate={setShowRoleUpdate} addNomination={() => { g.setNominations([...g.nominations, { id: Math.random().toString(), day: g.currentDay, f: '-', t: '-', voters: '', note: '' }]); setActiveTab('votes'); setShowLedger(true); }} addDeath={() => { g.setDeaths([...g.deaths, { id: Math.random().toString(), day: g.currentDay, playerNo: '', reason: '🌑', note: '', isConfirmed: true }]); setActiveTab('players'); setShowLedger(true); }} fontSize={g.fontSize} setFontSize={g.setFontSize} />
    </div>
  );
}