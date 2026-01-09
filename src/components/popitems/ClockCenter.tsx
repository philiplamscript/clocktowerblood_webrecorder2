"use client";

import React from 'react';

interface ClockCenterProps {
  cx: number;
  cy: number;
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
  cx, cy, isVoting, pendingNom, assignmentMode, selectedReason, playerNo, currentDay, mode, onStart
}) => {
  return (
    <g className="pointer-events-auto cursor-pointer" onMouseDown={onStart} onTouchStart={onStart}>
      <circle cx={cx} cy={cy} r="25" fill={isVoting ? '#dc2626' : pendingNom ? '#a855f7' : '#eab308'} className="transition-colors shadow-lg" />
      {pendingNom ? (
        <text x={cx} y={cy} textAnchor="middle" alignmentBaseline="middle" className="text-white text-[14px] font-black pointer-events-none">
          {isVoting ? 'SAVE' : 'V'}
        </text>
      ) : assignmentMode ? (
        <text x={cx} y={cy} textAnchor="middle" alignmentBaseline="middle" className="text-white text-[8px] font-black uppercase pointer-events-none">
          {assignmentMode === 'death' ? selectedReason : 'PROP'}
        </text>
      ) : (
        <g className="pointer-events-none">
          <text x={cx} y={cy - 8} textAnchor="middle" className="text-white text-[10px] font-black">{playerNo}</text>
          <text x={cx} y={cy + 4} textAnchor="middle" className="text-white text-[10px] font-black">D{currentDay}</text>
          <text x={cx} y={cy + 14} textAnchor="middle" className="text-white text-[5px] font-black uppercase">
            {mode === 'vote' ? 'VOTE' : mode === 'beVoted' ? 'RECV' : 'ALL'}
          </text>
        </g>
      )}
    </g>
  );
};

export default ClockCenter;