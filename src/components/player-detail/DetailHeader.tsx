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
        <Vote size={14} className="text-blue-600" />
        <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
          {isVoting ? 'Voting Recording' : 'Voting Patterns'}
        </span>
      </div>
      
      <div className="flex items-center gap-1.5">
        {!isVoting && (
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
        
        <div className="flex bg-white border rounded-full p-0.5 shadow-sm">
          <button 
            onClick={() => setShowDeathIcons(!showDeathIcons)}
            className={`p-1 rounded-full transition-colors ${showDeathIcons ? 'bg-red-50 text-red-600' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Skull size={12} />
          </button>
          <button 
            onClick={() => setShowAxis(!showAxis)}
            className={`p-1 rounded-full transition-colors ${showAxis ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50'}`}
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
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-full text-[9px] font-black uppercase transition-colors shadow-sm min-w-[80px]"
          disabled={isVoting}
        >
          {modeLabels[voteHistoryMode]}
        </button>
      </div>
    </div>
  );
};

export default DetailHeader;