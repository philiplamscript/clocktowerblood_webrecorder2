"use client";

import React from 'react';
import { getSlicePath, getPosition, innerRadius, outerRadius, sliceStartRadius, labelRadius } from './utils';
import { type IdentityMode } from '../../../type';

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
  identityMode?: IdentityMode;
}

const PlayerSlices: React.FC<PlayerSlicesProps> = ({
  playerCount, playerNo, isVoting, pendingNomVoters, deaths, players, ringCount, ringWidth, votedAtDay, mode, showDeathIcons, showProperties = true, assignmentMode, onStart, identityMode = 'number'
}) => {
  return (
    <>
      {Array.from({ length: playerCount }, (_, i) => i + 1).map((num, i) => {
        const numStr = num.toString();
        const isCurrent = num === playerNo;
        const isVoter = isVoting && pendingNomVoters.includes(numStr);
        const pd = deaths.find(d => d.playerNo === numStr);
        const pData = players.find(p => p.no === num);
        
        const fill = isVoter ? 'var(--accent-color)' : isCurrent ? 'var(--panel-color)' : 'var(--panel-color)';
        const stroke = isCurrent ? 'var(--accent-color)' : assignmentMode === 'death' ? '#ef4444' : assignmentMode === 'property' ? '#3b82f6' : 'var(--border-color)';

        const angleStep = 360 / playerCount;
        const centerAngle = ((num - 1) * angleStep) - 90 + (angleStep / 2);
        const cornerAngle = centerAngle + (angleStep / 3);
        const cornerPos = {
          x: 144 + (outerRadius - 12) * Math.cos(cornerAngle * Math.PI / 180),
          y: 144 + (outerRadius - 12) * Math.sin(cornerAngle * Math.PI / 180)
        };

        const properties = pData?.property ? pData.property.split('|').filter(Boolean) : [];
        const label = identityMode === 'name' && pData?.name ? pData.name : num;

        return (
          <g key={num} onMouseDown={(e) => onStart(num, e)} onTouchStart={(e) => onStart(num, e)} className="cursor-pointer group">
            {/* Main Interactive Slice - now starts from sliceStartRadius */}
            <path 
              d={getSlicePath(i, playerCount, sliceStartRadius, outerRadius)} 
              fill={fill} 
              stroke={stroke} 
              strokeWidth={isCurrent ? "2" : "0.75"} 
              className="transition-colors duration-200"
            />
            
            {/* Data Rings (Days/Votes) - starts from innerRadius */}
            {Array.from({ length: ringCount }).map((_, rIdx) => {
              const dayNum = rIdx + 1;
              const vCount = (votedAtDay[numStr] || {})[dayNum];
              const diedNow = pd && dayNum === pd.day;
              const diedLater = pd && dayNum > pd.day;
              const rs = innerRadius + rIdx * ringWidth;
              const re = rs + ringWidth;
              const pos = getPosition(num, playerCount, (rs + re) / 2);
              
              let ringFill = 'transparent';
              if (vCount !== undefined) {
                ringFill = `rgba(var(--accent-color-rgb), 0.7)`;
              } else if (diedNow) {
                ringFill = 'rgba(var(--bg-color-rgb), 0.5)';
              } else if (diedLater) {
                ringFill = 'rgba(var(--bg-color-rgb), 1)';
              }

              return (
                <g key={`${num}-${dayNum}`} className="pointer-events-none">
                  <path d={getSlicePath(i, playerCount, rs, re)} fill={ringFill} />
                  {showDeathIcons && diedNow && (
                    <text x={pos.x} y={pos.y} textAnchor="middle" alignmentBaseline="middle" className="text-[10px] opacity-100 fill-[var(--text-on-panel)] drop-shadow-sm">{pd.reason}</text>
                  )}
                  {vCount !== undefined && mode === 'allReceive' && !diedNow && (
                    <text 
                      x={getPosition(num, playerCount, rs + ringWidth * 0.3).x} 
                      y={getPosition(num, playerCount, rs + ringWidth * 0.3).y} 
                      textAnchor="middle" 
                      alignmentBaseline="middle" 
                      className="font-bold fill-[var(--text-on-panel)]" 
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
                    className="text-[8px] drop-shadow-sm font-bold fill-[var(--text-on-panel)]"
                  >
                    {prop}
                  </text>
                ))}
              </g>
            )}

            {/* Player ID/Name label positioned in the inner "Label Zone" */}
            <text 
              x={getPosition(num, playerCount, labelRadius).x} 
              y={getPosition(num, playerCount, labelRadius).y} 
              textAnchor="middle" 
              alignmentBaseline="middle" 
              className={`text-[9px] font-black tracking-tight pointer-events-none transition-all duration-200 ${isVoter ? 'fill-white' : isCurrent ? 'fill-[var(--accent-color)]' : pd ? 'fill-[var(--muted-color)]' : 'fill-[var(--text-on-panel)]'}`}
              style={identityMode === 'name' && label.toString().length > 4 ? { fontSize: '6.5px' } : {}}
            >
              {label}
            </text>
          </g>
        );
      })}
    </>
  );
};

export default PlayerSlices;