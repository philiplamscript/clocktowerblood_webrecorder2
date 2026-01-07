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
  currentDay: number;
}

const VoteHistoryClock: React.FC<VoteHistoryClockProps> = ({ 
  playerNo, nominations, playerCount, deadPlayers, mode, players, deaths, filterDay,
  onPlayerClick, pendingNom, isVoting, onNominationSlideEnd, onVoterToggle, onToggleVotingPhase,
  currentDay
}) => {
  const playerStr = playerNo.toString();
  const [gestureStart, setGestureStart] = useState<number | null>(null);
  const [gestureCurrent, setGestureCurrent] = useState<number | null>(null);
  const [gesturePath, setGesturePath] = useState<number[]>([]);
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
  const votedAtDay: Record<string, Set<number>> = {}; 
  const arrowData: { from: number, to: number, day: number, type: 'to' | 'from' | 'self' }[] = [];

  nominations.forEach(n => {
    const day = n.day;
    const isFiltered = filterDay !== 'all' && day !== filterDay;
    if (isFiltered) return;

    const voters = n.voters.split(',').filter(v => v !== "");
    const isSelfNomination = n.f === n.t && n.f !== '-';
    const playerVoted = voters.includes(playerStr);

    if (mode === 'vote') {
      if (playerVoted && n.t && n.t !== '-') {
        if (!votedAtDay[n.t]) votedAtDay[n.t] = new Set();
        votedAtDay[n.t].add(day);
        if (isSelfNomination && n.t === playerStr) {
          if (!votedAtDay[playerStr]) votedAtDay[playerStr] = new Set();
          votedAtDay[playerStr].add(day);
        }
      }
    } else {
      if (n.t === playerStr) {
        voters.forEach((v: string) => {
          if (v) {
            if (!votedAtDay[v]) votedAtDay[v] = new Set();
            votedAtDay[v].add(day);
          }
        });
        if (isSelfNomination && playerVoted) {
          if (!votedAtDay[playerStr]) votedAtDay[playerStr] = new Set();
          votedAtDay[playerStr].add(day);
        }
      }
    }

    if (isSelfNomination && playerVoted) {
      arrowData.push({ from: playerNo, to: playerNo, day, type: 'self' });
    } else if (n.f === playerStr && n.t && n.t !== '-') {
      arrowData.push({ from: playerNo, to: parseInt(n.t), day, type: 'to' });
    } else if (n.t === playerStr && n.f && n.f !== '-') {
      arrowData.push({ from: parseInt(n.f), to: playerNo, day, type: 'from' });
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

    if (type === 'self') {
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
    setGesturePath([num]);
    setIsSliding(false);
    setHasMoved(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gestureStart === null) return;
    setHasMoved(true);
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
        setGesturePath(prev => {
          if (prev[prev.length - 1] !== current) {
            return [...prev, current];
          }
          return prev;
        });
        setIsSliding(true);
      }
    }
  };

  const handleMouseUp = () => {
    if (gestureStart !== null) {
      if (!isVoting && !isSliding) {
        if (!hasMoved) {
          onPlayerClick(gestureStart);
        }
      } else if (!isVoting && isSliding) {
        const isSelfNom = gesturePath.length >= 3 && gesturePath[0] === gesturePath[gesturePath.length - 1] && gesturePath.some(p => p !== gestureStart);
        if (isSelfNom) {
          onNominationSlideEnd(gestureStart.toString(), gestureStart.toString());
        } else if (gestureCurrent !== null && gestureStart !== gestureCurrent) {
          onNominationSlideEnd(gestureStart.toString(), gestureCurrent.toString());
        }
      }
    }
    setGestureStart(null);
    setGestureCurrent(null);
    setGesturePath([]);
    setIsSliding(false);
    setDragAction(null);
    setHasMoved(false);
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
        setGesturePath(prev => {
          if (prev[prev.length - 1] !== current) {
            return [...prev, current];
          }
          return prev;
        });
        setIsSliding(true);
      }
    }
  };

  const isSelfNomPreview = gesturePath.length >= 3 && gesturePath[0] === gesturePath[gesturePath.length - 1] && gesturePath.some(p => p !== gestureStart);

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
          const isVoter = isVoting && pendingNom?.voters.includes(numStr);

          return (
            <g 
              key={num} 
              onMouseDown={() => handleMouseDown(num)}
              onTouchStart={() => handleMouseDown(num)}
              className="cursor-pointer"
            >
              <path 
                d={getSlicePath(i, playerCount, innerRadius, outerRadius)} 
                fill={isVoter ? '#ef4444' : isCurrentViewPlayer ? 'url(#playerSpotlight)' : isDead ? '#f8fafc' : '#ffffff'} 
                stroke={isCurrentViewPlayer ? '#eab308' : '#f1f5f9'} 
                strokeWidth={isCurrentViewPlayer ? "2" : "0.5"} 
                className="transition-colors duration-150" 
              />

              {Array.from({ length: ringCount }).map((_, rIdx) => {
                const dayNum = rIdx + 1;
                const isVotedDay = activeDays.has(dayNum);
                const rStart = innerRadius + rIdx * ringWidth;
                const rEnd = rStart + ringWidth;
                if (!isVotedDay) return null;

                const isSelfVote = isCurrentViewPlayer && nominations.some(n => 
                  n.day === dayNum && n.f === playerStr && n.t === playerStr && n.voters.split(',').includes(playerStr)
                );

                return (
                  <path 
                    key={`${num}-${dayNum}`}
                    d={getSlicePath(i, playerCount, rStart, rEnd)}
                    fill={isSelfVote ? 'rgba(147, 51, 234, 0.7)' : (mode === 'vote' ? 'rgba(6, 182, 212, 0.7)' : 'rgba(37, 99, 235, 0.7)')}
                    stroke={isSelfVote ? '#a855f7' : 'none'}
                    strokeWidth={isSelfVote ? 1 : 0}
                    strokeDasharray={isSelfVote ? '2,2' : 'none'}
                    className="pointer-events-none"
                  />
                );
              })}

              <text 
                x={getPosition(num, (innerRadius + outerRadius) / 2).x} 
                y={getPosition(num, (innerRadius + outerRadius) / 2).y} 
                textAnchor="middle" 
                alignmentBaseline="middle" 
                className={`text-[11px] font-black pointer-events-none ${isVoter ? 'fill-white' : isCurrentViewPlayer ? 'fill-slate-900' : 'fill-slate-400 opacity-40'}`}
              >
                {num}
              </text>
            </g>
          );
        })}

        {!isVoting && arrowData.map(arrow => 
          drawArrow(arrow.from, arrow.to, arrow.day, arrow.type, 2.5)
        )}

        {isSliding && gestureStart && (
          isSelfNomPreview 
            ? drawArrow(gestureStart, gestureStart, maxDay, 'self', 4)
            : gestureCurrent !== null && gestureStart !== gestureCurrent && drawArrow(gestureStart, gestureCurrent, maxDay, 'to', 3)
        )}

        {pendingNom && (
          pendingNom.f === pendingNom.t 
            ? drawArrow(parseInt(pendingNom.f), parseInt(pendingNom.t), currentDay, 'self', 4)
            : drawArrow(parseInt(pendingNom.f), parseInt(pendingNom.t), currentDay, 'to', 4)
        )}

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
    </div>
  );
};

export default VoteHistoryClock;