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
  // Helper to apply counter-rotation to text
  const renderUprightText = (x: number, y: number, label: string, className = "") => (
    <text 
      x={x} y={y} 
      textAnchor="middle" 
      className={className}
      // Rotate backwards around its own (x, y) coordinates
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
      {/* Subtle background rings */}
      {Array.from({ length: ringCount + 1 }).map((_, i) => (
        <circle 
          key={`ring-${i}`} 
          cx={cx} cy={cy} 
          r={innerRadius + i * ringWidth} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.5" 
          className="text-slate-200/50"
        />
      ))}
      
      {/* Compass Axis */}
      <line x1={cx} y1={cy - outerRadius - 5} x2={cx} y2={cy + outerRadius + 5} stroke="currentColor" strokeWidth="0.5" className="text-slate-300/40" />
      {/* <line x1={cx - outerRadius - 5} y1={cy} x2={cx + outerRadius + 5} y2={cy} stroke="currentColor" strokeWidth="0.5" className="text-slate-300/40" /> */}
      
      {/* Elegant Compass Points */}
      {/* <g className="text-[7px] font-bold fill-slate-400 uppercase tracking-[0.2em]">
        <text x={cx} y={cy - outerRadius - 12} textAnchor="middle">North</text>
        <text x={cx} y={cy + outerRadius + 18} textAnchor="middle">South</text>
        <text x={cx + outerRadius + 22} y={cy + 3} textAnchor="middle">East</text>
        <text x={cx - outerRadius - 22} y={cy + 3} textAnchor="middle">West</text>
      </g> */}
      
      {/* Day Indicators */}
      {Array.from({ length: ringCount }).map((_, i) => {
        const radius = innerRadius + (i + 0.5) * ringWidth;
        const x = cx + 4;
        const y = cy - radius;
        return (
          <g key={`day-label-${i}`}>
            {renderUprightText(x, y, `D${i + 1}`, "text-[5px] font-black uppercase tracking-widest")}
          </g>
        );
      })}
    </g>
  );
};

export default ClockFace;