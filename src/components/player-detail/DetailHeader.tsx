"use client";

import React from 'react';
import { Vote, Calendar, Skull, Grid3X3 } from 'lucide-react';
import TextRotaryPicker from '../pickers/RotaryPicker/TextRotaryPicker';

interface DetailHeaderProps {
  isVoting: boolean;
  filterDay: number | 'all';
  dayOptions: string[];
  currentFilterText: string;
  setFilterDay: (val: number | 'all') => void;
  showDeathIcons: boolean;
  setShowDeathIcons: (show: boolean) => void;
  showAxis: boolean;
  setShowAxis: (show: boolean) => void;
  voteHistoryMode: 'vote' | 'beVoted' | 'allReceive';
  setVoteHistoryMode: (mode: 'vote' | 'beVoted' | 'allReceive') => void;
}

const DetailHeader: React.FC<DetailHeaderProps> = ({
  isVoting, filterDay, dayOptions, currentFilterText, setFilterDay,
  showDeathIcons, setShowDeathIcons, showAxis, setShowAxis,
  voteHistoryMode, setVoteHistoryMode
}) => {
  const modeLabels = { vote: 'Votes', beVoted: 'Received', allReceive: 'All Global' };

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Vote size={14} className="text-[var(--accent-color)]" />
        <span className="text-[10px] font-black text-[var(--text-color)] opacity-80 uppercase tracking-wider">
          {isVoting ? 'Voting Recording' : 'Voting Patterns'}
        </span>
      </div>
      
      <div className="flex items-center gap-1.5">
        {!isVoting && (
          <div className="flex items-center gap-1 bg-[var(--panel-color)] border border-[var(--border-color)] rounded-full px-2 h-7 shadow-sm">
            <Calendar size={12} className="text-[var(--muted-color)]" />
            <div className="w-10">
              <TextRotaryPicker 
                value={currentFilterText} 
                options={dayOptions} 
                onChange={(val) => setFilterDay(val === 'ALL' ? 'all' : parseInt(val.replace('D', '')))}
                color="text-[var(--text-color)]"
              />
            </div>
          </div>
        )}
        
        <div className="flex bg-[var(--panel-color)] border border-[var(--border-color)] rounded-full p-0.5 shadow-sm">
          <button 
            onClick={() => setShowDeathIcons(!showDeathIcons)}
            className={`p-1 rounded-full transition-colors ${showDeathIcons ? 'bg-red-500/10 text-red-500' : 'text-[var(--muted-color)] hover:bg-slate-500/10'}`}
          >
            <Skull size={12} />
          </button>
          <button 
            onClick={() => setShowAxis(!showAxis)}
            className={`p-1 rounded-full transition-colors ${showAxis ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)]' : 'text-[var(--muted-color)] hover:bg-slate-500/10'}`}
          >
            <Grid3X3 size={12} />
          </button>
        </div>
        
        <button 
          onClick={() => {
            if (voteHistoryMode === 'vote') setVoteHistoryMode('beVoted');
            else if (voteHistoryMode === 'beVoted') setVoteHistoryMode('allReceive');
            else setVoteHistoryMode('vote');
          }}
          className="bg-[var(--panel-color)] hover:opacity-80 text-[var(--text-color)] border border-[var(--border-color)] px-3 py-1 rounded-full text-[9px] font-black uppercase transition-colors shadow-sm min-w-[80px]"
          disabled={isVoting}
        >
          {modeLabels[voteHistoryMode]}
        </button>
      </div>
    </div>
  );
};

export default DetailHeader;