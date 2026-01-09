"use client";

import React from 'react';
import { getPosition, innerRadius, ringWidth, cx, cy } from './utils';

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
}

const VoteArrows: React.FC<VoteArrowsProps> = ({
  arrowData, playerCount, playerNo, isVoting, isSliding, gestureStart, gestureCurrent, pendingNom, currentDay, mode
}) => {
  const drawArrow = (from: number, to: number, day: number, type: 'to' | 'from' | 'self', width = 2) => {
    const color = type === 'to' ? '#ef4444' : type === 'from' ? '#22c55e' : '#a855f7';
    const radius = innerRadius + (day - 0.5) * ringWidth;
    if (type === 'self' || from === to) {
      const pos = getPosition(from, playerCount, radius), rad = ((from - 1) * (360 / playerCount) - 90 + 180 / playerCount) * Math.PI / 180;
      const ix = cx + (radius - 15) * Math.cos(rad), iy = cy + (radius - 15) * Math.sin(rad);
      return (
        <g key={`self-${from}-${day}`} opacity="0.6">
          <line x1={pos.x} y1={pos.y} x2={ix} y2={iy} stroke={color} strokeWidth={width} strokeLinecap="round" />
          <path d={`M ${pos.x + 10 * Math.cos(rad - 0.5)} ${pos.y + 10 * Math.sin(rad - 0.5)} A 10 10 0 1 1 ${pos.x + 10 * Math.cos(rad + 1.5)} ${pos.y + 10 * Math.sin(rad + 1.5)}`} fill="none" stroke={color} strokeWidth={width} />
          <polygon points={`${ix},${iy} ${ix+3},${iy+3} ${ix-3},${iy+3}`} fill={color} transform={`rotate(${rad * 180 / Math.PI + 90}, ${ix}, ${iy})`} />
        </g>
      );
    }
    const fp = getPosition(from, playerCount, radius), tp = getPosition(to, playerCount, radius), dx = tp.x - fp.x, dy = tp.y - fp.y;
    const dist = Math.sqrt(dx * dx + dy * dy); if (dist < 5) return null;
    const angle = Math.atan2(dy, dx), hx = tp.x - 4 * Math.cos(angle), hy = tp.y - 4 * Math.sin(angle);
    return (
      <g key={`${from}-${to}-${day}-${type}`} opacity="0.6">
        <line x1={fp.x} y1={fp.y} x2={hx} y2={hy} stroke={color} strokeWidth={width} strokeLinecap="round" />
        <polygon points={`${hx},${hy} ${hx - 8 * Math.cos(angle - Math.PI / 6)},${hy - 8 * Math.sin(angle - Math.PI / 6)} ${hx - 8 * Math.cos(angle + Math.PI / 6)},${hy - 8 * Math.sin(angle + Math.PI / 6)}`} fill={color} />
      </g>
    );
  };

  const maxDay = arrowData.length > 0 ? Math.max(...arrowData.map(a => a.day)) : currentDay;

  return (
    <>
      {!isVoting && arrowData.map(a => drawArrow(a.from, a.to, a.day, a.type, mode === 'allReceive' ? 1.5 : 2.5))}
      {isSliding && gestureStart && gestureCurrent && drawArrow(gestureStart, gestureCurrent, maxDay, gestureStart === gestureCurrent ? 'self' : 'to', 3)}
      {pendingNom && !isSliding && drawArrow(parseInt(pendingNom.f), parseInt(pendingNom.t), currentDay, pendingNom.f === pendingNom.t ? 'self' : 'to', 4)}
    </>
  );
};

export default VoteArrows;