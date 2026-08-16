"use client";

import React from 'react';
import { cx, cy } from './utils';
import { type ReviewRole, type DetectStatus, normalizeDetectStatus, formatDetectStatus } from '../../../type';

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
  reviewRole?: ReviewRole | null;
  reviewStatus?: DetectStatus;
  nextDayArmed?: boolean;
}

const ClockCenter: React.FC<ClockCenterProps> = ({
  isVoting, pendingNom, assignmentMode, selectedReason, playerNo, currentDay, mode, onStart, swipeOffset = 0,
  reviewRole = null, reviewStatus = 'DET', nextDayArmed = false
}) => {
  const status = normalizeDetectStatus(reviewStatus);

  const getBaseColor = () => {
    if (isVoting) return '#e11d48';
    if (pendingNom) return '#7c3aed';
    if (nextDayArmed) return '#f59e0b';
    if (reviewRole) {
      if (status === 'DET') return reviewRole === 'flowerGirl' ? '#ec4899' : '#f59e0b';
      if (status === 'NO') return reviewRole === 'flowerGirl' ? '#9d174d' : '#92400e';
      return '#64748b';
    }
    if (assignmentMode === 'death') return '#ef4444';
    if (assignmentMode === 'property') return '#3b82f6';
    return 'var(--header-color)';
  };

  const baseColor = getBaseColor();

  const statusLabel = () => {
    if (pendingNom) return isVoting ? 'SAVE' : 'VOTE';
    if (nextDayArmed) return 'OK?';
    if (reviewRole) return formatDetectStatus(reviewStatus);
    if (assignmentMode === 'death') return 'DEAD';
    return mode === 'vote' ? 'VOTE' : mode === 'beVoted' ? 'RECV' : 'ALL';
  };

  const roleTag = reviewRole === 'flowerGirl' ? 'FG' : reviewRole === 'townCrier' ? 'TC' : null;
  
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
        className={`transition-all duration-500 ${isVoting || pendingNom || reviewRole || nextDayArmed || assignmentMode === 'death' ? 'opacity-40 animate-pulse' : 'opacity-10 group-hover:opacity-20'}`} 
      />
      
      <circle 
        cx={cx} cy={cy} r="28" 
        fill={baseColor} 
        className="transition-colors duration-500 shadow-2xl" 
      />
      
      <g clipPath="url(#centerClip)">
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
              {roleTag ?? 'Day'}
            </text>
            
            <text 
              x={cx} y={cy + 4} 
              textAnchor="middle" 
              className="fill-white text-base font-black tracking-tighter drop-shadow-md"
            >
              {currentDay}
            </text>

            <rect x={cx - 14} y={cy + 13} width="28" height="8" rx="4" fill="black" fillOpacity="0.2" />
            <text x={cx} y={cy + 19} textAnchor="middle" className="fill-white/60 text-[6px] font-black uppercase tracking-[0.1em]">
              {statusLabel()}
            </text>
          </g>
        )}
      </g>
      
      <circle cx={cx} cy={cy} r="28" fill="url(#ballGradient)" className="pointer-events-none" />
    </g>
  );
};

export default ClockCenter;
