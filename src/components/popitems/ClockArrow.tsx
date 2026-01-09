"use client";

import React from 'react';
import { getPosition } from '../../utils/clockMath';

interface ClockArrowProps {
  from: number;
  to: number;
  day: number;
  type: 'to' | 'from' | 'self';
  playerCount: number;
  innerRadius: number;
  ringWidth: number;
  width?: number;
}

const ClockArrow: React.FC<ClockArrowProps> = ({ 
  from, to, day, type, playerCount, innerRadius, ringWidth, width = 2 
}) => {
  const color = type === 'to' ? '#ef4444' : type === 'from' ? '#22c55e' : '#a855f7';
  const radius = innerRadius + (day - 0.5) * ringWidth;
  const cx = 144, cy = 144;

  if (type === 'self' || from === to) {
    const pos = getPosition(from, playerCount, radius);
    const rad = ((from - 1) * (360 / playerCount) - 90 + 180 / playerCount) * Math.PI / 180;
    const ix = cx + (radius - 15) * Math.cos(rad);
    const iy = cy + (radius - 15) * Math.sin(rad);
    
    return (
      <g opacity="0.6">
        <line x1={pos.x} y1={pos.y} x2={ix} y2={iy} stroke={color} strokeWidth={width} strokeLinecap="round" />
        <path d={`M ${pos.x + 10 * Math.cos(rad - 0.5)} ${pos.y + 10 * Math.sin(rad - 0.5)} A 10 10 0 1 1 ${pos.x + 10 * Math.cos(rad + 1.5)} ${pos.y + 10 * Math.sin(rad + 1.5)}`} fill="none" stroke={color} strokeWidth={width} />
        <polygon points={`${ix},${iy} ${ix+3},${iy+3} ${ix-3},${iy+3}`} fill={color} transform={`rotate(${rad * 180 / Math.PI + 90}, ${ix}, ${iy})`} />
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
  const hx = tp.x - 4 * Math.cos(angle);
  const hy = tp.y - 4 * Math.sin(angle);

  return (
    <g opacity="0.6">
      <line x1={fp.x} y1={fp.y} x2={hx} y2={hy} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <polygon points={`${hx},${hy} ${hx - 8 * Math.cos(angle - Math.PI / 6)},${hy - 8 * Math.sin(angle - Math.PI / 6)} ${hx - 8 * Math.cos(angle + Math.PI / 6)},${hy - 8 * Math.sin(angle + Math.PI / 6)}`} fill={color} />
    </g>
  );
};

export default ClockArrow;