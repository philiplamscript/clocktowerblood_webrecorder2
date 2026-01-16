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
  swipeOffset?: number;
}

const ClockCenter: React.FC<ClockCenterProps> = ({
  isVoting, pendingNom, assignmentMode, selectedReason, playerNo, currentDay, mode, onStart, swipeOffset = 0
}) => {
  const getBaseColor = () => {
    if (isVoting) return '#e11d48'; // Keep critical game states high contrast
    if (pendingNom) return '#7c3aed'; 
    if (assignmentMode === 'death') return '#ef4444';
    if (assignmentMode === 'property') return '#3b82f6';
    return 'var(--header-color)'; // Use theme header color as the default ball base
  };

  const baseColor = getBaseColor();
  const horizontalShift = Math.max(-20, Math.min(20, swipeOffset * 0.4));
  
  return (
    <g 
      className="pointer-events-auto cursor-pointer group transition-transform duration-200 active:scale-95" 
      onMouseDown={onStart} 
      onTouchStart={onStart}
    >
      <defs>
        <radialGradient id="ballGradient" cx="35%" cy="35%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="black" stopOpacity="0.2" />
        </radialGradient>
        
        <clipPath id="centerClip">
          <circle cx={cx} cy={cy} r="28" />
        </clipPath>
      </defs>

      <circle 
        cx={cx} cy={cy} r="32" 
        fill="none" 
        stroke={baseColor} 
        strokeWidth="1" 
        className={`transition-all duration-500 ${isVoting || pendingNom ? 'opacity-40 animate-pulse' : 'opacity-10 group-hover:opacity-20'}`} 
      />
      
      <circle 
        cx={cx} cy={cy} r="28" 
        fill={baseColor} 
        className="transition-colors duration-500 shadow-2xl" 
      />
      
      <g clipPath="url(#centerClip)">
        <g style={{ transform: `translateX(${horizontalShift}px)`, transition: swipeOffset === 0 ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none' }}>
          {pendingNom ? (
            <text 
              x={cx} y={cy} 
              textAnchor="middle" 
              alignmentBaseline="middle" 
              className="text-white text-[11px] font-black tracking-widest pointer-events-none uppercase drop-shadow-md"
            >
              {isVoting ? 'SAVE' : 'VOTE'}
            </text>
          ) : (
            <g className="pointer-events-none">
              <text 
                x={cx} y={cy - 12} 
                textAnchor="middle" 
                className="fill-white/40 text-[6px] font-black uppercase tracking-[0.2em]"
              >
                Day
              </text>
              
              <g className="transition-transform duration-300">
                <text x={cx - 18} y={cy + 3} textAnchor="middle" className={`fill-white/20 text-[8px] ${swipeOffset > 10 ? 'opacity-0 scale-125' : 'opacity-100'}`}>◀</text>
                <text 
                  x={cx} y={cy + 4} 
                  textAnchor="middle" 
                  className="fill-white text-base font-black tracking-tighter drop-shadow-md"
                >
                  {currentDay}
                </text>
                <text x={cx + 18} y={cy + 3} textAnchor="middle" className={`fill-white/20 text-[8px] ${swipeOffset < -10 ? 'opacity-0 scale-125' : 'opacity-100'}`}>▶</text>
              </g>

              <rect x={cx - 12} y={cy + 13} width="24" height="8" rx="4" fill="black" fillOpacity="0.2" />
              <text x={cx} y={cy + 19} textAnchor="middle" className="fill-white/60 text-[6px] font-black uppercase tracking-[0.1em]">
                {mode === 'vote' ? 'VOTE' : mode === 'beVoted' ? 'RECV' : 'ALL'}
              </text>
            </g>
          )}
        </g>
      </g>
      
      <circle cx={cx} cy={cy} r="28" fill="url(#ballGradient)" className="pointer-events-none" />
    </g>
  );
};

export default ClockCenter;