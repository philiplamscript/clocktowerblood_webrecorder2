"use client";

import React from 'react';
import { Vote, Calendar, Skull, Grid3X3, ArrowRight, Tag, Flower2, Megaphone } from 'lucide-react';
import TextRotaryPicker from '../pickers/RotaryPicker/TextRotaryPicker';
import { type ReviewRole } from '../../type';

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
  showProperties: boolean;
  setShowProperties: (show: boolean) => void;
  voteHistoryMode: 'vote' | 'beVoted' | 'allReceive';
  setVoteHistoryMode: (mode: 'vote' | 'beVoted' | 'allReceive') => void;
  showArrows: boolean;
  setShowArrows: (show: boolean) => void;
  reviewRole: ReviewRole | null;
  setReviewRole: (role: ReviewRole | null) => void;
}

const DetailHeader: React.FC<DetailHeaderProps> = ({
  isVoting, filterDay, dayOptions, currentFilterText, setFilterDay,
  showDeathIcons, setShowDeathIcons, showAxis, setShowAxis,
  showProperties, setShowProperties,
  voteHistoryMode, setVoteHistoryMode, showArrows, setShowArrows,
  reviewRole, setReviewRole
}) => {
  const modes: { id: 'vote' | 'beVoted' | 'allReceive'; label: string }[] = [
    { id: 'vote', label: 'V' },
    { id: 'beVoted', label: 'R' },
    { id: 'allReceive', label: 'G' }
  ];

  const toggleReview = (role: ReviewRole) => {
    setReviewRole(reviewRole === role ? null : role);
  };

  return (
    <div className="w-full flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 shrink-0">
        <Vote size={14} className="text-[var(--accent-color)]" />
        <span className="text-[9px] font-black text-[var(--text-on-bg)] opacity-80 uppercase tracking-tighter">
          {isVoting ? 'Recording' : reviewRole ? (reviewRole === 'flowerGirl' ? 'Flower Girl' : 'Town Crier') : 'Patterns'}
        </span>
      </div>
      
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {!isVoting && (
          <div className="flex bg-[var(--panel-color)] border border-[var(--border-color)] rounded-full p-0.5 shadow-sm shrink-0">
            {modes.map(m => (
              <button
                key={m.id}
                onClick={() => setVoteHistoryMode(m.id)}
                className={`px-2 py-0.5 rounded-full text-[8px] font-black transition-all ${
                  voteHistoryMode === m.id 
                    ? 'bg-[var(--accent-color)] text-white shadow-sm' 
                    : 'text-[var(--muted-color)] hover:bg-slate-100'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}

        {!isVoting && (
          <div className="flex bg-[var(--panel-color)] border border-[var(--border-color)] rounded-full p-0.5 shadow-sm shrink-0">
            <button
              onClick={() => toggleReview('flowerGirl')}
              className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-black transition-all ${
                reviewRole === 'flowerGirl'
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'text-[var(--muted-color)] hover:bg-slate-100'
              }`}
              title="Flower Girl review (voters)"
            >
              <Flower2 size={9} /> FG
            </button>
            <button
              onClick={() => toggleReview('townCrier')}
              className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-black transition-all ${
                reviewRole === 'townCrier'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-[var(--muted-color)] hover:bg-slate-100'
              }`}
              title="Town Crier review (nominators)"
            >
              <Megaphone size={9} /> TC
            </button>
          </div>
        )}

        <div className="flex bg-[var(--panel-color)] border border-[var(--border-color)] rounded-full p-0.5 shadow-sm shrink-0">
          <button 
            onClick={() => setShowDeathIcons(!showDeathIcons)}
            className={`p-1 rounded-full transition-colors ${showDeathIcons ? 'bg-red-500/10 text-red-500' : 'text-[var(--muted-color)] hover:bg-slate-500/10'}`}
            title="Death Icons"
          >
            <Skull size={10} />
          </button>
          <button 
            onClick={() => setShowProperties(!showProperties)}
            className={`p-1 rounded-full transition-colors ${showProperties ? 'bg-blue-500/10 text-blue-500' : 'text-[var(--muted-color)] hover:bg-slate-500/10'}`}
            title="Properties Layer"
          >
            <Tag size={10} />
          </button>
          <button 
            onClick={() => setShowAxis(!showAxis)}
            className={`p-1 rounded-full transition-colors ${showAxis ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)]' : 'text-[var(--muted-color)] hover:bg-slate-500/10'}`}
            title="Grid Axis"
          >
            <Grid3X3 size={10} />
          </button>
          <button 
            onClick={() => setShowArrows(!showArrows)}
            className={`p-1 rounded-full transition-colors ${showArrows ? 'bg-blue-500/10 text-blue-500' : 'text-[var(--muted-color)] hover:bg-slate-500/10'}`}
            title="Vote Arrows"
          >
            <ArrowRight size={10} />
          </button>
        </div>

        {!isVoting && (
          <div className="flex items-center gap-1 bg-[var(--panel-color)] border border-[var(--border-color)] rounded-full px-1.5 h-6 shadow-sm shrink-0">
            <Calendar size={10} className="text-[var(--muted-color)]" />
            <div className="w-8">
              <TextRotaryPicker 
                value={currentFilterText} 
                options={dayOptions} 
                onChange={(val) => setFilterDay(val === 'ALL' ? 'all' : parseInt(val.replace('D', '')))}
                color="text-[var(--text-on-panel)]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailHeader;
