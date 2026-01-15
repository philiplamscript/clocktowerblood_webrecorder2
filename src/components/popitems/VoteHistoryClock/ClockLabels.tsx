"use client";

import React from 'react';
import { cx, cy, innerRadius, outerRadius, getPosition } from './utils';

interface ClockLabelsProps {
  playerCount: number;
  playerNo: number;
  ringCount: number;
  ringWidth: number;
  players: any[];
  deaths: any[];
  votedAtDay: Record<string, Record<number, number>>;
  mode: string;
  showDeathIcons: boolean;
  showProperties: boolean;
  showAxis: boolean;
  isVoting: boolean;
  pendingNomVoters: string[];
}

const ClockLabels: React.FC<ClockLabelsProps> = ({
  playerCount, playerNo, ringCount, ringWidth, players, deaths, votedAtDay, mode, showDeathIcons, showProperties, showAxis, isVoting, pendingNomVoters
}) => {
  const rotationAngle = playerNo !== 0 ? ((playerNo - 1) / playerCount) * 360 + 2 : 0;

  const renderUprightText = (x: number, y: number, label: string, className = "", style = {}) => (
    <text 
      x={x} y={y} 
      textAnchor="middle" 
      alignmentBaseline="middle"
      className={className}
      style={style}
      transform={`rotate(${-rotationAngle}, ${x}, ${y})`}
    >
      {label}
    </text>
  );

  return (
    <g className="pointer-events-none" transform={`rotate(${rotationAngle}, ${cx}, ${cy})`}>
      {/* Day Labels */}
      {showAxis && Array.from({ length: ringCount }).map((_, i) => {
        const radius = innerRadius + (i + 0.5) * ringWidth;
        return (
          <g key={`day-label-${i}`}>
            {renderUprightText(cx + 4, cy - radius, `D${i + 1}`, "text-[5px] font-black uppercase tracking-widest fill-[var(--muted-color)] opacity-60")}
          </g>
        );
      })}

      {/* Player Specific Labels */}
      {Array.from({ length: playerCount }, (_, i) => i + 1).map((num) => {
        const numStr = num.toString();
        const isCurrent = num === playerNo;
        const isVoter = isVoting && pendingNomVoters.includes(numStr);
        const pd = deaths.find(d => d.playerNo === numStr);
        const pData = players.find(p => p.no === num);
        
        const angleStep = 360 / playerCount;
        const centerAngle = ((num - 1) * angleStep) - 90 + (angleStep / 2);
        const cornerAngle = centerAngle + (angleStep / 3);
        const cornerPos = {
          x: 144 + (outerRadius - 12) * Math.cos(cornerAngle * Math.PI / 180),
          y: 144 + (outerRadius - 12) * Math.sin(cornerAngle * Math.PI / 180)
        };

        const properties = pData?.property ? pData.property.split('|').filter(Boolean) : [];

        return (
          <g key={`labels-${num}`}>
            {/* Player Numbers */}
            {renderUprightText(
              getPosition(num, playerCount, (innerRadius + outerRadius) / 2).x,
              getPosition(num, playerCount, (innerRadius + outerRadius) / 2).y,
              numStr,
              `text-[10px] font-black tracking-tight transition-all duration-200 ${isVoter ? 'fill-white' : isCurrent ? 'fill-[var(--accent-color)]' : pd ? 'fill-[var(--muted-color)]' : 'fill-[var(--text-color)] opacity-60'}`
            )}

            {/* Death Icons & Vote Counts */}
            {Array.from({ length: ringCount }).map((_, rIdx) => {
              const dayNum = rIdx + 1;
              const vCount = (votedAtDay[numStr] || {})[dayNum];
              const diedNow = pd && dayNum === pd.day;
              const rs = innerRadius + rIdx * ringWidth;
              const re = rs + ringWidth;
              const pos = getPosition(num, playerCount, (rs + re) / 2);

              return (
                <g key={`ring-labels-${num}-${dayNum}`}>
                  {showDeathIcons && diedNow && renderUprightText(pos.x, pos.y, pd.reason, "text-[10px] opacity-60 fill-[var(--text-color)]")}
                  {vCount !== undefined && mode === 'allReceive' && !diedNow && renderUprightText(
                    getPosition(num, playerCount, rs + ringWidth * 0.3).x,
                    getPosition(num, playerCount, rs + ringWidth * 0.3).y,
                    vCount.toString(),
                    "font-bold fill-[var(--text-color)]",
                    { fontSize: `${Math.max(7, ringWidth * 0.12)}px` }
                  )}
                </g>
              );
            })}

            {/* Properties */}
            {showProperties && properties.length > 0 && properties.map((prop, pIdx) => (
              <g key={`prop-${num}-${pIdx}`}>
                {renderUprightText(cornerPos.x, cornerPos.y + (pIdx * 8), prop, "text-[8px] drop-shadow-sm font-bold fill-[var(--text-color)]")}
              </g>
            ))}
          </g>
        );
      })}
    </g>
  );
};

export default ClockLabels;