"use client";

import React from 'react';
import { getPosition, innerRadius, cx, cy } from './utils';

interface VoteArrowsProps {
  arrowData: any[];
  playerCount: number;
  playerNo: number;
  isVoting: boolean;
  isSliding: boolean;
  gestureStart: number | null;
  gestureCurrent: number | null;
  pendingNom: any;
  currentDay: number;
  mode: string;
  ringWidth: number;
}

const VoteArrows: React.FC<VoteArrowsProps> = ({
  arrowData, playerCount, playerNo, isVoting, isSliding, gestureStart, gestureCurrent, pendingNom, currentDay, mode, ringWidth
}) => {
  const drawArrow = (from: number, to: number, day: number, type: 'to' | 'from' | 'self', width = 1.5) => {
    const color = type === 'to' ? '#f43f5e' : type === 'from' ? '#10b981' : '#8b5cf6';
    const radius = innerRadius + (day - 0.5) * ringWidth;
    
    if (type === 'self' || from === to) {
      const pos = getPosition(from, playerCount, radius);
      const rad = ((from - 1) * (360 / playerCount) - 90 + 180 / playerCount) * Math.PI / 180;
      const ix = cx + (radius - 12) * Math.cos(rad);
      const iy = cy + (radius - 12) * Math.sin(rad);
      return (
        <g key={`self-${from}-${day}`} opacity="0.5">
          <line x1={pos.x} y1={pos.y} x2={ix} y2={iy} stroke={color} strokeWidth={width} strokeLinecap="round" />
          <path d={`M ${pos.x + 8 * Math.cos(rad - 0.5)} ${pos.y + 8 * Math.sin(rad - 0.5)} A 8 8 0 1 1 ${pos.x + 8 * Math.cos(rad + 1.5)} ${pos.y + 8 * Math.sin(rad + 1.5)}`} fill="none" stroke={color} strokeWidth={width} />
          <polygon points={`${ix},${iy} ${ix+2.5},${iy+2.5} ${ix-2.5},${iy+2.5}`} fill={color} transform={`rotate(${rad * 180 / Math.PI + 90}, ${ix}, ${iy})`} />
        </g>
      );
    }
    
    const fp = getPosition(from, playerCount, radius);
    const tp = getPosition(to, playerCount, radius);
    const dx = tp.x - fp.x;
    const dy = tp.y - fp.y;
    const dist = Math.sqrt(dx * dx + dy * dy); 
    if (dist < 5) return null;
    
    const angle = Math.atan2(dy, dx);
    const hx = tp.x - 3 * Math.cos(angle);
    const hy = tp.y - 3 * Math.sin(angle);
    
    return (
      <g key={`${from}-${to}-${day}-${type}`} opacity="0.5" className="transition-opacity duration-300 hover:opacity-100">
        <line x1={fp.x} y1={fp.y} x2={hx} y2={hy} stroke={color} strokeWidth={width} strokeLinecap="round" />
        <polygon points={`${hx},${hy} ${hx - 6 * Math.cos(angle - Math.PI / 8)},${hy - 6 * Math.sin(angle - Math.PI / 8)} ${hx - 6 * Math.cos(angle + Math.PI / 8)},${hy - 6 * Math.sin(angle + Math.PI / 8)}`} fill={color} />
      </g>
    );
  };

  const maxDay = arrowData.length > 0 ? Math.max(...arrowData.map(a => a.day)) : currentDay;

  return (
    <>
      {!isVoting && arrowData.map(a => drawArrow(a.from, a.to, a.day, a.type, mode === 'allReceive' ? 1.2 : 1.8))}
      {isSliding && gestureStart && gestureCurrent && drawArrow(gestureStart, gestureCurrent, maxDay, gestureStart === gestureCurrent ? 'self' : 'to', 2.5)}
      {pendingNom && !isSliding && drawArrow(parseInt(pendingNom.f), parseInt(pendingNom.t), currentDay, pendingNom.f === pendingNom.t ? 'self' : 'to', 3)}
    </>
  );
};

export default VoteArrows;