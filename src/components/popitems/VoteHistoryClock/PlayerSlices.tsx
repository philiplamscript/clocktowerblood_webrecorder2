"use client";

import React from 'react';
import { getSlicePath, innerRadius, outerRadius } from './utils';

interface PlayerSlicesProps {
  playerCount: number;
  playerNo: number;
  isVoting: boolean;
  pendingNomVoters: string[];
  deaths: any[];
  players: any[];
  ringCount: number;
  ringWidth: number;
  votedAtDay: Record<string, Record<number, number>>;
  mode: string;
  showDeathIcons: boolean;
  showProperties?: boolean;
  assignmentMode: string | null;
  onStart: (num: number, e: React.MouseEvent | React.TouchEvent) => void;
}

const PlayerSlices: React.FC<PlayerSlicesProps> = ({
  playerCount, playerNo, isVoting, pendingNomVoters, deaths, ringCount, ringWidth, votedAtDay, mode, assignmentMode, onStart
}) => {
  return (
    <>
      <defs>
        <radialGradient id="playerSpotlight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--panel-color)" stopOpacity="1" />
        </radialGradient>
      </defs>
      {Array.from({ length: playerCount }, (_, i) => i + 1).map((num, i) => {
        const numStr = num.toString();
        const isCurrent = num === playerNo;
        const isVoter = isVoting && pendingNomVoters.includes(numStr);
        const pd = deaths.find(d => d.playerNo === numStr);
        
        const fill = isVoter ? 'var(--accent-color)' : isCurrent ? 'var(--panel-color)' : pd ? 'var(--bg-color)' : 'var(--panel-color)';
        const stroke = isCurrent ? 'var(--accent-color)' : assignmentMode === 'death' ? '#ef4444' : assignmentMode === 'property' ? '#3b82f6' : 'var(--border-color)';

        return (
          <g key={num} onMouseDown={(e) => onStart(num, e)} onTouchStart={(e) => onStart(num, e)} className="cursor-pointer group">
            <path 
              d={getSlicePath(i, playerCount, innerRadius, outerRadius)} 
              fill={fill} 
              stroke={stroke} 
              strokeWidth={isCurrent ? "2" : "0.75"} 
              className="transition-colors duration-200"
            />
            
            {Array.from({ length: ringCount }).map((_, rIdx) => {
              const dayNum = rIdx + 1;
              const vCount = (votedAtDay[numStr] || {})[dayNum];
              const diedLater = pd && dayNum > pd.day;
              const rs = innerRadius + rIdx * ringWidth;
              const re = rs + ringWidth;
              
              return (
                <path 
                  key={`${num}-${dayNum}`}
                  d={getSlicePath(i, playerCount, rs, re)} 
                  fill={vCount !== undefined ? (mode === 'vote' ? 'rgba(var(--accent-color-rgb, 6, 182, 212), 0.4)' : mode === 'allReceive' ? 'rgba(var(--accent-color-rgb, 168, 85, 247), 0.3)' : 'rgba(var(--accent-color-rgb, 59, 130, 246), 0.4)') : diedLater ? 'var(--muted-color)' : 'transparent'}
                  className={`pointer-events-none ${diedLater ? 'opacity-10' : ''}`}
                />
              );
            })}
          </g>
        );
      })}
    </>
  );
};

export default PlayerSlices;