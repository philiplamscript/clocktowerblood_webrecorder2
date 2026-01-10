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
  // Determine the core theme color based on state
  const getBaseColor = () => {
    if (isVoting) return '#e11d48'; // Rose 600
    if (pendingNom) return '#7c3aed'; // Violet 600
    if (assignmentMode === 'death') return '#ef4444'; // Red 500
    if (assignmentMode === 'property') return '#3b82f6'; // Blue 500
    return '#1e293b'; // Slate 800 (Deep blue-gray)
  };

  const baseColor = getBaseColor();
  
  return (
    <g 
      className="pointer-events-auto cursor-pointer group transition-transform duration-200 active:scale-95" 
      onMouseDown={onStart} 
      onTouchStart={onStart}
    >
      <defs>
        {/* Sphere Gradient for the Ball Look */}
        <radialGradient id="ballGradient" cx="35%" cy="35%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="black" stopOpacity="0.2" />
        </radialGradient>
        
        {/* Glow effect based on state */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Halo / Pulse */}
      <circle 
        cx={cx} cy={cy} r="32" 
        fill="none" 
        stroke={baseColor} 
        strokeWidth="1" 
        className={`transition-all duration-500 ${isVoting || pendingNom ? 'opacity-40 animate-pulse' : 'opacity-10 group-hover:opacity-20'}`} 
      />
      
      {/* Main Sphere Body */}
      <circle 
        cx={cx} cy={cy} r="28" 
        fill={baseColor} 
        className="transition-colors duration-500 shadow-2xl" 
      />
      
      {/* Glossy Overlay for "Ball" Effect */}
      <circle 
        cx={cx} cy={cy} r="28" 
        fill="url(#ballGradient)" 
        className="pointer-events-none"
      />
      
      {/* Subtle Inner Rim */}
      <circle 
        cx={cx} cy={cy} r="24" 
        fill="none" 
        stroke="white" 
        strokeWidth="0.5" 
        className="opacity-10 pointer-events-none" 
      />

      {pendingNom ? (
        <text 
          x={cx} y={cy} 
          textAnchor="middle" 
          alignmentBaseline="middle" 
          className="text-white text-[11px] font-black tracking-widest pointer-events-none uppercase drop-shadow-md"
        >
          {isVoting ? 'SAVE' : 'VOTE'}
        </text>
      ) : assignmentMode ? (
        <text 
          x={cx} y={cy} 
          textAnchor="middle" 
          alignmentBaseline="middle" 
          className="text-white text-[12px] font-black uppercase tracking-tighter pointer-events-none drop-shadow-sm"
        >
          {assignmentMode === 'death' ? selectedReason : 'PROP'}
        </text>
      ) : (
        <g className="pointer-events-none transition-opacity duration-300">
          {/* Day Indicator Area */}
          <text 
            x={cx} y={cy - 12} 
            textAnchor="middle" 
            className="fill-white/40 text-[6px] font-black uppercase tracking-[0.2em]"
          >
            Day
          </text>
          
          <g className="transition-transform duration-300 group-active:scale-110">
            {/* Navigation Cues */}
            <text x={cx - 18} y={cy + 3} textAnchor="middle" className="fill-white/20 text-[8px] animate-bounce-x">◀</text>
            
            <text 
              x={cx} y={cy + 4} 
              textAnchor="middle" 
              className="fill-white text-base font-black tracking-tighter drop-shadow-md"
            >
              {currentDay}
            </text>
            
            <text x={cx + 18} y={cy + 3} textAnchor="middle" className="fill-white/20 text-[8px] animate-bounce-x-reverse">▶</text>
          </g>

          {/* Mode Badge at bottom of ball */}
          <rect 
            x={cx - 12} y={cy + 13} 
            width="24" height="8" 
            rx="4" 
            fill="black" 
            fillOpacity="0.2" 
          />
          <text 
            x={cx} y={cy + 19} 
            textAnchor="middle" 
            className="fill-white/60 text-[6px] font-black uppercase tracking-[0.1em]"
          >
            {mode === 'vote' ? 'VOTE' : mode === 'beVoted' ? 'RECV' : 'ALL'}
          </text>
        </g>
      )}
    </g>
  );
};

export default ClockCenter;