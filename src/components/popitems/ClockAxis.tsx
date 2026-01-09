"use client";

import React from 'react';

interface ClockAxisProps {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  ringCount: number;
  ringWidth: number;
}

const ClockAxis: React.FC<ClockAxisProps> = ({ cx, cy, innerRadius, outerRadius, ringCount, ringWidth }) => {
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
        return ['north', 'south', 'east', 'west'].map(dir => (
          <text 
            key={`day-label-${i}-${dir}`} 
            x={dir === 'east' ? cx + 5 : dir === 'west' ? cx - 5 : cx} 
            y={dir === 'north' || dir === 'south' ? cy + (dir === 'north' ? -radius - 5 : radius + 5) : cy - radius} 
            textAnchor={dir === 'east' ? 'start' : dir === 'west' ? 'end' : 'middle'} 
            className="text-[6px] font-black fill-slate-400 uppercase tracking-tighter"
          >
            D{i + 1}
          </text>
        ));
      })}
    </g>
  );
};

export default ClockAxis;