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

const ClockFace: React.FC<ClockFaceProps> = ({playerCount,playerNo, ringCount, ringWidth, showAxis}) => {
  if (!showAxis) return null;
  const rotationAngle = playerNo !== 0 ? ((playerNo -1) / playerCount) * 360 +2: 0;
  
  const renderUprightText = (x: number, y: number, label: string, className = "") => (
    <text 
      x={x} y={y} 
      textAnchor="middle" 
      className={className}
      transform={`rotate(${-rotationAngle}, ${x}, ${y})`}
    >
      {label}
    </text>
  );

  return (
    <g 
      className="pointer-events-none" 
      transform={`rotate(${rotationAngle}, ${cx}, ${cy})`}
    >
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
      
      <line x1={cx} y1={cy - outerRadius - 5} x2={cx} y2={cy + outerRadius + 5} stroke="var(--muted-color)" strokeWidth="0.5" className="opacity-20" />
      
      {Array.from({ length: ringCount }).map((_, i) => {
        const radius = innerRadius + (i + 0.5) * ringWidth;
        const x = cx + 4;
        const y = cy - radius;
        return (
          <g key={`day-label-${i}`}>
            {renderUprightText(x, y, `D${i + 1}`, "text-[5px] font-black uppercase tracking-widest fill-[var(--text-on-bg)] opacity-80")}
          </g>
        );
      })}
    </g>
  );
};

export default ClockFace;