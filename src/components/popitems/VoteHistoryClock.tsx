"use client";

import React, { useState, useRef } from 'react';

interface VoteHistoryClockProps {
  playerNo: number;
  nominations: any[];
  playerCount: number;
  deadPlayers: number[];
  mode: 'vote' | 'beVoted';
  players: any[];
  deaths: any[];
  filterDay: number | 'all';
  onPlayerClick: (num: number) => void;
  pendingNom: { f: string; t: string; voters: string[] } | null;
  isVoting: boolean;
  onNominationSlideEnd: (from: string, to: string) => void;
  onVoterToggle: (playerNo: string, forceAction?: 'add' | 'remove') => void;
  onToggleVotingPhase: () => void;
}

const VoteHistoryClock: React.FC<VoteHistoryClockProps> = ({ 
  playerNo, nominations, playerCount, deadPlayers, mode, players, deaths, filterDay,
  onPlayerClick, pendingNom, isVoting, onNominationSlideEnd, onVoterToggle, onToggleVotingPhase
}) => {
  const playerStr = playerNo.toString();
  const [gestureStart, setGestureStart] = useState<number | null>(null);
  const [gestureCurrent, setGestureCurrent] = useState<number | null>(null);
  const [isSliding, setIsSliding] = useState(false);
  const [dragAction, setDragAction] = useState<'add' | 'remove' | null>(null);
  const [hasMoved, setHasMoved] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Constants for geometry
  const cx = 144, cy = 144, outerRadius = 142, innerRadius = 55;
  const maxDay = Math.max(...nominations.map(n => n.day), 1);
  const ringCount = Math.max(maxDay, 1);
  const ringWidth = (outerRadius - innerRadius) / ringCount;

  // Data maps
  const votedAtDay: Record<string, Set<number>> = {}; // playerNum -> Set of days
  const nominatedAtDay: Record<string, Set<number>> = {}; // playerNum -> Set of days
  const arrowData: { from: number, to: number, day: number, type: 'to' | 'from' }[] = [];

  nominations.forEach(n => {
    const day = n.day;
    const isFiltered = filterDay !== 'all' && day !== filterDay;
    if (isFiltered) return;

    if (mode === 'vote') {
      // VOTE VIEW
      // Did current player (i) vote for player (k) on day (n)?
      if (n.voters.split(',').includes(playerStr) && n.t && n.t !== '-') {
        if (!votedAtDay[n.t]) votedAtDay[n.t] = new Set();
        votedAtDay[n.t].add(day);
      }
      // Did current player (i) NOMINATE anyone on day (n)?
      if (n.f === playerStr) {
        if (!votedAtDay[playerStr]) votedAtDay[playerStr] = new Set();
        votedAtDay[playerStr].add(day);
        if (n.t && n.t !== '-') arrowData.push({ from: playerNo, to: parseInt(n.t), day, type: 'to' });
      }
    } else {
      // BE VOTED VIEW
      // Did player (k) vote for current player (i) on day (n)?
      if (n.t === playerStr && n.voters.split(',').includes(n.voters)) {
         // This needs checking per voter
      }
      // Actually we iterate voters for beVoted
      if (n.t === playerStr) {
        n.voters.split(',').forEach((v: string) => {
          if (v) {
            if (!votedAtDay[v]) votedAtDay[v] = new Set();
            votedAtDay[v].add(day);
          }
        });
        // Did current player (i) GET NOMINATED on day (n)?
        if (!votedAtDay[playerStr]) votedAtDay[playerStr] = new Set();
        votedAtDay[playerStr].add(day);
        
        if (n.f && n.f !== '-') arrowData.push({ from: parseInt(n.f), to: playerNo, day, type: 'from' });
      }
    }
  });

  const getPosition = (num: number, radius: number) => {
    const index = num - 1;
    const angle = (index * (360 / playerCount)) - 90 + (360 / (playerCount * 2));
    return {
      x: cx + radius * Math.cos(angle * Math.PI / 180),
      y: cy + radius * Math.sin(angle * Math.PI / 180)
    };
  };

  const getSlicePath = (index: number, total: number, rInner: number, rOuter: number) => {
    const angleStep = 360 / total;
    const startAngle = (index * angleStep) - 90;
    const endAngle = ((index + 1) * angleStep) - 90;
    const polarToCartesian = (angle: number, radius: number) => ({
      x: cx + (radius * Math.cos(angle * Math.PI / 180)),
      y: cy + (radius * Math.sin(angle * Math.PI / 180))
    });
    const p1 = polarToCartesian(startAngle, rOuter);
    const p2 = polarToCartesian(endAngle, rOuter);
    const p3 = polarToCartesian(endAngle, rInner);
    const p4 = polarToCartesian(startAngle, rInner);
    const largeArcFlag = angleStep > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${p4.x} ${p4.y} Z`;
  };

  const drawArrow = (from: number, to: number, day: number, color: string, width = 2) => {
    const radius = innerRadius + (day - 0.5) * ringWidth;
    const fromPos = getPosition(from, radius);
    const toPos = getPosition(to, radius);
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 5) return null;

    const angle = Math.atan2(dy, dx);
    const headLength = 8;
    const headX = toPos.x - 4 * Math.cos(angle);
    const headY = toPos.y - 4 * Math.sin(angle);
    
    const leftX = headX - headLength * Math.cos(angle - Math.PI / 6);
    const leftY = headY - headLength * Math.sin(angle - Math.PI / 6);
    const rightX = headX - headLength * Math.cos(angle + Math.PI / 6);
    const rightY = headY - headLength * Math.sin(angle + Math.PI / 6);

    return (
      <g key={`${from}-${to}-${day}-${color}`}>
        <line x1={fromPos.x} y1={fromPos.y} x2={headX} y2={headY} stroke={color} strokeWidth={width} strokeLinecap="round" opacity="0.6" />
        <polygon points={`${headX},${headY} ${leftX},${leftY} ${rightX},${rightY}`} fill={color} opacity="0.6" />
      </g>
    );
  };

  const getPlayerAtPos = (clientX: number, clientY: number) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const x = clientX - (rect.left + rect.width / 2);
    const y = clientY - (rect.top + rect.height / 2);
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    const index = Math.floor(angle / (360 / playerCount));
    return (index % playerCount) + 1;
  };

  const handleMouseDown = (num: number) => {
    if (isVoting) {
      const action = pendingNom?.voters.includes(num.toString()) ? 'remove' : 'add';
      setDragAction(action);
      setGestureStart(num);
      setGestureCurrent(num);
      onVoterToggle(num.toString(), action);
      return;
    }
    setGestureStart(num);
    setGestureCurrent(num);
    setIsSliding(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gestureStart === null) return;
    const current = getPlayerAtPos(e.clientX, e.clientY);
    if (!current) return;

    if (isVoting) {
      if (current !== gestureCurrent) {
        setGestureCurrent(current);
        onVoterToggle(current.toString(), dragAction!);
      }
    } else {
      if (current !== gestureCurrent) {
        setGestureCurrent(current);
        setIsSliding(true);
      }
    }
  };

  const handleMouseUp = () => {
    if (gestureStart !== null) {
      if (!isVoting && !isSliding) {
        onPlayerClick(gestureStart);
      } else if (!isVoting && isSliding && gestureCurrent !== null && gestureStart !== gestureCurrent) {
        onNominationSlideEnd(gestureStart.toString(), gestureCurrent.toString());
      }
    }
    setGestureStart(null);
    setGestureCurrent(null);
    setIsSliding(false);
    setDragAction(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setHasMoved(true);
    if (gestureStart === null) return;
    const touch = e.touches[0];
    const current = getPlayerAtPos(touch.clientX, touch.clientY);
    if (!current) return;

    if (isVoting) {
      if (current !== gestureCurrent) {
        setGestureCurrent(current);
        onVoterToggle(current.toString(), dragAction!);
      }
    } else {
      if (current !== gestureCurrent) {
        setGestureCurrent(current);
        setIsSliding(true);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <svg 
        ref={svgRef}
        viewBox="0 0 288 288" 
        className="w-80 h-80 touch-none select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => {
            if (!hasMoved && gestureStart !== null) onPlayerClick(gestureStart);
            handleMouseUp();
            setHasMoved(false);
        }}
      >
        <defs>
          <radialGradient id="playerSpotlight" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#facc15" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#fef08a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {Array.from({ length: playerCount }, (_, i) => i + 1).map((num, i) => {
          const numStr = num.toString();
          const isCurrentViewPlayer = num === playerNo;
          const isDead = deadPlayers.includes(num);
          const activeDays = votedAtDay[numStr] || new Set();

          return (
            <g 
              key={num} 
              onMouseDown={() => handleMouseDown(num)}
              onTouchStart={() => handleMouseDown(num)}
              className="cursor-pointer"
            >
              {/* Background slice */}
              <path 
                d={getSlicePath(i, playerCount, innerRadius, outerRadius)} 
                fill={isCurrentViewPlayer ? 'url(#playerSpotlight)' : isDead ? '#f8fafc' : '#ffffff'} 
                stroke={isCurrentViewPlayer ? '#eab308' : '#f1f5f9'} 
                strokeWidth={isCurrentViewPlayer ? "2" : "0.5"} 
                className="transition-colors duration-150" 
              />

              {/* Ladder Rings */}
              {Array.from({ length: ringCount }).map((_, rIdx) => {
                const dayNum = rIdx + 1;
                const isVotedDay = activeDays.has(dayNum);
                const rStart = innerRadius + rIdx * ringWidth;
                const rEnd = rStart + ringWidth;
                
                if (!isVotedDay) return null;

                return (
                  <path 
                    key={`${num}-${dayNum}`}
                    d={getSlicePath(i, playerCount, rStart, rEnd)}
                    fill={mode === 'vote' ? 'rgba(6, 182, 212, 0.7)' : 'rgba(16, 185, 129, 0.7)'}
                    className="pointer-events-none"
                  />
                );
              })}

              {/* Player Number and Death Reason */}
              <text 
                x={getPosition(num, (innerRadius + outerRadius) / 2).x} 
                y={getPosition(num, (innerRadius + outerRadius) / 2).y} 
                textAnchor="middle" 
                alignmentBaseline="middle" 
                className={`text-[11px] font-black pointer-events-none ${isCurrentViewPlayer ? 'fill-slate-900' : 'fill-slate-400 opacity-40'}`}
              >
                {num}
              </text>
            </g>
          );
        })}

        {!isVoting && (
          <>
            {arrowData.map(arrow => 
              drawArrow(arrow.from, arrow.to, arrow.day, arrow.type === 'to' ? '#ef4444' : '#22c55e', 2.5)
            )}
          </>
        )}

        {isSliding && gestureStart && gestureCurrent && gestureStart !== gestureCurrent && (
          drawArrow(gestureStart, gestureCurrent, maxDay, '#a855f7', 3)
        )}

        {pendingNom && drawArrow(parseInt(pendingNom.f), parseInt(pendingNom.t), currentDay || maxDay, '#a855f7', 4)}

        <g 
          className="cursor-pointer group" 
          onClick={(e) => { e.stopPropagation(); onToggleVotingPhase(); }}
        >
          <circle 
            cx={cx} cy={cy} r="25" 
            fill={isVoting ? "#ef4444" : pendingNom ? "#a855f7" : "#0f172a"} 
            className="transition-colors duration-200"
          />
          {pendingNom ? (
            <text 
              x={cx} y={cy} textAnchor="middle" alignmentBaseline="middle" 
              className="text-white text-[14px] font-black pointer-events-none"
            >
              {isVoting ? 'SAVE' : 'V'}
            </text>
          ) : (
            <>
              <text x={cx} y={cy - 5} textAnchor="middle" className="text-white text-[10px] font-black pointer-events-none">{playerNo}</text>
              <text x={cx} y={cy + 5} textAnchor="middle" className="text-white text-[6px] font-black uppercase pointer-events-none">{mode === 'vote' ? 'VOTE' : 'BE VOTED'}</text>
            </>
          )}
        </g>
      </svg>
      {pendingNom && (
        <div className="mt-2 text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          <span className="text-purple-600">{pendingNom.f}</span> Nominated <span className="text-purple-600">{pendingNom.t}</span>
          {isVoting && <span className="ml-2 border-l border-slate-300 pl-2 text-red-600">Recording Voters...</span>}
        </div>
      )}
    </div>
  );
};

export default VoteHistoryClock;