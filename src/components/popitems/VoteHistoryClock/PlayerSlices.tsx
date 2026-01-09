"use client";

import React from 'react';
import { getSlicePath, getPosition, innerRadius, outerRadius } from './utils';

interface PlayerSlicesProps {
  playerCount: number;
  playerNo: number;
  isVoting: boolean;
  pendingNomVoters: string[];
  deaths: any[];
  ringCount: number;
  ringWidth: number;
  votedAtDay: Record<string, Record<number, number>>;
  mode: string;
  showDeathIcons: boolean;
  assignmentMode: string | null;
  onStart: (num: number, e: React.MouseEvent | React.TouchEvent) => void;
}

const PlayerSlices: React.FC<PlayerSlicesProps> = ({
  playerCount, playerNo, isVoting, pendingNomVoters, deaths, ringCount, ringWidth, votedAtDay, mode, showDeathIcons, assignmentMode, onStart
}) => {
  return (
    <>
      {Array.from({ length: playerCount }, (_, i) => i + 1).map((num, i) => {
        const numStr = num.toString(), isCurrent = num === playerNo, isVoter = isVoting && pendingNomVoters.includes(numStr);
        const pd = deaths.find(d => d.playerNo === numStr), fill = isVoter ? '#ef4444' : isCurrent ? 'url(#playerSpotlight)' : pd ? '#f8fafc' : '#ffffff';
        const stroke = isCurrent ? '#eab308' : assignmentMode === 'death' ? '#ef4444' : assignmentMode === 'property' ? '#3b82f6' : '#f1f5f9';

        return (
          <g key={num} onMouseDown={(e) => onStart(num, e)} onTouchStart={(e) => onStart(num, e)} className="cursor-pointer">
            <path d={getSlicePath(i, playerCount, innerRadius, outerRadius)} fill={fill} stroke={stroke} strokeWidth={isCurrent ? "2" : "0.5"} />
            {Array.from({ length: ringCount }).map((_, rIdx) => {
              const dayNum = rIdx + 1, vCount = (votedAtDay[numStr] || {})[dayNum];
              const diedNow = pd && dayNum === pd.day, diedLater = pd && dayNum > pd.day;
              const rs = innerRadius + rIdx * ringWidth, re = rs + ringWidth, pos = getPosition(num, playerCount, (rs + re) / 2);
              return (
                <g key={`${num}-${dayNum}`} className="pointer-events-none">
                  <path d={getSlicePath(i, playerCount, rs, re)} fill={vCount !== undefined ? (mode === 'vote' ? 'rgba(6, 182, 212, 0.7)' : mode === 'allReceive' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(37, 99, 235, 0.7)') : diedLater ? 'rgba(148, 163, 184, 0.2)' : 'transparent'} />
                  {showDeathIcons && diedNow && <text x={pos.x} y={pos.y} textAnchor="middle" alignmentBaseline="middle" className="text-[12px]">{pd.reason}</text>}
                  {vCount !== undefined && mode === 'allReceive' && !diedNow && <text x={pos.x} y={pos.y} textAnchor="middle" alignmentBaseline="middle" className="font-black fill-white" style={{ fontSize: `${Math.max(8, ringWidth * 0.15)}px` }}>{vCount}</text>}
                </g>
              );
            })}
            <text x={getPosition(num, playerCount, (innerRadius + outerRadius) / 2).x} y={getPosition(num, playerCount, (innerRadius + outerRadius) / 2).y} textAnchor="middle" alignmentBaseline="middle" className={`text-[11px] font-black pointer-events-none ${isVoter ? 'fill-white' : isCurrent ? 'fill-slate-900' : pd ? 'fill-slate-300' : 'fill-slate-400 opacity-40'}`}>{num}</text>
          </g>
        );
      })}
    </>
  );
};

export default PlayerSlices;