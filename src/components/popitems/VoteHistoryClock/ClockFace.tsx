"use client";

import React from 'react';
import { type ClockDayDirection } from '../../../type';
import { cx, cy, innerRadius, outerRadius, sliceStartRadius, innerRingIndexToDay, DEFAULT_CLOCK_DAY_DIRECTION } from './utils';

interface ClockFaceProps {
  ringCount: number;
  ringWidth: number;
  showAxis: boolean;
  clockDayDirection?: ClockDayDirection;
}

const ClockFace: React.FC<ClockFaceProps> = ({ ringCount, ringWidth, showAxis, clockDayDirection = DEFAULT_CLOCK_DAY_DIRECTION }) => {
  if (!showAxis) return null;

  return (
    <g className="pointer-events-none">
      {Array.from({ length: ringCount + 1 }).map((_, i) => (
        <circle 
          key={`ring-${i}`} 
          cx={cx} cy={cy} 
          r={innerRadius + i * ringWidth} 
          fill="none" 
          stroke="var(--border-color)" 
          strokeWidth="0.5" 
          className="opacity-50"
        />
      ))}

      <circle cx={cx} cy={cy} r={sliceStartRadius} fill="none" stroke="var(--border-color)" strokeWidth="0.5" className="opacity-20" />
      <circle cx={cx} cy={cy} r={innerRadius} fill="none" stroke="var(--border-color)" strokeWidth="0.5" className="opacity-30" />
      
      <line x1={cx} y1={cy - outerRadius - 5} x2={cx} y2={cy - sliceStartRadius} stroke="var(--muted-color)" strokeWidth="0.5" className="opacity-20" />
      <line x1={cx} y1={cy + sliceStartRadius} x2={cx} y2={cy + outerRadius + 5} stroke="var(--muted-color)" strokeWidth="0.5" className="opacity-20" />
      
      {Array.from({ length: ringCount }).map((_, i) => {
        const radius = innerRadius + (i + 0.5) * ringWidth;
        const x = cx + 4;
        const y = cy - radius;
        return (
          <text 
            key={`day-label-${i}`}
            x={x} y={y} 
            textAnchor="middle" 
            className="text-[5px] font-black uppercase tracking-widest fill-[var(--text-on-panel)] opacity-80"
          >
            {`D${innerRingIndexToDay(i, ringCount, clockDayDirection)}`}
          </text>
        );
      })}
    </g>
  );
};

export default ClockFace;
