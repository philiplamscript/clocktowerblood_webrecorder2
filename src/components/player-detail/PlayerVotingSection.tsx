"use client";

import React from 'react';
import { Vote, Calendar, Skull } from 'lucide-react';
import TextRotaryPicker from '../pickers/RotaryPicker/TextRotaryPicker';
import VoteHistoryClock from '../popitems/VoteHistoryClock';

interface PlayerVotingSectionProps {
  playerNo: number;
  setPlayerNo: (no: number) => void;
  playerCount: number;
  players: any[];
  deadPlayers: number[];
  deaths: any[];
  nominations: any[];
  setNominations: (noms: any[]) => void;
  voteHistoryMode: 'vote' | 'beVoted' | 'allReceive';
  setVoteHistoryMode: (mode: 'vote' | 'beVoted' | 'allReceive') => void;
  currentDay: number;
  pendingNom: any;
  setPendingNom: (v: any) => void;
  isVoting: boolean;
  setIsVoting: (v: boolean) => void;
}

const PlayerVotingSection: React.FC<PlayerVotingSectionProps> = ({
  playerNo, setPlayerNo, playerCount, players, deadPlayers, deaths,
  nominations, setNominations, voteHistoryMode, setVoteHistoryMode,
  currentDay, pendingNom, setPendingNom, isVoting, setIsVoting
}) => {
  const [filterDay, setFilterDay] = React.useState<number | 'all'>('all');
  const [showDeathIcons, setShowDeathIcons] = React.useState(true);

  const handleToggleVotingPhase = () => {
    if (!pendingNom) return;
    if (!isVoting) setIsVoting(true);
    else {
      setNominations([...nominations, { id: Math.random().toString(36).substr(2, 9), day: currentDay, f: pendingNom.f, t: pendingNom.t, voters: pendingNom.voters.join(','), note: '' }]);
      setPendingNom(null);
      setIsVoting(false);
    }
  };

  const dayOptions = ['ALL', ...Array.from({ length: currentDay }, (_, i) => `D${i + 1}`)];
  const modeLabels = { vote: 'Votes', beVoted: 'Received', allReceive: 'All Global' };

  return (
    <div className="bg-slate-50 rounded-lg border p-4 space-y-3 shadow-sm flex flex-col items-center">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Vote size={14} className="text-blue-600" />
          <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">{isVoting ? 'Recording' : 'Patterns'}</span>
        </div>
        <div className="flex items-center gap-2">
          {!isVoting && !pendingNom && (
            <div className="flex items-center gap-1 bg-white border rounded-full px-2 h-7 shadow-sm">
              <Calendar size={12} className="text-slate-400" />
              <div className="w-10">
                <TextRotaryPicker value={filterDay === 'all' ? 'ALL' : `D${filterDay}`} options={dayOptions} onChange={(val) => setFilterDay(val === 'ALL' ? 'all' : parseInt(val.replace('D', '')))} color="text-slate-800" />
              </div>
            </div>
          )}
          <button onClick={() => setShowDeathIcons(!showDeathIcons)} className={`p-1 rounded ${showDeathIcons ? 'text-red-500' : 'text-slate-400'}`}><Skull size={14} /></button>
          <button onClick={() => setVoteHistoryMode(voteHistoryMode === 'vote' ? 'beVoted' : voteHistoryMode === 'beVoted' ? 'allReceive' : 'vote')} className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-sm" disabled={isVoting}>{modeLabels[voteHistoryMode]}</button>
        </div>
      </div>
      <VoteHistoryClock 
        playerNo={playerNo} nominations={nominations} playerCount={playerCount} deadPlayers={deadPlayers} mode={voteHistoryMode} 
        players={players} deaths={deaths} filterDay={filterDay} onPlayerClick={setPlayerNo} pendingNom={pendingNom} isVoting={isVoting}
        onNominationSlideEnd={(f, t) => setPendingNom({ f, t, voters: [] })} onVoterToggle={(v, a) => isVoting && setPendingNom((p: any) => ({ ...p, voters: a === 'add' ? [...new Set([...p.voters, v])] : p.voters.filter((x: any) => x !== v) }))}
        onToggleVotingPhase={handleToggleVotingPhase} currentDay={currentDay} showDeathIcons={showDeathIcons}
      />
    </div>
  );
};

export default PlayerVotingSection;