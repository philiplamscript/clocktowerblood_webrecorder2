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
        <div className="p-1 bg-amber-900/30 rounded-full border border-amber-600/20 shadow-inner">
          <Vote size={12} className="text-amber-500" />
        </div>
        <span className="text-[10px] font-black text-amber-200/70 uppercase tracking-[0.2em] drop-shadow-sm">
          {isVoting ? 'Recording Phase' : 'Historical Ledger'}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        {!isVoting && (
          <div className="flex items-center gap-1.5 bg-[#2d1e16] border border-[#4d3a2b] rounded-full px-3 h-7 shadow-inner">
            <Calendar size={11} className="text-amber-700" />
            <div className="w-10">
              <TextRotaryPicker 
                value={currentFilterText} 
                options={dayOptions} 
                onChange={(val) => setFilterDay(val === 'ALL' ? 'all' : parseInt(val.replace('D', '')))}
                color="text-amber-200"
              />
            </div>
          </div>
        )}
        
        <div className="flex bg-[#2d1e16] border border-[#4d3a2b] rounded-full p-0.5 shadow-inner">
          <button 
            onClick={() => setShowDeathIcons(!showDeathIcons)}
            className={`p-1 rounded-full transition-all duration-300 ${showDeathIcons ? 'bg-red-900/40 text-red-400 shadow-sm' : 'text-amber-900 hover:text-amber-700'}`}
          >
            <Skull size={11} />
          </button>
          <button 
            onClick={() => setShowAxis(!showAxis)}
            className={`p-1 rounded-full transition-all duration-300 ${showAxis ? 'bg-amber-900/40 text-amber-400 shadow-sm' : 'text-amber-900 hover:text-amber-700'}`}
          >
            <Grid3X3 size={11} />
          </button>
        </div>
        
        <button 
          onClick={() => {
            if (voteHistoryMode === 'vote') setVoteHistoryMode('beVoted');
            else if (voteHistoryMode === 'beVoted') setVoteHistoryMode('allReceive');
            else setVoteHistoryMode('vote');
          }}
          className="bg-[#4d3a2b] hover:bg-[#5d4a3b] border border-[#6d5a4b] text-amber-200 px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all shadow-md active:scale-95 min-w-[85px] tracking-wider"
          disabled={isVoting}
        >
          {modeLabels[voteHistoryMode]}
        </button>
      </div>
    </div>
  );
};

export default DetailHeader;