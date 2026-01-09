"use client";

import React from 'react';
import { getSlicePath, getPosition } from '../../utils/clockMath';

interface ClockSliceProps {
  num: number;
  playerCount: number;
  isCurrent: boolean;
  isVoter: boolean;
  isDead: boolean;
  innerRadius: number;
  outerRadius: number;
  ringCount: number;
  ringWidth: number;
  votedAtDay: Record<number, number>;
  deathInfo?: { day: number; reason: string };
  showDeathIcons: boolean;
  mode: string;
  assignmentMode: string | null;
  onStart: (e: React.MouseEvent | React.TouchEvent) => void;
  showAxis?: boolean;
}

const ClockSlice: React.FC<ClockSliceProps> = ({
  num, playerCount, isCurrent, isVoter, isDead, innerRadius, outerRadius,
  ringCount, ringWidth, votedAtDay, deathInfo, showDeathIcons, mode,
  assignmentMode, onStart, showAxis = true
}) => {
  const i = num - 1;
  const fill = isVoter ? '#ef4444' : isCurrent ? 'url(#playerSpotlight)' : isDead ? '#f8fafc' : '#ffffff';
  const stroke = isCurrent ? '#eab308' : assignmentMode === 'death' ? '#ef4444' : assignmentMode === 'property' ? '#3b82f6' : '#f1f5f9';

  return (
    <g onMouseDown={onStart} onTouchStart={onStart} className="cursor-pointer">
      <path d={getSlicePath(i, playerCount, innerRadius, outerRadius)} fill={fill} stroke={stroke} strokeWidth={isCurrent ? "2" : "0.5"} />
      
      {Array.from({ length: ringCount }).map((_, rIdx) => {
        const dayNum = rIdx + 1;
        const vCount = votedAtDay[dayNum];
        const diedNow = deathInfo && dayNum === deathInfo.day;
        const diedLater = deathInfo && dayNum > deathInfo.day;
        const rs = innerRadius + rIdx * ringWidth;
        const re = rs + ringWidth;
        const pos = getPosition(num, playerCount, (rs + re) / 2);

        return (
          <g key={`${num}-${dayNum}`} className="pointer-events-none">
            <path d={getSlicePath(i, playerCount, rs, re)} fill={vCount !== undefined ? (mode === 'vote' ? 'rgba(6, 182, 212, 0.7)' : mode === 'allReceive' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(37, 99, 235, 0.7)') : diedLater ? 'rgba(148, 163, 184, 0.2)' : 'transparent'} />
            {showDeathIcons && diedNow && <text x={pos.x} y={pos.y} textAnchor="middle" alignmentBaseline="middle" className="text-[12px]">{deathInfo.reason}</text>}
            {vCount !== undefined && mode === 'allReceive' && !diedNow && <text x={pos.x} y={pos.y} textAnchor="middle" alignmentBaseline="middle" className="font-black fill-white" style={{ fontSize: `${Math.max(8, ringWidth * 0.15)}px` }}>{vCount}</text>}
          </g>
        );
      })}

      {/* Day labels on the left side of each slice for all players */}
      {showAxis && Array.from({ length: ringCount }).map((_, rIdx) => {
        const dayNum = rIdx + 1;
        const rs = innerRadius + rIdx * ringWidth;
        const re = rs + ringWidth;
        const radius = (rs + re) / 2;
        const angle = (i * (360 / playerCount)) - 90;
        const leftAngle = angle - (360 / (playerCount * 2)) * 0.8; // Position towards the left of the slice
        const lx = 144 + radius * Math.cos(leftAngle * Math.PI / 180);
        const ly = 144 + radius * Math.sin(leftAngle * Math.PI / 180);

        return (
          <text key={`day-label-${num}-${dayNum}`} x={lx} y={ly} textAnchor="middle" alignmentBaseline="middle" className="text-[5px] font-black fill-slate-600 pointer-events-none">
            D{dayNum}
          </text>
        );
      })}

      <text 
        x={getPosition(num, playerCount, (innerRadius + outerRadius) / 2).x} 
        y={getPosition(num, playerCount, (innerRadius + outerRadius) / 2).y} 
        textAnchor="middle" 
        alignmentBaseline="middle" 
        className={`text-[11px] font-black pointer-events-none ${isVoter ? 'fill-white' : isCurrent ? 'fill-slate-900' : isDead ? 'fill-slate-300' : 'fill-slate-400 opacity-40'}`}
      >
        {num}
      </text>
    </g>
  );
};

export default ClockSlice;