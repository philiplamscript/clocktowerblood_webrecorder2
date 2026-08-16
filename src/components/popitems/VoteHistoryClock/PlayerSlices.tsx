"use client";

import React from 'react';
import { getSlicePath, getPosition, innerRadius, outerRadius, sliceStartRadius, labelRadius } from './utils';
import { type IdentityMode, type ReviewRole, type RoleDetectMap, type DetectStatus, normalizeDetectStatus, formatDetectStatus } from '../../../type';

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
  reviewRole?: ReviewRole | null;
  reviewAtDay?: Record<string, Record<number, boolean>>;
  reviewDetectMap?: RoleDetectMap;
}

const roleRgb = (role: ReviewRole | null) =>
  role === 'flowerGirl' ? '236, 72, 153' : '245, 158, 11';

const reviewRingFill = (status: DetectStatus, isTarget: boolean, role: ReviewRole | null) => {
  const base = roleRgb(role);
  if (status === 'DET') return isTarget ? `rgba(${base}, 0.82)` : `rgba(${base}, 0.18)`;
  if (status === 'NO') return isTarget ? `rgba(${base}, 0.18)` : `rgba(${base}, 0.82)`;
  // UNK — ambiguous (drunk/poisoned): mid target, deeper rest in muted tone
  if (isTarget) return 'rgba(148, 163, 184, 0.55)';
  return 'rgba(100, 116, 139, 0.72)';
};

const PlayerSlices: React.FC<PlayerSlicesProps> = ({
  playerCount, playerNo, isVoting, pendingNomVoters, deaths, players, ringCount, ringWidth, votedAtDay, mode, showDeathIcons, showProperties = true, assignmentMode, onStart, identityMode = 'number',
  reviewRole = null, reviewAtDay = {}, reviewDetectMap = {}
}) => {
  const daysWithTargets = new Set<number>();
  if (reviewRole) {
    Object.values(reviewAtDay).forEach(days => {
      Object.keys(days || {}).forEach(d => daysWithTargets.add(Number(d)));
    });
  }

  return (
    <>
      {Array.from({ length: playerCount }, (_, i) => i + 1).map((num, i) => {
        const numStr = num.toString();
        const isCurrent = num === playerNo;
        const isVoter = isVoting && pendingNomVoters.includes(numStr);
        const hasReviewMarks = !!reviewRole && Object.keys(reviewAtDay[numStr] || {}).length > 0;
        const pd = deaths.find(d => d.playerNo === numStr);
        const pData = players.find(p => p.no === num);
        
        const stroke = hasReviewMarks
          ? (reviewRole === 'flowerGirl' ? '#ec4899' : '#f59e0b')
          : isCurrent ? 'var(--accent-color)' : assignmentMode === 'death' ? '#ef4444' : assignmentMode === 'property' ? '#3b82f6' : 'var(--border-color)';

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
            <path 
              d={getSlicePath(i, playerCount, innerRadius, outerRadius)} 
              fill='rgba(var(--bg-color-rgb), 0.85)'
              stroke={stroke} 
              strokeWidth={hasReviewMarks || isCurrent ? "3" : "0.75"} 
              className="transition-colors duration-200"
            />
            
            {Array.from({ length: ringCount }).map((_, rIdx) => {
              const dayNum = rIdx + 1;
              const vCount = (votedAtDay[numStr] || {})[dayNum];
              const isTarget = !!(reviewAtDay[numStr] || {})[dayNum];
              const dayHasReview = !!reviewRole && daysWithTargets.has(dayNum);
              const status = normalizeDetectStatus(reviewDetectMap[dayNum] ?? 'DET');
              const diedNow = pd && dayNum === pd.day;
              const diedLater = pd && dayNum > pd.day;
              const diedBefore = !pd || pd && dayNum < pd.day;
              const rs = innerRadius + rIdx * ringWidth;
              const re = rs + ringWidth;
              const pos = getPosition(num, playerCount, (rs + re) / 2);
              
              let ringFill = 'transparent';
              if (dayHasReview) {
                ringFill = reviewRingFill(status, isTarget, reviewRole);
              } else if (vCount !== undefined) {
                ringFill = 'rgba(var(--accent-color-rgb), 0.6)';
              } else if (diedBefore) {
                ringFill = 'var(--panel-color)';
              } else if (diedLater) {
                ringFill = 'rgba(var(--bg-color-rgb), 0.5)';
              } else if (diedNow) {
                ringFill = 'rgba(var(--muted-color-rgb), 0.25)';
              } 

              return (
                <g key={`${num}-${dayNum}`} className="pointer-events-none">
                  <path d={getSlicePath(i, playerCount, rs, re)} fill={ringFill} />
                  {showDeathIcons && diedNow && !dayHasReview && (
                    <text x={pos.x} y={pos.y} textAnchor="middle" alignmentBaseline="middle" className="text-[10px] opacity-100 fill-[var(--text-on-panel)] drop-shadow-sm">{pd.reason}</text>
                  )}
                  {dayHasReview && isTarget && (
                    <text 
                      x={pos.x} 
                      y={pos.y} 
                      textAnchor="middle" 
                      alignmentBaseline="middle" 
                      className="font-black fill-white drop-shadow-sm" 
                      style={{ fontSize: `${Math.max(6, ringWidth * 0.28)}px` }}
                    >
                      {formatDetectStatus(status)}
                    </text>
                  )}
                  {vCount !== undefined && mode === 'allReceive' && !diedNow && !dayHasReview && (
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

            {isCurrent && <path 
              d={getSlicePath(i, playerCount, innerRadius, outerRadius)} 
              fill="rgba(var(--accent-color-rgb), 0.1)" 
              strokeWidth="2" 
            />}
            {isVoter && <path 
              d={getSlicePath(i, playerCount, innerRadius, outerRadius)} 
              fill = "var(--accent-color)"
            />}

            <path 
              d={getSlicePath(i, playerCount, sliceStartRadius, innerRadius)} 
              stroke={stroke} 
              strokeWidth={hasReviewMarks || isCurrent ? "3" : "0.75"} 
              className={`transition-colors duration-200
                ${isVoter ? 'fill-[var(--accent-color)]' : hasReviewMarks ? (reviewRole === 'flowerGirl' ? 'fill-pink-500' : 'fill-amber-500') : isCurrent ? 'fill-[var(--accent-color)]' : pd ? 'fill-[var(--bg-color)]' : 'fill-[var(--panel-color)]'}`}
            />

            <text 
              x={getPosition(num, playerCount, labelRadius).x} 
              y={getPosition(num, playerCount, labelRadius).y} 
              textAnchor="middle" 
              alignmentBaseline="middle" 
              className={`text-[9px] font-black tracking-tight pointer-events-none transition-all duration-200 
                ${isVoter || hasReviewMarks || isCurrent ? 'fill-white' : pd ? 'fill-[var(--text-on-bg)]' : 'fill-[var(--text-on-panel)]'}`}
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
