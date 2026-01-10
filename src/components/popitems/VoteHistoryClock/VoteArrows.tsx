"use client";

import React from 'react';
import { innerRadius, cx, cy } from './utils';
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
  arrowData, playerCount, playerNo, isVoting, isSliding, gestureStart, gestureCurrent, pendingNom, currentDay, mode, ringWidth, showArrows = true
}) => {
  if (!showArrows) return null;

  const getShiftedPosition = (num: number, radius: number, day: number) => {
    // Add a slight angle jitter based on the day to prevent perfect overlaps
    const jitter = ((day % 5) - 2) * 1.5; // -3 to 3 degrees
    const angle = ((num - 1) * (360 / playerCount)) - 90 + (360 / (playerCount * 2)) + jitter;
    return {
      x: cx + radius * Math.cos(angle * Math.PI / 180),
      y: cy + radius * Math.sin(angle * Math.PI / 180)
    };
  };

  const drawArrow = (from: number, to: number, day: number, type: 'to' | 'from' | 'self', width = 1.2, isPending = false) => {
    const isSelected = from === playerNo || to === playerNo;
    const isOld = day < currentDay;
    
    // Visual settings: older arrows are thinner and more transparent
    const baseColor = type === 'to' ? '#f43f5e' : type === 'from' ? '#10b981' : '#8b5cf6';
    const color = isSelected ? (type === 'to' ? '#dc2626' : type === 'from' ? '#059669' : '#7c3aed') : baseColor;
    const opacity = isPending ? 0.8 : (isSelected ? 0.7 : (isOld ? 0.2 : 0.4));
    const strokeWidth = isSelected ? width * 1.5 : width;
    
    const radius = innerRadius + (day - 0.5) * ringWidth;
    
    if (type === 'self' || from === to) {
      const pos = getShiftedPosition(from, radius, day);
      return (
        <g key={`self-${from}-${day}-${Math.random()}`} opacity={opacity} className="transition-all duration-300">
          <foreignObject x={pos.x - 6} y={pos.y - 6} width="12" height="12">
            <RefreshCw size={12} color={color} />
          </foreignObject>
        </g>
      );
    }
    
    const fp = getShiftedPosition(from, radius, day);
    const tp = getShiftedPosition(to, radius, day);
    
    // Calculate a control point for the Bezier curve
    // We pull the curve slightly towards the center of the clock to create space
    const midX = (fp.x + tp.x) / 2;
    const midY = (fp.y + tp.y) / 2;
    
    // Vector from center of clock to midpoint of the chord
    const dx = midX - cx;
    const dy = midY - cy;
    const distFromCenter = Math.sqrt(dx * dx + dy * dy);
    
    // Curviness factor: pull closer to center
    const curveFactor = 0.15;
    const cpX = midX - dx * curveFactor;
    const cpY = midY - dy * curveFactor;

    // Calculate arrowhead angle based on the end of the curve (tangent at tp)
    const angle = Math.atan2(tp.y - cpY, tp.x - cpX);
    const hx = tp.x - 2 * Math.cos(angle);
    const hy = tp.y - 2 * Math.sin(angle);
    
    const id = `${from}-${to}-${day}-${type}-${isPending ? 'pending' : 'history'}-${Math.random()}`;

    return (
      <g key={id} opacity={opacity} className="transition-opacity duration-300 hover:opacity-100">
        <path 
          d={`M ${fp.x} ${fp.y} Q ${cpX} ${cpY} ${hx} ${hy}`} 
          fill="none" 
          stroke={color} 
          strokeWidth={strokeWidth} 
          strokeLinecap="round" 
        />
        <polygon 
          points={`${tp.x},${tp.y} ${tp.x - 6 * Math.cos(angle - Math.PI / 8)},${tp.y - 6 * Math.sin(angle - Math.PI / 8)} ${tp.x - 6 * Math.cos(angle + Math.PI / 8)},${tp.y - 6 * Math.sin(angle + Math.PI / 8)}`} 
          fill={color} 
        />
      </g>
    );
  };

  return (
    <>
      {!isVoting && arrowData.map(a => drawArrow(a.from, a.to, a.day, a.type, mode === 'allReceive' ? 1 : 1.2))}
      {isSliding && gestureStart && gestureCurrent && drawArrow(gestureStart, gestureCurrent, currentDay, gestureStart === gestureCurrent ? 'self' : 'to', 1.5, true)}
      {pendingNom && !isSliding && drawArrow(parseInt(pendingNom.f), parseInt(pendingNom.t), currentDay, pendingNom.f === pendingNom.t ? 'self' : 'to', 1.5, true)}
    </>
  );
};

export default VoteArrows;