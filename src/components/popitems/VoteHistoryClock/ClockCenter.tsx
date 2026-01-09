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
          {/* <text x={cx} y={cy - 7} textAnchor="middle" className="text-white text-[11px] font-black tracking-tighter">{playerNo === -1 ? 'G' : `P${playerNo}`}</text> */}
          <text x={cx} y={cy-7} textAnchor="middle" className="text-slate-400 text-[8px] font-bold uppercase tracking-[0.2em]">👈D{currentDay}👉</text>
          <text x={cx} y={cy +7} textAnchor="middle" className="text-white/40 text-[8px] font-black uppercase tracking-[0.3em]">{mode === 'vote' ? 'VOTE' : mode === 'beVoted' ? 'RECV' : 'ALL'}</text>
        </g>
      )}
    </g>
  );
};

export default ClockCenter;