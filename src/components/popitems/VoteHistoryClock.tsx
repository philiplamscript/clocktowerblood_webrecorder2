"use client";

import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  assignmentMode?: 'death' | 'property' | null;
  selectedReason?: string;
  selectedProperty?: string;
}

const VoteHistoryClock: React.FC<VoteHistoryClockProps> = ({ 
  playerNo, nominations, playerCount, deadPlayers, mode, players, deaths, filterDay,
  onPlayerClick, pendingNom, isVoting, onNominationSlideEnd, onVoterToggle, onToggleVotingPhase,
  currentDay, setCurrentDay, showDeathIcons, assignmentMode, selectedReason, selectedProperty
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
  const maxDay = Math.max(...nominations.map(n => n.day), 1, currentDay);
  const ringCount = Math.max(maxDay, 1);
  const ringWidth = (outerRadius - innerRadius) / ringCount;

  // Data maps
  const votedAtDay: Record<string, Record<number, number>> = {}; 
  const arrowData: { from: number, to: number, day: number, type: 'to' | 'from' | 'self' }[] = [];

  nominations.forEach(n => {
    const day = n.day;
    const isFiltered = filterDay !== 'all' && day !== filterDay;
    if (isFiltered) return;

    const voteCount = n.voters ? n.voters.split(',').filter((v: string) => v).length : 0;

    if (mode === 'allReceive') {
      if (n.t && n.t !== '-') {
        if (!votedAtDay[n.t]) votedAtDay[n.t] = {};
        votedAtDay[n.t][day] = voteCount;
      }
      
      if (n.f && n.f !== '-' && n.t && n.t !== '-') {
        let type: 'to' | 'from' | 'self' = 'to';
        const fromNum = parseInt(n.f);
        const toNum = parseInt(n.t);
        
        if (fromNum === toNum) type = 'self';
        else if (toNum === playerNo) type = 'from';
        else if (fromNum === playerNo) type = 'to';
        
        arrowData.push({ from: fromNum, to: toNum, day, type });
      }
    } else {
      if (mode === 'vote') {
        if (n.voters.split(',').includes(playerStr) && n.t && n.t !== '-' && n.t !== playerStr) {
          if (!votedAtDay[n.t]) votedAtDay[n.t] = {};
          votedAtDay[n.t][day] = voteCount;
        }
      } else {
        if (n.t === playerStr) {
          n.voters.split(',').forEach((v: string) => {
            if (v && v !== playerStr) {
              if (!votedAtDay[v]) votedAtDay[v] = {};
              votedAtDay[v][day] = voteCount;
            }
          });
        }
      }

      if (n.f === playerStr && n.t === playerStr) {
        arrowData.push({ from: playerNo, to: playerNo, day, type: 'self' });
      } else if (n.f === playerStr && n.t && n.t !== '-') {
        arrowData.push({ from: playerNo, to: parseInt(n.t), day, type: 'to' });
      } else if (n.t === playerStr && n.f && n.f !== '-') {
        arrowData.push({ from: parseInt(n.f), to: playerNo, day, type: 'from' });
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

  const drawArrow = (from: number, to: number, day: number, type: 'to' | 'from' | 'self', width = 2) => {
    const color = type === 'to' ? '#ef4444' : type === 'from' ? '#22c55e' : '#a855f7';
    const radius = innerRadius + (day - 0.5) * ringWidth;

    if (type === 'self' || from === to) {
      const pos = getPosition(from, radius);
      const angle = ((from - 1) * (360 / playerCount)) - 90 + (360 / (playerCount * 2));
      const rad = angle * Math.PI / 180;
      const innerX = cx + (radius - 15) * Math.cos(rad);
      const innerY = cy + (radius - 15) * Math.sin(rad);
      const arcRadius = 10;
      const arcStartAngle = rad - 0.5;
      const arcEndAngle = rad + 1.5;
      const x1 = pos.x + arcRadius * Math.cos(arcStartAngle);
      const y1 = pos.y + arcRadius * Math.sin(arcStartAngle);
      const x2 = pos.x + arcRadius * Math.cos(arcEndAngle);
      const y2 = pos.y + arcRadius * Math.sin(arcEndAngle);

      return (
        <g key={`self-${from}-${day}`} opacity="0.6">
          <line x1={pos.x} y1={pos.y} x2={innerX} y2={innerY} stroke={color} strokeWidth={width} strokeLinecap="round" />
          <path d={`M ${x1} ${y1} A ${arcRadius} ${arcRadius} 0 1 1 ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />
          <polygon points={`${innerX},${innerY} ${innerX+3},${innerY+3} ${innerX-3},${innerY+3}`} fill={color} transform={`rotate(${angle+90}, ${innerX}, ${innerY})`} />
        </g>
      );
    }

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
      <g key={`${from}-${to}-${day}-${type}`} opacity="0.6">
        <line x1={fromPos.x} y1={fromPos.y} x2={headX} y2={headY} stroke={color} strokeWidth={width} strokeLinecap="round" />
        <polygon points={`${headX},${headY} ${leftX},${leftY} ${rightX},${rightY}`} fill={color} />
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
      } else if (!isVoting && isSliding && gestureCurrent !== null) {
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
        onTouchEnd={(e) => {
            if (!hasMoved && gestureStart !== null) {
              onPlayerClick(gestureStart);
              setGestureStart(null);
              setGestureCurrent(null);
              setIsSliding(false);
            } else {
              handleMouseUp();
            }
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
          const playerDeath = deaths.find(d => d.playerNo === numStr);
          const activeDaysMap = votedAtDay[numStr] || {};
          const isVoter = isVoting && pendingNom?.voters.includes(numStr);

          // Assignment coloring
          let fill = isVoter ? '#ef4444' : isCurrentViewPlayer ? 'url(#playerSpotlight)' : playerDeath ? '#f8fafc' : '#ffffff';
          let stroke = isCurrentViewPlayer ? '#eab308' : '#f1f5f9';
          
          if (assignmentMode === 'death') {
            stroke = '#ef4444';
          } else if (assignmentMode === 'property') {
            stroke = '#3b82f6';
          }

          return (
            <g 
              key={num} 
              onMouseDown={() => handleMouseDown(num)}
              onTouchStart={() => handleMouseDown(num)}
              className="cursor-pointer"
            >
              <path 
                d={getSlicePath(i, playerCount, innerRadius, outerRadius)} 
                fill={fill} 
                stroke={stroke} 
                strokeWidth={isCurrentViewPlayer ? "2" : "0.5"} 
                className="transition-colors duration-150" 
              />

              {Array.from({ length: ringCount }).map((_, rIdx) => {
                const dayNum = rIdx + 1;
                const voteCount = activeDaysMap[dayNum];
                const diedThisDay = playerDeath && dayNum === playerDeath.day;
                const deadAfterThisDay = playerDeath && dayNum > playerDeath.day;
                
                const rStart = innerRadius + rIdx * ringWidth;
                const rEnd = rStart + ringWidth;
                const pos = getPosition(num, (rStart + rEnd) / 2);

                return (
                  <g key={`${num}-${dayNum}`} className="pointer-events-none">
                    <path 
                      d={getSlicePath(i, playerCount, rStart, rEnd)}
                      fill={
                        voteCount !== undefined ? (mode === 'vote' ? 'rgba(6, 182, 212, 0.7)' : mode === 'allReceive' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(37, 99, 235, 0.7)') : 
                        deadAfterThisDay ? 'rgba(148, 163, 184, 0.2)' : 
                        'transparent'
                      }
                    />
                    {showDeathIcons && diedThisDay && (
                      <text 
                        x={pos.x} y={pos.y} 
                        textAnchor="middle" alignmentBaseline="middle" 
                        className="text-[12px] drop-shadow-sm select-none"
                      >
                        {playerDeath.reason}
                      </text>
                    )}
                    {voteCount !== undefined && mode === 'allReceive' && !diedThisDay && (
                      <text 
                        x={pos.x} y={pos.y} 
                        textAnchor="middle" alignmentBaseline="middle" 
                        className="font-black fill-white drop-shadow-sm"
                        style={{ fontSize: `${Math.max(8, ringWidth * 0.15)}px` }}
                      >
                        {voteCount}
                      </text>
                    )}
                  </g>
                );
              })}

              <text 
                x={getPosition(num, (innerRadius + outerRadius) / 2).x} 
                y={getPosition(num, (innerRadius + outerRadius) / 2).y} 
                textAnchor="middle" 
                alignmentBaseline="middle" 
                className={`text-[11px] font-black pointer-events-none ${isVoter ? 'fill-white' : isCurrentViewPlayer ? 'fill-slate-900' : playerDeath ? 'fill-slate-300' : 'fill-slate-400 opacity-40'}`}
              >
                {num}
              </text>
            </g>
          );
        })}

        {!isVoting && arrowData.map((arrow, idx) => 
          drawArrow(arrow.from, arrow.to, arrow.day, arrow.type, mode === 'allReceive' ? 1.5 : 2.5)
        )}

        {isSliding && gestureStart && gestureCurrent && (
          drawArrow(gestureStart, gestureCurrent, maxDay, gestureStart === gestureCurrent ? 'self' : 'to', 3)
        )}

        {pendingNom && !isSliding && drawArrow(parseInt(pendingNom.f), parseInt(pendingNom.t), currentDay, pendingNom.f === pendingNom.t ? 'self' : 'to', 4)}

        <g className="pointer-events-auto">
          <circle 
            cx={cx} cy={cy} r="25" 
            fill={isVoting ? "#ef4444" : pendingNom ? "#a855f7" : assignmentMode === 'death' ? '#ef4444' : assignmentMode === 'property' ? '#3b82f6' : "#0f172a"} 
            className="transition-colors duration-200"
            onClick={(e) => { e.stopPropagation(); onToggleVotingPhase(); }}
          />
          
          {pendingNom ? (
            <text 
              x={cx} y={cy} textAnchor="middle" alignmentBaseline="middle" 
              className="text-white text-[14px] font-black pointer-events-none"
            >
              {isVoting ? 'SAVE' : 'V'}
            </text>
          ) : assignmentMode ? (
            <text 
              x={cx} y={cy} textAnchor="middle" alignmentBaseline="middle" 
              className="text-white text-[8px] font-black uppercase pointer-events-none"
            >
              {assignmentMode === 'death' ? selectedReason : 'PROP'}
            </text>
          ) : (
            <g>
              <text x={cx} y={cy - 8} textAnchor="middle" className="text-white text-[10px] font-black pointer-events-none">{playerNo}</text>
              <g className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setCurrentDay?.(Math.max(1, currentDay - 1)); }}>
                <path d="M 125 144 L 132 140 L 132 148 Z" fill="white" opacity="0.5" className="hover:opacity-100" />
              </g>
              <text x={cx} y={cy + 4} textAnchor="middle" className="text-white text-[8px] font-black pointer-events-none">D{currentDay}</text>
              <g className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setCurrentDay?.(currentDay + 1); }}>
                <path d="M 163 144 L 156 140 L 156 148 Z" fill="white" opacity="0.5" className="hover:opacity-100" />
              </g>
              <text x={cx} y={cy + 14} textAnchor="middle" className="text-white text-[5px] font-black uppercase pointer-events-none text-center">
                {mode === 'vote' ? 'VOTE' : mode === 'beVoted' ? 'RECV' : 'ALL'}
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

export default VoteHistoryClock;