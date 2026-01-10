"use client";

import React from 'react';
import { cx, cy } from './utils';

interface ClockCenterProps {
  isVoting: boolean;
  pendingNom: any;
  assignmentMode: string | null;
  selectedReason?: string;
  playerNo: number;
  currentDay: number;
  mode: string;
  onStart: (e: React.MouseEvent | React.TouchEvent) => void;
}

const ClockCenter: React.FC<ClockCenterProps> = ({
  isVoting, pendingNom, assignmentMode, selectedReason, playerNo, currentDay, mode, onStart
}) => {
  const baseColor = isVoting ? '#e11d48' : pendingNom ? '#7c3aed' : '#cdd3e2ff';
  
  return (
    <g 
      className="pointer-events-auto cursor-pointer active: transition-transform duration-75" 
      onMouseDown={onStart} 
      onTouchStart={onStart}
    >
      {/* Outer Glow Ring */}
      <circle cx={cx} cy={cy} r="30" fill="none" stroke={baseColor} strokeWidth="1" className="opacity-10 animate-pulse" />
      
      {/* Main Button Body - added transition for color changes */}
      <circle cx={cx} cy={cy} r="26" fill={baseColor} className="transition-colors duration-300 shadow-xl" />
      
      {/* Inner Decorative Ring */}
      <circle cx={cx} cy={cy} r="22" fill="none" stroke="white" strokeWidth="0.5" className="opacity-20" />

      {pendingNom ? (
        <text x={cx} y={cy} textAnchor="middle" alignmentBaseline="middle" className="text-white text-[12px] font-black tracking-wider pointer-events-none uppercase">
          {isVoting ? 'SAVE' : 'VOTE'}
        </text>
      ) : assignmentMode ? (
        <text x={cx} y={cy} textAnchor="middle" alignmentBaseline="middle" className="text-white text-[8px] font-black uppercase tracking-tighter pointer-events-none">
          {assignmentMode === 'death' ? selectedReason : 'PROP'}
        </text>
      ) : (
        <g className="pointer-events-none">
          {/* Day Indicator with Swipe Context */}
          <text x={cx} y={cy - 11} textAnchor="middle" className="text-slate-500 text-[6px] font-black uppercase tracking-[0.2em]">Day</text>
          
          <g>
            <text x={cx - 18} y={cy + 2} textAnchor="middle" className="fill-white/30 text-[10px]">◀</text>
            <text x={cx} y={cy + 3} textAnchor="middle" className="text-white text-sm font-black tracking-tighter">
              {currentDay}
            </text>
            <text x={cx + 18} y={cy + 2} textAnchor="middle" className="fill-white/30 text-[10px]">▶</text>
          </g>

          {/* Current Display Mode Label */}
          <text x={cx} y={cy + 12} textAnchor="middle" className="text-white/40 text-[7px] font-black uppercase tracking-[0.2em]">
            {mode === 'vote' ? 'VOTE' : mode === 'beVoted' ? 'RECV' : 'ALL'}
          </text>
          
          {/* Action Hint */}
          <text x={cx} y={cy + 18} textAnchor="middle" className="text-white/10 text-[4px] font-black uppercase tracking-[0.3em]">Swipe to shift</text>
        </g>
      )}
    </g>
  );
};

export default ClockCenter;