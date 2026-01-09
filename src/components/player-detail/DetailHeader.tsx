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
    <div className="w-full flex items-center justify-between z-10">
      <div className="flex items-center gap-2">
        <Vote size={14} className="text-amber-500" />
        <span className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em] drop-shadow-sm">
          {isVoting ? 'Voting Recording' : 'Voting Patterns'}
        </span>
      </div>
      
      <div className="flex items-center gap-1.5">
        {!isVoting && (
          <div className="flex items-center gap-1 bg-[#1a1412] border border-[#4a3a32] rounded-full px-2 h-7 shadow-inner">
            <Calendar size={12} className="text-stone-500" />
            <div className="w-10">
              <TextRotaryPicker 
                value={currentFilterText} 
                options={dayOptions} 
                onChange={(val) => setFilterDay(val === 'ALL' ? 'all' : parseInt(val.replace('D', '')))}
                color="text-amber-400"
              />
            </div>
          </div>
        )}
        
        <div className="flex bg-[#1a1412] border border-[#4a3a32] rounded-full p-0.5 shadow-inner">
          <button 
            onClick={() => setShowDeathIcons(!showDeathIcons)}
            className={`p-1 rounded-full transition-all ${showDeathIcons ? 'bg-red-900/50 text-red-400 shadow-sm' : 'text-stone-600 hover:text-stone-400'}`}
          >
            <Skull size={12} />
          </button>
          <button 
            onClick={() => setShowAxis(!showAxis)}
            className={`p-1 rounded-full transition-all ${showAxis ? 'bg-amber-900/50 text-amber-500 shadow-sm' : 'text-stone-600 hover:text-stone-400'}`}
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
          className="bg-[#3d2f28] hover:bg-[#4a3a32] border border-[#5a4a40] text-amber-500 px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all shadow-md active:shadow-inner min-w-[80px]"
          disabled={isVoting}
        >
          {modeLabels[voteHistoryMode]}
        </button>
      </div>
    </div>
  );
};

export default DetailHeader;