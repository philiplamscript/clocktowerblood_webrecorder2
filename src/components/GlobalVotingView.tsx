"use client";

import React, { useState } from 'react';
import { 
  Vote,
  Calendar,
  FileText
} from 'lucide-react';

import TextRotaryPicker from './pickers/RotaryPicker/TextRotaryPicker';
import VoteHistoryClock from './popitems/VoteHistoryClock';

interface GlobalVotingViewProps {
  nominations: any[];
  playerCount: number;
  deadPlayers: number[];
  players: any[];
  deaths: any[];
  currentDay: number;
  onPlayerClick: (num: number) => void;
}

const GlobalVotingView: React.FC<GlobalVotingViewProps> = ({
  nominations,
  playerCount,
  deadPlayers,
  players,
  deaths,
  currentDay,
  onPlayerClick
}) => {
  const [filterDay, setFilterDay] = useState<number | 'all'>('all');
  const dayOptions = ['ALL', ...Array.from({ length: currentDay }, (_, i) => `D${i + 1}`)];
  const currentFilterText = filterDay === 'all' ? 'ALL' : `D${filterDay}`;

  return (
    <div className="h-full bg-white overflow-hidden flex flex-col">
      <div className="flex-none bg-slate-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Vote size={14} className="text-blue-500" />
          <span className="text-white font-black text-xs uppercase tracking-wider">Global Voting & Notes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-full px-2 h-7 shadow-sm">
            <Calendar size={12} className="text-slate-400" />
            <div className="w-10">
              <TextRotaryPicker 
                value={currentFilterText} 
                options={dayOptions} 
                onChange={(val) => setFilterDay(val === 'ALL' ? 'all' : parseInt(val.replace('D', '')))}
                color="text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-slate-50 rounded-lg border p-4 shadow-sm flex flex-col items-center">
          <VoteHistoryClock 
            playerNo={-1} // Global mode, no specific player
            nominations={nominations} 
            playerCount={playerCount} 
            deadPlayers={deadPlayers} 
            mode="allReceive" 
            players={players}
            deaths={deaths}
            filterDay={filterDay}
            onPlayerClick={onPlayerClick}
            pendingNom={null}
            isVoting={false}
            onNominationSlideEnd={() => {}}
            onVoterToggle={() => {}}
            onToggleVotingPhase={() => {}}
            currentDay={currentDay}
          />
        </div>

        <div className="bg-slate-50 rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} className="text-slate-600" />
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Player Notes Overview</span>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {players.filter(p => p.inf).map(player => (
              <div key={player.no} className="bg-white border rounded p-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <button 
                    onClick={() => onPlayerClick(player.no)}
                    className="font-black text-sm text-blue-600 hover:text-blue-800"
                  >
                    Player {player.no}
                  </button>
                  {deadPlayers.includes(player.no) && (
                    <span className="text-[8px] font-black text-red-500 uppercase">DEAD</span>
                  )}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{player.inf}</p>
              </div>
            ))}
            {players.filter(p => p.inf).length === 0 && (
              <p className="text-slate-500 text-xs text-center">No player notes yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalVotingView;