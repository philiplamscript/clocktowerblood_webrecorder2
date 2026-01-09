"use client";

import React from 'react';
import { cx, cy, innerRadius, outerRadius } from './utils';

interface ClockFaceProps {
  ringCount: number;
  ringWidth: number;
  showAxis: boolean;
}

const ClockFace: React.FC<ClockFaceProps> = ({ ringCount, ringWidth, showAxis }) => {
  if (!showAxis) return null;

  return (
    <g className="pointer-events-none transition-opacity duration-300">
      {Array.from({ length: ringCount + 1 }).map((_, i) => (
        <circle 
          key={`ring-${i}`} 
          cx={cx} cy={cy} 
          r={innerRadius + i * ringWidth} 
          fill="none" 
          stroke="#cbd5e1" 
          strokeWidth="0.75" 
          strokeDasharray="2,2" 
          className="opacity-40"
        />
      ))}
      <line x1={cx} y1={cy - outerRadius} x2={cx} y2={cy + outerRadius} stroke="#94a3b8" strokeWidth="0.75" strokeDasharray="4,2" className="opacity-50" />
      <line x1={cx - outerRadius} y1={cy} x2={cx + outerRadius} y2={cy} stroke="#94a3b8" strokeWidth="0.75" strokeDasharray="4,2" className="opacity-50" />
      
      <text x={cx} y={cy - outerRadius - 8} textAnchor="middle" className="text-[8px] font-black fill-slate-500 uppercase">N</text>
      <text x={cx} y={cy + outerRadius + 12} textAnchor="middle" className="text-[8px] font-black fill-slate-500 uppercase">S</text>
      <text x={cx + outerRadius + 8} y={cy + 3} textAnchor="middle" className="text-[8px] font-black fill-slate-500 uppercase">E</text>
      <text x={cx - outerRadius - 8} y={cy + 3} textAnchor="middle" className="text-[8px] font-black fill-slate-500 uppercase">W</text>
      
      {Array.from({ length: ringCount }).map((_, i) => {
        const radius = innerRadius + (i + 0.5) * ringWidth;
        const positions = [
          { dir: 'east', x: cx + 5, y: cy - radius, textAnchor: 'start' },
          { dir: 'west', x: cx - 5, y: cy - radius, textAnchor: 'end' },
          { dir: 'north', x: cx, y: cy - radius - 5, textAnchor: 'middle' },
          { dir: 'south', x: cx, y: cy + radius + 5, textAnchor: 'middle' }
        ];
        return positions.map(pos => (
          <text key={`day-label-${i}-${pos.dir}`} x={pos.x} y={pos.y} textAnchor={pos.textAnchor} className="text-[6px] font-black fill-slate-400 uppercase tracking-tighter">
            D{i + 1}
          </text>
        ));
      })}
    </g>
  );
};

export default ClockFace;