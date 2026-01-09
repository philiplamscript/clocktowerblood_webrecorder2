"use client";

import React from 'react';
import { getPosition, innerRadius, cx, cy } from './utils';
import { RefreshCw } from 'lucide-react';

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
  offset: number;
  showArrows?: boolean;
}

const VoteArrows: React.FC<VoteArrowsProps> = ({
  arrowData, playerCount, playerNo, isVoting, isSliding, gestureStart, gestureCurrent, pendingNom, currentDay, mode, ringWidth, offset, showArrows = true
}) => {
  if (!showArrows) return null;

  const drawArrow = (from: number, to: number, day: number, type: 'to' | 'from' | 'self', width = 1.5) => {
    const isSelected = from === playerNo || to === playerNo;
    const baseColor = type === 'to' ? '#f43f5e' : type === 'from' ? '#10b981' : '#8b5cf6';
    const color = isSelected ? (type === 'to' ? '#dc2626' : type === 'from' ? '#059669' : '#7c3aed') : baseColor;
    const strokeWidth = isSelected ? width * 2 : width;
    const radius = innerRadius + (day - 0.5) * ringWidth;
    
    if (type === 'self' || from === to) {
      const pos = getPosition(from, playerCount, radius, offset);
      return (
        <g key={`self-${from}-${day}`} opacity="0.7">
          <foreignObject x={pos.x - 8} y={pos.y - 8} width="16" height="16">
            <RefreshCw size={16} color={color} />
          </foreignObject>
        </g>
      );
    }
    
    const fp = getPosition(from, playerCount, radius, offset);
    const tp = getPosition(to, playerCount, radius, offset);
    const dx = tp.x - fp.x;
    const dy = tp.y - fp.y;
    const dist = Math.sqrt(dx * dx + dy * dy); 
    if (dist < 5) return null;
    
    const angle = Math.atan2(dy, dx);
    const hx = tp.x - 3 * Math.cos(angle);
    const hy = tp.y - 3 * Math.sin(angle);
    
    return (
      <g key={`${from}-${to}-${day}-${type}`} opacity="0.5" className="transition-opacity duration-300 hover:opacity-100">
        <line x1={fp.x} y1={fp.y} x2={hx} y2={hy} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <polygon points={`${hx},${hy} ${hx - 8 * Math.cos(angle - Math.PI / 8)},${hy - 8 * Math.sin(angle - Math.PI / 8)} ${hx - 8 * Math.cos(angle + Math.PI / 8)},${hy - 8 * Math.sin(angle + Math.PI / 8)}`} fill={color} />
      </g>
    );
  };

  const maxDay = arrowData.length > 0 ? Math.max(...arrowData.map(a => a.day)) : currentDay;

  return (
    <>
      {!isVoting && arrowData.map(a => drawArrow(a.from, a.to, a.day, a.type, mode === 'allReceive' ? 1.2 : 1.2))}
      {isSliding && gestureStart && gestureCurrent && drawArrow(gestureStart, gestureCurrent, maxDay, gestureStart === gestureCurrent ? 'self' : 'to', 1.8)}
      {pendingNom && !isSliding && drawArrow(parseInt(pendingNom.f), parseInt(pendingNom.t), currentDay, pendingNom.f === pendingNom.t ? 'self' : 'to', 1.8)}
    </>
  );
};

export default VoteArrows;