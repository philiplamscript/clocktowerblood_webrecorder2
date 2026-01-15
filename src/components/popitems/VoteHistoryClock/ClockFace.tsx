"use client";

import React from 'react';
import { cx, cy, innerRadius, outerRadius } from './utils';

interface ClockFaceProps {
  playerCount: number;
  playerNo: number;
  ringCount: number;
  ringWidth: number;
  showAxis: boolean;
}

const ClockFace: React.FC<ClockFaceProps> = ({playerCount, playerNo, ringCount, ringWidth, showAxis}) => {
  if (!showAxis) return null;
  const rotationAngle = playerNo !== 0 ? ((playerNo -1) / playerCount) * 360 + 2 : 0;
  
  return (
    <g 
      className="pointer-events-none" 
      transform={`rotate(${rotationAngle}, ${cx}, ${cy})`}
    >
      {/* Subtle background rings using theme border color */}
      {Array.from({ length: ringCount + 1 }).map((_, i) => (
        <circle 
          key={`ring-${i}`} 
          cx={cx} cy={cy} 
          r={innerRadius + i * ringWidth} 
          fill="none" 
          stroke="var(--border-color)" 
          strokeWidth="0.5" 
          className="opacity-40"
        />
      ))}
      
      {/* Compass Axis using theme muted color */}
      <line x1={cx} y1={cy - outerRadius - 5} x2={cx} y2={cy + outerRadius + 5} stroke="var(--muted-color)" strokeWidth="0.5" className="opacity-20" />
    </g>
  );
};

export default ClockFace;