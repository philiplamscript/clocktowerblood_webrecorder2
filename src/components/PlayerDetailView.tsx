"use client";

import React, { useState } from 'react';
import { Vote, Calendar, Skull, Grid3X3, X } from 'lucide-react';
import { type NotepadTemplate } from '../type';
import TextRotaryPicker from './pickers/RotaryPicker/TextRotaryPicker';
import VoteHistoryClock from './popitems/VoteHistoryClock';
import PlayerInfoNotepad from './player/PlayerInfoNotepad';
import PlayerStatusActions from './player/PlayerStatusActions';

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
  setAssignmentMode?: (mode: any) => void;
  setSelectedReason?: (reason: string) => void;
  setSelectedProperty?: (property: string) => void;
  notepadTemplates?: NotepadTemplate[];
}

const PlayerDetailView: React.FC<PlayerDetailViewProps> = ({
  playerNo, playerCount, players, deadPlayers, updatePlayerInfo, updatePlayerProperty, togglePlayerAlive,
  chars, nominations, setNominations, voteHistoryMode, setVoteHistoryMode, deaths, setDeaths,
  currentDay, setCurrentDay, assignmentMode, selectedReason, selectedProperty, onPlayerClick,
  setAssignmentMode, setSelectedReason, setSelectedProperty, notepadTemplates = []
}) => {
  const [pendingNom, setPendingNom] = useState<{ f: string; t: string; voters: string[] } | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [filterDay, setFilterDay] = useState<number | 'all'>('all');
  const [showDeathIcons, setShowDeathIcons] = useState(true);
  const [showAxis, setShowAxis] = useState(true);

  const currentPlayer = players.find(p => p.no === playerNo);
  const death = deaths.find(d => parseInt(d.playerNo) === playerNo);
  const allRoles = Object.values(chars).flat().filter((c: any) => c.name).map((c: any) => ({ role: c.name, category: 'Townsfolk' }));

  return (
    <div className="h-full bg-white overflow-y-auto p-4 space-y-4">
      <div className="bg-slate-50 rounded-lg border p-4 space-y-3 shadow-sm flex flex-col items-center">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2"><Vote size={14} className="text-blue-600" /><span className="text-[10px] font-black uppercase tracking-wider">{isVoting ? 'Voting' : 'Patterns'}</span></div>
          <div className="flex items-center gap-1.5">
            <div className="flex bg-white border rounded-full p-0.5 shadow-sm">
              <button onClick={() => setShowDeathIcons(!showDeathIcons)} className={`p-1 rounded-full ${showDeathIcons ? 'bg-red-50 text-red-600' : 'text-slate-400'}`}><Skull size={12} /></button>
              <button onClick={() => setShowAxis(!showAxis)} className={`p-1 rounded-full ${showAxis ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}><Grid3X3 size={12} /></button>
            </div>
            <button onClick={() => setVoteHistoryMode(voteHistoryMode === 'vote' ? 'beVoted' : voteHistoryMode === 'beVoted' ? 'allReceive' : 'vote')} className="bg-slate-200 px-3 py-1 rounded-full text-[9px] font-black uppercase">{voteHistoryMode}</button>
          </div>
        </div>
        
        <VoteHistoryClock 
          playerNo={playerNo} nominations={nominations} playerCount={playerCount} deadPlayers={deadPlayers} 
          mode={voteHistoryMode} players={players} deaths={deaths} filterDay={filterDay} 
          onPlayerClick={(num) => onPlayerClick?.(num)} pendingNom={pendingNom} isVoting={isVoting}
          onNominationSlideEnd={(f, t) => setPendingNom({ f, t, voters: [] })}
          onVoterToggle={(v, force) => {}} // Implementation omitted for brevity
          onToggleVotingPhase={() => {}} // Implementation omitted for brevity
          currentDay={currentDay} showDeathIcons={showDeathIcons} showAxis={showAxis}
        />

        {pendingNom && !isVoting && (
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 animate-bounce">
            Nomination: {pendingNom.f} ➔ {pendingNom.t}
            <button onClick={() => setPendingNom(null)} className="ml-2 bg-red-500 px-2 py-1 rounded text-[8px]"><X size={10} /></button>
          </div>
        )}
      </div>

      <PlayerInfoNotepad 
        playerNo={playerNo} info={currentPlayer?.inf || ''} updateInfo={updatePlayerInfo} 
        allRoles={allRoles} notepadTemplates={notepadTemplates} 
      />

      <PlayerStatusActions 
        playerNo={playerNo} isDead={deadPlayers.includes(playerNo)} property={currentPlayer?.property || ''}
        deathDay={death?.day || currentDay} deathReason={death?.reason || '⚔️'} currentDay={currentDay}
        toggleAlive={togglePlayerAlive} updateProperty={updatePlayerProperty}
        updateDeath={(no, field, val) => setDeaths(deaths.map(d => parseInt(d.playerNo) === no ? { ...d, [field]: val } : d))}
      />
    </div>
  );
};

export default PlayerDetailView;