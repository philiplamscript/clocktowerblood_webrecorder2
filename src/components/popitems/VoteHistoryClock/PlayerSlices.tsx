"use client";

import React from 'react';
import { getSlicePath, getPosition, innerRadius, outerRadius } from './utils';

interface PlayerSlicesProps {
  playerCount: number;
  playerNo: number;
  isVoting: boolean;
  pendingNomVoters: string[];
  deaths: any[];
  players: any[]; // Added players to access property data
  ringCount: number;
  ringWidth: number;
  votedAtDay: Record<string, Record<number, number>>;
  mode: string;
  showDeathIcons: boolean;
  showProperties?: boolean; // New layer toggle
  assignmentMode: string | null;
  onStart: (num: number, e: React.MouseEvent | React.TouchEvent) => void;
}

const PlayerSlices: React.FC<PlayerSlicesProps> = ({
  playerCount, playerNo, isVoting, pendingNomVoters, deaths, players, ringCount, ringWidth, votedAtDay, mode, showDeathIcons, showProperties = true, assignmentMode, onStart
}) => {
  return (
    <>
      {Array.from({ length: playerCount }, (_, i) => i + 1).map((num, i) => {
        const numStr = num.toString();
        const isCurrent = num === playerNo;
        const isVoter = isVoting && pendingNomVoters.includes(numStr);
        const pd = deaths.find(d => d.playerNo === numStr);
        const pData = players.find(p => p.no === num);
        
        // Sophisticated Color Logic
        const fill = isVoter ? '#f43f5e' : isCurrent ? 'url(#playerSpotlight)' : pd ? '#f1f5f9' : '#ffffff';
        const stroke = isCurrent ? '#f59e0b' : assignmentMode === 'death' ? '#ef4444' : assignmentMode === 'property' ? '#3b82f6' : '#e2e8f0';

        // Calculate a corner position for the property emblem
        // We use a radius near the outer edge and an angle slightly offset from the center
        const angleStep = 360 / playerCount;
        const centerAngle = ((num - 1) * angleStep) - 90 + (angleStep / 2);
        const cornerAngle = centerAngle + (angleStep / 3); // Shift toward the "top right" of the slice
        const cornerPos = {
          x: 144 + (outerRadius - 12) * Math.cos(cornerAngle * Math.PI / 180),
          y: 144 + (outerRadius - 12) * Math.sin(cornerAngle * Math.PI / 180)
        };

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
                    fill={vCount !== undefined ? (mode === 'vote' ? 'rgba(6, 182, 212, 0.4)' : mode === 'allReceive' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(59, 130, 246, 0.4)') : diedLater ? 'rgba(203, 213, 225, 0.3)' : 'transparent'} 
                  />
                  {showDeathIcons && diedNow && (
                    <text x={pos.x} y={pos.y} textAnchor="middle" alignmentBaseline="middle" className="text-[10px] grayscale opacity-60">{pd.reason}</text>
                  )}
                  {vCount !== undefined && mode === 'allReceive' && !diedNow && (
                    <text x={getPosition(num, playerCount, rs + ringWidth * 0.3).x} y={getPosition(num, playerCount, rs + ringWidth * 0.3).y} textAnchor="middle" alignmentBaseline="middle" className="font-bold fill-slate-700" style={{ fontSize: `${Math.max(7, ringWidth * 0.12)}px` }}>{vCount}</text>
                  )}
                </g>
              );
            })}
            
            {/* Property Emblems (Corner Layer) */}
            {showProperties && pData?.property && (
              <g className="pointer-events-none">
                <text 
                  x={cornerPos.x} 
                  y={cornerPos.y} 
                  textAnchor="middle" 
                  alignmentBaseline="middle" 
                  className="text-[8px] drop-shadow-sm"
                >
                  {pData.property.split('|')[0]}
                </text>
              </g>
            )}

            {/* Player Number with refined typography */}
            <text 
              x={getPosition(num, playerCount, (innerRadius + outerRadius) / 2).x} 
              y={getPosition(num, playerCount, (innerRadius + outerRadius) / 2).y} 
              textAnchor="middle" 
              alignmentBaseline="middle" 
              className={`text-[10px] font-black tracking-tight pointer-events-none transition-all duration-200 ${isVoter ? 'fill-white' : isCurrent ? 'fill-slate-900' : pd ? 'fill-slate-400' : 'fill-slate-500 opacity-60'}`}
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