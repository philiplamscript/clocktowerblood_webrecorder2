"use client";

import React from 'react';
import { getSlicePath, getPosition, innerRadius, outerRadius } from './utils';

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
  playerCount, playerNo, isVoting, pendingNomVoters, deaths, players, ringCount, ringWidth, votedAtDay, mode, showDeathIcons, showProperties = true, assignmentMode, onStart
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
        const pData = players.find(p => p.no === num);
        
        // Use theme variables for core slice colors
        const fill = isVoter ? 'var(--accent-color)' : isCurrent ? 'var(--panel-color)' : pd ? 'var(--bg-color)' : 'var(--panel-color)';
        const stroke = isCurrent ? 'var(--accent-color)' : assignmentMode === 'death' ? '#ef4444' : assignmentMode === 'property' ? '#3b82f6' : 'var(--border-color)';

        const angleStep = 360 / playerCount;
        const centerAngle = ((num - 1) * angleStep) - 90 + (angleStep / 2);
        const cornerAngle = centerAngle + (angleStep / 3);
        const cornerPos = {
          x: 144 + (outerRadius - 12) * Math.cos(cornerAngle * Math.PI / 180),
          y: 144 + (outerRadius - 12) * Math.sin(cornerAngle * Math.PI / 180)
        };

        const properties = pData?.property ? pData.property.split('|').filter(Boolean) : [];

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
              const diedNow = pd && dayNum === pd.day;
              const diedLater = pd && dayNum > pd.day;
              const rs = innerRadius + rIdx * ringWidth;
              const re = rs + ringWidth;
              const pos = getPosition(num, playerCount, (rs + re) / 2);
              
              return (
                <g key={`${num}-${dayNum}`} className="pointer-events-none">
                  <path 
                    d={getSlicePath(i, playerCount, rs, re)} 
                    fill={vCount !== undefined ? (mode === 'vote' ? 'rgba(var(--accent-color-rgb, 6, 182, 212), 0.4)' : mode === 'allReceive' ? 'rgba(var(--accent-color-rgb, 168, 85, 247), 0.3)' : 'rgba(var(--accent-color-rgb, 59, 130, 246), 0.4)') : diedLater ? 'var(--muted-color)' : 'transparent'}
                    className={diedLater ? 'opacity-10' : ''}
                  />
                  {showDeathIcons && diedNow && (
                    <text x={pos.x} y={pos.y} textAnchor="middle" alignmentBaseline="middle" className="text-[10px] opacity-100 fill-[var(--text-color)]">{pd.reason}</text>
                  )}
                  {vCount !== undefined && mode === 'allReceive' && !diedNow && (
                    <text 
                      x={getPosition(num, playerCount, rs + ringWidth * 0.3).x} 
                      y={getPosition(num, playerCount, rs + ringWidth * 0.3).y} 
                      textAnchor="middle" 
                      alignmentBaseline="middle" 
                      className="font-bold fill-[var(--text-color)]" 
                      style={{ fontSize: `${Math.max(7, ringWidth * 0.12)}px` }}
                    >
                      {vCount}
                    </text>
                  )}
                </g>
              );
            })}
            
            {showProperties && properties.length > 0 && (
              <g className="pointer-events-none">
                {properties.map((prop, pIdx) => (
                  <text 
                    key={pIdx}
                    x={cornerPos.x} 
                    y={cornerPos.y + (pIdx * 8)} 
                    textAnchor="middle" 
                    alignmentBaseline="middle" 
                    className="text-[8px] drop-shadow-sm font-bold fill-[var(--text-color)]"
                  >
                    {prop}
                  </text>
                ))}
              </g>
            )}

            <text 
              x={getPosition(num, playerCount, (innerRadius + outerRadius) / 2).x} 
              y={getPosition(num, playerCount, (innerRadius + outerRadius) / 2).y} 
              textAnchor="middle" 
              alignmentBaseline="middle" 
              className={`text-[10px] font-black tracking-tight pointer-events-none transition-all duration-200 ${isVoter ? 'fill-white' : isCurrent ? 'fill-[var(--accent-color)]' : pd ? 'fill-[var(--muted-color)]' : 'fill-[var(--text-color)] opacity-60'}`}
            >
              {num}
            </text>
          </g>
        );
      })}
    </>
  );
};

export default PlayerSlices;