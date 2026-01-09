"use client";

import React, { useState, useRef } from 'react';
import { getPosition, getSlicePath } from '../../utils/clockUtils';
import ClockAxis from './ClockAxis';

interface VoteHistoryClockProps {
  playerNo: number;
  nominations: any[];
  playerCount: number;
  deadPlayers: number[];
  mode: 'vote' | 'beVoted' | 'allReceive';
  players: any[];
  deaths: any[];
  filterDay: number | 'all';
  onPlayerClick: (num: number) => void;
  pendingNom: { f: string; t: string; voters: string[] } | null;
  isVoting: boolean;
  onNominationSlideEnd: (from: string, to: string) => void;
  onVoterToggle: (playerNo: string, forceAction?: 'add' | 'remove') => void;
  onToggleVotingPhase: () => void;
  currentDay: number;
  setCurrentDay?: (day: number) => void;
  showDeathIcons: boolean;
  showAxis?: boolean;
  assignmentMode?: 'death' | 'property' | null;
  selectedReason?: string;
  selectedProperty?: string;
}

const VoteHistoryClock: React.FC<VoteHistoryClockProps> = ({ 
  playerNo, nominations, playerCount, deadPlayers, mode, players, deaths, filterDay,
  onPlayerClick, pendingNom, isVoting, onNominationSlideEnd, onVoterToggle, onToggleVotingPhase,
  currentDay, setCurrentDay, showDeathIcons, showAxis = true, assignmentMode, selectedReason, selectedProperty
}) => {
  const [gestureStart, setGestureStart] = useState<number | null>(null);
  const [gestureCurrent, setGestureCurrent] = useState<number | null>(null);
  const [isSliding, setIsSliding] = useState(false);
  const [dragAction, setDragAction] = useState<'add' | 'remove' | null>(null);
  const [centerTouchX, setCenterTouchX] = useState<number | null>(null);
  const [centerSwiped, setCenterSwiped] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const cx = 144, cy = 144, outerRadius = 142, innerRadius = 55;
  const maxDay = Math.max(...nominations.map(n => n.day), 1, currentDay);
  const ringCount = Math.max(maxDay, 1);
  const ringWidth = (outerRadius - innerRadius) / ringCount;

  const votedAtDay: Record<string, Record<number, number>> = {}; 
  const arrowData: any[] = [];

  nominations.forEach(n => {
    if (filterDay !== 'all' && n.day !== filterDay) return;
    const voteCount = n.voters ? n.voters.split(',').filter((v: string) => v).length : 0;
    if (mode === 'allReceive' && n.t && n.t !== '-') {
      if (!votedAtDay[n.t]) votedAtDay[n.t] = {};
      votedAtDay[n.t][n.day] = voteCount;
      arrowData.push({ from: parseInt(n.f), to: parseInt(n.t), day: n.day, type: n.f === n.t ? 'self' : n.f === playerNo.toString() ? 'to' : n.t === playerNo.toString() ? 'from' : 'to' });
    } else if (mode === 'vote' && n.voters.split(',').includes(playerNo.toString())) {
      if (!votedAtDay[n.t]) votedAtDay[n.t] = {};
      votedAtDay[n.t][n.day] = voteCount;
      arrowData.push({ from: playerNo, to: parseInt(n.t), day: n.day, type: 'to' });
    } else if (mode === 'beVoted' && n.t === playerNo.toString()) {
      n.voters.split(',').forEach((v: string) => {
        if (v && v !== playerNo.toString()) {
          if (!votedAtDay[v]) votedAtDay[v] = {};
          votedAtDay[v][n.day] = voteCount;
          arrowData.push({ from: parseInt(v), to: playerNo, day: n.day, type: 'from' });
        }
      });
    }
  });

  const getPlayerAtPos = (clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = clientX - (rect.left + rect.width / 2), y = clientY - (rect.top + rect.height / 2);
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    return (Math.floor(angle / (360 / playerCount)) % playerCount) + 1;
  };

  const drawArrow = (from: number, to: number, day: number, type: string, width = 1.5) => {
    const radius = innerRadius + (day - 0.5) * ringWidth;
    const fp = getPosition(from, playerCount, radius), tp = getPosition(to, playerCount, radius);
    const color = type === 'to' ? '#ef4444' : type === 'from' ? '#22c55e' : '#a855f7';
    return <line key={`${from}-${to}-${day}`} x1={fp.x} y1={fp.y} x2={tp.x} y2={tp.y} stroke={color} strokeWidth={width} strokeLinecap="round" opacity="0.6" />;
  };

  return (
    <div className="w-full flex flex-col items-center">
      <svg ref={svgRef} viewBox="0 0 288 288" className="w-80 h-80 touch-none select-none"
        onMouseMove={(e) => gestureStart && setGestureCurrent(getPlayerAtPos(e.clientX, e.clientY))}
        onMouseUp={() => { if (gestureStart && gestureCurrent) isVoting ? onVoterToggle(gestureCurrent.toString()) : onNominationSlideEnd(gestureStart.toString(), gestureCurrent.toString()); setGestureStart(null); }}
        onTouchMove={(e) => gestureStart && setGestureCurrent(getPlayerAtPos(e.touches[0].clientX, e.touches[0].clientY))}
        onTouchEnd={() => { if (gestureStart && gestureCurrent) isVoting ? onVoterToggle(gestureCurrent.toString()) : onNominationSlideEnd(gestureStart.toString(), gestureCurrent.toString()); setGestureStart(null); }}
      >
        {showAxis && <ClockAxis cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} ringCount={ringCount} ringWidth={ringWidth} />}
        {Array.from({ length: playerCount }, (_, i) => i + 1).map((num, i) => (
          <g key={num} onMouseDown={() => setGestureStart(num)} onTouchStart={() => setGestureStart(num)}>
            <path d={getSlicePath(i, playerCount, innerRadius, outerRadius)} fill={num === playerNo ? '#fef08a' : '#ffffff'} stroke="#f1f5f9" strokeWidth="0.5" />
            <text x={getPosition(num, playerCount, (innerRadius + outerRadius) / 2).x} y={getPosition(num, playerCount, (innerRadius + outerRadius) / 2).y} textAnchor="middle" alignmentBaseline="middle" className="text-[10px] font-black fill-slate-400">{num}</text>
          </g>
        ))}
        {arrowData.map(a => drawArrow(a.from, a.to, a.day, a.type))}
        <circle cx={cx} cy={cy} r="25" fill={isVoting ? '#dc2626' : '#eab308'} onClick={onToggleVotingPhase} />
      </svg>
    </div>
  );
};

export default VoteHistoryClock;