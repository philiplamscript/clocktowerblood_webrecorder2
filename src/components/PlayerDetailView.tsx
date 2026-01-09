"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';

import { REASON_CYCLE, type NotepadTemplate } from '../type';
import VoteHistoryClock from './popitems/VoteHistoryClock/VoteHistoryClock';
import DetailHeader from './player-detail/DetailHeader';
import AssignmentControls from './player-detail/AssignmentControls';
import NoteSection from './player-detail/NoteSection';
import StatusSection from './player-detail/StatusSection';

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
  setShowRoleSelector: (selector: any) => void;
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
  notepadTemplates?: NotepadTemplate[];
}

const PlayerDetailView: React.FC<PlayerDetailViewProps> = (props) => {
  const [pendingNom, setPendingNom] = useState<{ f: string; t: string; voters: string[] } | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [filterDay, setFilterDay] = useState<number | 'all'>('all');
  const [showKeywords, setShowKeywords] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showDeathIcons, setShowDeathIcons] = useState(true);
  const [showAxis, setShowAxis] = useState(true);

  const handleToggleVotingPhase = () => {
    if (!pendingNom) return;
    if (!isVoting) setIsVoting(true);
    else {
      const newNom = { id: Math.random().toString(36).substr(2, 9), day: props.currentDay, f: pendingNom.f, t: pendingNom.t, voters: pendingNom.voters.join(','), note: '' };
      props.setNominations([...props.nominations, newNom]);
      setPendingNom(null); setIsVoting(false);
    }
  };

  const handleVoterToggle = (voterNo: string, forceAction?: 'add' | 'remove') => {
    if (!isVoting || !pendingNom) return;
    setPendingNom(prev => {
      if (!prev) return null;
      let voters = [...prev.voters];
      const exists = voters.includes(voterNo);
      if (forceAction === 'add' ? !exists : forceAction === 'remove' ? exists : true) {
        voters = (forceAction === 'remove' || (forceAction !== 'add' && exists)) ? voters.filter(v => v !== voterNo) : [...voters, voterNo];
      }
      return { ...prev, voters: voters.sort((a, b) => parseInt(a) - parseInt(b)) };
    });
  };

  const insertTemplate = (content: string) => {
    const cur = props.players.find(p => p.no === props.playerNo)?.inf || '';
    props.updatePlayerInfo(props.playerNo, cur + (cur ? '\n\n' : '') + content);
    setShowTemplates(false);
  };

  const currentPlayer = props.players.find(p => p.no === props.playerNo);
  const death = props.deaths.find(d => d.playerNo === props.playerNo.toString());
  const allRoles = ['Townsfolk', 'Outsider', 'Minion', 'Demon'].flatMap(cat => 
    props.chars[cat].map((c: any) => ({ role: c.name, category: cat })).filter((i: any) => i.role)
  );

  return (
    <div className="h-full bg-[#1a1412] overflow-y-auto p-4 space-y-4">
      <div className="bg-[#2d241f] rounded-xl border border-[#4a3a32] p-4 space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col items-center relative overflow-hidden">
        {/* Decorative subtle grain or texture overlay could go here */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
        
        <DetailHeader 
          isVoting={isVoting} filterDay={filterDay} setFilterDay={setFilterDay}
          dayOptions={['ALL', ...Array.from({ length: props.currentDay }, (_, i) => `D${i + 1}`)]}
          currentFilterText={filterDay === 'all' ? 'ALL' : `D${filterDay}`}
          showDeathIcons={showDeathIcons} setShowDeathIcons={setShowDeathIcons}
          showAxis={showAxis} setShowAxis={setShowAxis}
          voteHistoryMode={props.voteHistoryMode} setVoteHistoryMode={props.setVoteHistoryMode}
        />

        <AssignmentControls 
          assignmentMode={props.assignmentMode ?? null} setAssignmentMode={props.setAssignmentMode ?? (() => {})}
          selectedReason={props.selectedReason ?? '⚔️'} setSelectedReason={props.setSelectedReason ?? (() => {})}
          selectedProperty={props.selectedProperty ?? ''} setSelectedProperty={props.setSelectedProperty ?? (() => {})}
        />
        
        <VoteHistoryClock 
          playerNo={props.playerNo} nominations={props.nominations} playerCount={props.playerCount} deadPlayers={props.deadPlayers} 
          mode={props.voteHistoryMode} players={props.players} deaths={props.deaths} filterDay={filterDay}
          onPlayerClick={props.onPlayerClick ?? (() => {})} pendingNom={pendingNom} isVoting={isVoting}
          onNominationSlideEnd={(f, t) => setPendingNom({ f, t, voters: [] })}
          onVoterToggle={handleVoterToggle} onToggleVotingPhase={handleToggleVotingPhase}
          currentDay={props.currentDay} setCurrentDay={props.setCurrentDay} showDeathIcons={showDeathIcons} showAxis={showAxis}
          assignmentMode={props.assignmentMode} selectedReason={props.selectedReason} selectedProperty={props.selectedProperty}
        />

        {pendingNom && !isVoting && (
          <div className="bg-amber-600 text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 animate-bounce shadow-[0_0_15px_rgba(217,119,6,0.5)] border border-amber-400/30">
            Nomination: {pendingNom.f} ➔ {pendingNom.t}
            <button onClick={() => setPendingNom(null)} className="ml-2 bg-red-900/80 text-white px-2 py-1 rounded text-[8px] flex items-center gap-1 border border-red-500/30 hover:bg-red-800 transition-colors"><X size={10} /> CANCEL</button>
          </div>
        )}
      </div>

      <NoteSection 
        currentPlayer={currentPlayer} playerNo={props.playerNo} updatePlayerInfo={props.updatePlayerInfo}
        showKeywords={showKeywords} setShowKeywords={setShowKeywords} showTemplates={showTemplates} setShowTemplates={setShowTemplates}
        allRoles={allRoles} categoryBg={{ Townsfolk: 'bg-blue-900/40 border border-blue-500/30 text-blue-100', Outsider: 'bg-indigo-900/40 border border-indigo-500/30 text-indigo-100', Minion: 'bg-orange-900/40 border border-orange-500/30 text-orange-100', Demon: 'bg-red-900/40 border border-red-500/30 text-red-100' }}
        notepadTemplates={props.notepadTemplates ?? []} insertTemplate={insertTemplate}
      />

      <StatusSection 
        isDead={props.deadPlayers.includes(props.playerNo)} togglePlayerAlive={props.togglePlayerAlive}
        playerNo={props.playerNo} death={death} currentDay={props.currentDay}
        updateDeathDay={(no, day) => props.setDeaths(props.deaths.map(d => d.playerNo === no.toString() ? { ...d, day } : d))}
        cycleDeathReason={() => {
          const cur = death?.reason || '⚔️';
          const next = REASON_CYCLE[(REASON_CYCLE.indexOf(cur) + 1) % REASON_CYCLE.length];
          props.setDeaths(props.deaths.map(d => d.playerNo === props.playerNo.toString() ? { ...d, reason: next } : d));
        }}
        currentPlayer={currentPlayer} updatePlayerProperty={props.updatePlayerProperty}
      />
    </div>
  );
};

export default PlayerDetailView;