"use client";

import React, { useState, useRef } from 'react';

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
  
  // Center swipe states
  const [centerTouchX, setCenterTouchX] = useState<number | null>(null);
  const [centerSwiped, setCenterSwiped] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const lastEventTime = useRef<number>(0);

  const cx = 144, cy = 144, outerRadius = 142, innerRadius = 55;
  const maxDay = Math.max(...nominations.map(n => n.day), 1, currentDay);
  const ringCount = Math.max(maxDay, 1);
  const ringWidth = (outerRadius - innerRadius) / ringCount;

  const playerStr = playerNo.toString();

  const votedAtDay: Record<string, Record<number, number>> = {}; 
  const arrowData: { from: number, to: number, day: number, type: 'to' | 'from' | 'self' }[] = [];

  nominations.forEach(n => {
    const day = n.day;
    if (filterDay !== 'all' && day !== filterDay) return;
    const voteCount = n.voters ? n.voters.split(',').filter((v: string) => v).length : 0;

    if (mode === 'allReceive') {
      if (n.t && n.t !== '-') {
        if (!votedAtDay[n.t]) votedAtDay[n.t] = {};
        votedAtDay[n.t][day] = voteCount;
      }
      if (n.f && n.f !== '-' && n.t && n.t !== '-') {
        let type: 'to' | 'from' | 'self' = 'to';
        const fromNum = parseInt(n.f), toNum = parseInt(n.t);
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
      if (n.f === playerStr && n.t === playerStr) arrowData.push({ from: playerNo, to: playerNo, day, type: 'self' });
      else if (n.f === playerStr && n.t && n.t !== '-') arrowData.push({ from: playerNo, to: parseInt(n.t), day, type: 'to' });
      else if (n.t === playerStr && n.f && n.f !== '-') arrowData.push({ from: parseInt(n.f), to: playerNo, day, type: 'from' });
    }
  });

  const getPosition = (num: number, radius: number) => {
    const angle = ((num - 1) * (360 / playerCount)) - 90 + (360 / (playerCount * 2));
    return {
      x: cx + radius * Math.cos(angle * Math.PI / 180),
      y: cy + radius * Math.sin(angle * Math.PI / 180)
    };
  };

  const getSlicePath = (index: number, total: number, rInner: number, rOuter: number) => {
    const angleStep = 360 / total;
    const startAngle = (index * angleStep) - 90, endAngle = ((index + 1) * angleStep) - 90;
    const p1 = { x: cx + (rOuter * Math.cos(startAngle * Math.PI / 180)), y: cy + (rOuter * Math.sin(startAngle * Math.PI / 180)) };
    const p2 = { x: cx + (rOuter * Math.cos(endAngle * Math.PI / 180)), y: cy + (rOuter * Math.sin(endAngle * Math.PI / 180)) };
    const p3 = { x: cx + (rInner * Math.cos(endAngle * Math.PI / 180)), y: cy + (rInner * Math.sin(endAngle * Math.PI / 180)) };
    const p4 = { x: cx + (rInner * Math.cos(startAngle * Math.PI / 180)), y: cy + (rInner * Math.sin(startAngle * Math.PI / 180)) };
    return `M ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${angleStep > 180 ? 1 : 0} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rInner} ${rInner} 0 ${angleStep > 180 ? 1 : 0} 0 ${p4.x} ${p4.y} Z`;
  };

  const drawArrow = (from: number, to: number, day: number, type: 'to' | 'from' | 'self', width = 2) => {
    const color = type === 'to' ? '#ef4444' : type === 'from' ? '#22c55e' : '#a855f7';
    const radius = innerRadius + (day - 0.5) * ringWidth;
    if (type === 'self' || from === to) {
      const pos = getPosition(from, radius), rad = ((from - 1) * (360 / playerCount) - 90 + 180 / playerCount) * Math.PI / 180;
      const ix = cx + (radius - 15) * Math.cos(rad), iy = cy + (radius - 15) * Math.sin(rad);
      return (
        <g key={`self-${from}-${day}`} opacity="0.6">
          <line x1={pos.x} y1={pos.y} x2={ix} y2={iy} stroke={color} strokeWidth={width} strokeLinecap="round" />
          <path d={`M ${pos.x + 10 * Math.cos(rad - 0.5)} ${pos.y + 10 * Math.sin(rad - 0.5)} A 10 10 0 1 1 ${pos.x + 10 * Math.cos(rad + 1.5)} ${pos.y + 10 * Math.sin(rad + 1.5)}`} fill="none" stroke={color} strokeWidth={width} />
          <polygon points={`${ix},${iy} ${ix+3},${iy+3} ${ix-3},${iy+3}`} fill={color} transform={`rotate(${rad * 180 / Math.PI + 90}, ${ix}, ${iy})`} />
        </g>
      );
    }
    const fp = getPosition(from, radius), tp = getPosition(to, radius), dx = tp.x - fp.x, dy = tp.y - fp.y;
    const dist = Math.sqrt(dx * dx + dy * dy); if (dist < 5) return null;
    const angle = Math.atan2(dy, dx), hx = tp.x - 4 * Math.cos(angle), hy = tp.y - 4 * Math.sin(angle);
    return (
      <g key={`${from}-${to}-${day}-${type}`} opacity="0.6">
        <line x1={fp.x} y1={fp.y} x2={hx} y2={hy} stroke={color} strokeWidth={width} strokeLinecap="round" />
        <polygon points={`${hx},${hy} ${hx - 8 * Math.cos(angle - Math.PI / 6)},${hy - 8 * Math.sin(angle - Math.PI / 6)} ${hx - 8 * Math.cos(angle + Math.PI / 6)},${hy - 8 * Math.sin(angle + Math.PI / 6)}`} fill={color} />
      </g>
    );
  };

  const getPlayerAtPos = (clientX: number, clientY: number) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const x = clientX - (rect.left + rect.width / 2), y = clientY - (rect.top + rect.height / 2);
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    return (Math.floor(angle / (360 / playerCount)) % playerCount) + 1;
  };

  const handleStart = (num: number, e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    if (now - lastEventTime.current < 100) return;
    lastEventTime.current = now;

    if (e.cancelable) e.preventDefault();

    if (isVoting) {
      const isAlreadyVoter = pendingNom?.voters.includes(num.toString());
      const action = isAlreadyVoter ? 'remove' : 'add';
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

  const handleMove = (clientX: number, clientY: number) => {
    if (centerTouchX !== null) {
      const deltaX = clientX - centerTouchX;
      if (Math.abs(deltaX) > 40) {
        if (!centerSwiped) {
          if (deltaX > 0) setCurrentDay?.(Math.max(1, currentDay - 1));
          else setCurrentDay?.(currentDay + 1);
          setCenterSwiped(true);
        }
      }
      return;
    }

    if (gestureStart === null) return;
    const current = getPlayerAtPos(clientX, clientY);
    if (!current) return;
    if (isVoting) {
      if (current !== gestureCurrent) {
        setGestureCurrent(current);
        onVoterToggle(current.toString(), dragAction!);
      }
    } else if (current !== gestureCurrent) {
      setGestureCurrent(current);
      setIsSliding(true);
    }
  };

  const handleEnd = () => {
    if (centerTouchX !== null) {
      if (!centerSwiped) {
        onToggleVotingPhase();
      }
      setCenterTouchX(null);
      setCenterSwiped(false);
      return;
    }

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

  const handleCenterStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setCenterTouchX(clientX);
    setCenterSwiped(false);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <svg ref={svgRef} viewBox="0 0 288 288" className="w-80 h-80 touch-none select-none"
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd} onMouseLeave={handleEnd}
        onTouchMove={(e) => { handleMove(e.touches[0].clientX, e.touches[0].clientY); }}
        onTouchEnd={handleEnd}
      >
        <defs>
          <radialGradient id="playerSpotlight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#facc15" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#fef08a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* --- COORDINATION AXIS & DAY RINGS --- */}
        {showAxis && (
          <g className="pointer-events-none transition-opacity duration-300">
            {/* Day Rings */}
            {Array.from({ length: ringCount + 1 }).map((_, i) => (
              <circle 
                key={`ring-${i}`} 
                cx={cx} cy={cy} 
                r={innerRadius + i * ringWidth} 
                fill="none" 
                stroke="#cbd5e1" 
                strokeWidth="0.75" 
                strokeDasharray="2,2" 
                className="opacity-40"
              />
            ))}
            {/* Crosshair Axis */}
            <line x1={cx} y1={cy - outerRadius} x2={cx} y2={cy + outerRadius} stroke="#94a3b8" strokeWidth="0.75" strokeDasharray="4,2" className="opacity-50" />
            <line x1={cx - outerRadius} y1={cy} x2={cx + outerRadius} y2={cy} stroke="#94a3b8" strokeWidth="0.75" strokeDasharray="4,2" className="opacity-50" />
            
            {/* Day Labels along vertical axis */}
            {Array.from({ length: ringCount }).map((_, i) => (
              <text 
                key={`day-label-${i}`} 
                x={cx + 3} 
                y={cy - (innerRadius + (i + 0.5) * ringWidth)} 
                className="text-[4px] font-black fill-slate-400 uppercase tracking-tighter"
              >
                D{i + 1}
              </text>
            ))}
          </g>
        )}

        {Array.from({ length: playerCount }, (_, i) => i + 1).map((num, i) => {
          const numStr = num.toString(), isCurrent = num === playerNo, isVoter = isVoting && pendingNom?.voters.includes(numStr);
          const pd = deaths.find(d => d.playerNo === numStr), fill = isVoter ? '#ef4444' : isCurrent ? 'url(#playerSpotlight)' : pd ? '#f8fafc' : '#ffffff';
          const stroke = isCurrent ? '#eab308' : assignmentMode === 'death' ? '#ef4444' : assignmentMode === 'property' ? '#3b82f6' : '#f1f5f9';

          return (
            <g key={num} onMouseDown={(e) => handleStart(num, e)} onTouchStart={(e) => handleStart(num, e)} className="cursor-pointer">
              <path d={getSlicePath(i, playerCount, innerRadius, outerRadius)} fill={fill} stroke={stroke} strokeWidth={isCurrent ? "2" : "0.5"} />
              {Array.from({ length: ringCount }).map((_, rIdx) => {
                const dayNum = rIdx + 1, vCount = (votedAtDay[numStr] || {})[dayNum];
                const diedNow = pd && dayNum === pd.day, diedLater = pd && dayNum > pd.day;
                const rs = innerRadius + rIdx * ringWidth, re = rs + ringWidth, pos = getPosition(num, (rs + re) / 2);
                return (
                  <g key={`${num}-${dayNum}`} className="pointer-events-none">
                    <path d={getSlicePath(i, playerCount, rs, re)} fill={vCount !== undefined ? (mode === 'vote' ? 'rgba(6, 182, 212, 0.7)' : mode === 'allReceive' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(37, 99, 235, 0.7)') : diedLater ? 'rgba(148, 163, 184, 0.2)' : 'transparent'} />
                    {showDeathIcons && diedNow && <text x={pos.x} y={pos.y} textAnchor="middle" alignmentBaseline="middle" className="text-[12px]">{pd.reason}</text>}
                    {vCount !== undefined && mode === 'allReceive' && !diedNow && <text x={pos.x} y={pos.y} textAnchor="middle" alignmentBaseline="middle" className="font-black fill-white" style={{ fontSize: `${Math.max(8, ringWidth * 0.15)}px` }}>{vCount}</text>}
                  </g>
                );
              })}
              <text x={getPosition(num, (innerRadius + outerRadius) / 2).x} y={getPosition(num, (innerRadius + outerRadius) / 2).y} textAnchor="middle" alignmentBaseline="middle" className={`text-[11px] font-black pointer-events-none ${isVoter ? 'fill-white' : isCurrent ? 'fill-slate-900' : pd ? 'fill-slate-300' : 'fill-slate-400 opacity-40'}`}>{num}</text>
            </g>
          );
        })}

        {!isVoting && arrowData.map(a => drawArrow(a.from, a.to, a.day, a.type, mode === 'allReceive' ? 1.5 : 2.5))}
        {isSliding && gestureStart && gestureCurrent && drawArrow(gestureStart, gestureCurrent, maxDay, gestureStart === gestureCurrent ? 'self' : 'to', 3)}
        {pendingNom && !isSliding && drawArrow(parseInt(pendingNom.f), parseInt(pendingNom.t), currentDay, pendingNom.f === pendingNom.t ? 'self' : 'to', 4)}

        <g className="pointer-events-auto cursor-pointer" onMouseDown={handleCenterStart} onTouchStart={handleCenterStart}>
          <circle cx={cx} cy={cy} r="25" fill={isVoting ? '#dc2626' : pendingNom ? '#a855f7' : '#eab308'} className="transition-colors shadow-lg" />
          {pendingNom ? <text x={cx} y={cy} textAnchor="middle" alignmentBaseline="middle" className="text-white text-[14px] font-black pointer-events-none">{isVoting ? 'SAVE' : 'V'}</text>
          : assignmentMode ? <text x={cx} y={cy} textAnchor="middle" alignmentBaseline="middle" className="text-white text-[8px] font-black uppercase pointer-events-none">{assignmentMode === 'death' ? selectedReason : 'PROP'}</text>
          : <g className="pointer-events-none">
              <text x={cx} y={cy - 8} textAnchor="middle" className="text-white text-[10px] font-black">{playerNo}</text>
              <text x={cx} y={cy + 4} textAnchor="middle" className="text-white text-[10px] font-black">D{currentDay}</text>
              <text x={cx} y={cy + 14} textAnchor="middle" className="text-white text-[5px] font-black uppercase">{mode === 'vote' ? 'VOTE' : mode === 'beVoted' ? 'RECV' : 'ALL'}</text>
            </g>
          }
        </g>
      </svg>
    </div>
  );
};

export default VoteHistoryClock;