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
  
  // The clock rotates so the selected player is at the top. 
  // We need to counter-rotate text so it stays upright.
  const rotationAngle = playerNo !== 0 ? ((playerNo - 1) / playerCount) * 360 : 0;

  return (
    <g 
      className="pointer-events-none" 
      transform={`rotate(${rotationAngle}, ${cx}, ${cy})`}
    >
      {/* Subtle background rings */}
      {Array.from({ length: ringCount + 1 }).map((_, i) => (
        <circle 
          key={`ring-${i}`} 
          cx={cx} cy={cy} 
          r={innerRadius + i * ringWidth} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.5" 
          className="text-slate-200/40"
        />
      ))}
      
      {/* Vertical Axis line */}
      <line 
        x1={cx} y1={cy - outerRadius - 10} 
        x2={cx} y2={cy + outerRadius + 10} 
        stroke="currentColor" 
        strokeWidth="0.5" 
        className="text-slate-300/30" 
      />
      
      {/* Day Indicators along the vertical axis */}
      {Array.from({ length: ringCount }).map((_, i) => {
        const radius = innerRadius + (i + 0.5) * ringWidth;
        const x = cx;
        const y = cy - radius;
        const dayLabel = `D${i + 1}`;
        
        return (
          <g 
            key={`day-label-${i}`}
            transform={`rotate(${-rotationAngle}, ${x}, ${y})`}
          >
            {/* Background Badge for the Day label */}
            <rect 
              x={x - 8} 
              y={y - 5} 
              width="16" 
              height="10" 
              rx="4" 
              className="fill-slate-100/80 stroke-slate-200/50"
              strokeWidth="0.5"
            />
            <text 
              x={x} 
              y={y + 0.5} 
              textAnchor="middle" 
              alignmentBaseline="middle"
              className="text-[6px] font-black fill-slate-500 uppercase tracking-tighter"
            >
              {dayLabel}
            </text>
          </g>
        );
      })}
    </g>
  );
};

export default ClockFace;