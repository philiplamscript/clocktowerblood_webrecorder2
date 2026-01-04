"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';

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
  const svgRef = useRef<SVGSVGElement>(null);

  // Filter nominations by day
  const filteredNoms = nominations.filter(n => filterDay === 'all' || n.day === filterDay);

  // Stats calculation for heatmap
  const votedToCounts: { [key: string]: number } = {};
  const nominatedByCounts: { [key: string]: number } = {};
  const nominatedToArrows: { from: number, to: number }[] = [];
  const nominatedByArrows: { from: number, to: number }[] = [];

  filteredNoms.forEach(n => {
    if (n.voters.split(',').includes(playerStr) && n.t && n.t !== '-') {
      votedToCounts[n.t] = (votedToCounts[n.t] || 0) + 1;
    }
    if (n.t === playerStr && n.voters.length > 0) {
      n.voters.split(',').forEach((v: string) => {
        if (v) nominatedByCounts[v] = (nominatedByCounts[v] || 0) + 1;
      });
    }
    if (n.f === playerStr && n.t && n.t !== '-') nominatedToArrows.push({ from: playerNo, to: parseInt(n.t) });
    if (n.t === playerStr && n.f && n.f !== '-') nominatedByArrows.push({ from: parseInt(n.f), to: playerNo });
  });

  const counts = mode === 'vote' ? votedToCounts : nominatedByCounts;
  const maxCount = Math.max(...Object.values(counts), 1);
  const playersList = Array.from({ length: playerCount }, (_, i) => i + 1);
  const cx = 144, cy = 144, outerRadius = 142, middleRadius = 95, innerRadius = 65;

  const getPosition = (num: number, radius: number) => {
    const index = num - 1;
    const angle = (index * (360 / playerCount)) - 90 + (360 / (playerCount * 2));
    return {
      x: cx + radius * Math.cos(angle * Math.PI / 180),
      y: cy + radius * Math.sin(angle * Math.PI / 180)
    };
  };

  const getSlicePath = (index: number, total: number) => {
    const angleStep = 360 / total;
    const startAngle = (index * angleStep) - 90;
    const endAngle = ((index + 1) * angleStep) - 90;
    const polarToCartesian = (angle: number, radius: number) => ({
      x: cx + (radius * Math.cos(angle * Math.PI / 180)),
      y: cy + (radius * Math.sin(angle * Math.PI / 180))
    });
    const p1 = polarToCartesian(startAngle, outerRadius);
    const p2 = polarToCartesian(endAngle, outerRadius);
    const p3 = polarToCartesian(endAngle, innerRadius);
    const p4 = polarToCartesian(startAngle, innerRadius);
    return `M ${p1.x} ${p1.y} A ${outerRadius} ${outerRadius} 0 0 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${innerRadius} ${innerRadius} 0 0 0 ${p4.x} ${p4.y} Z`;
  };

  const drawArrow = (from: number, to: number, color: string, width = 2) => {
    const fromPos = getPosition(from, middleRadius);
    const toPos = getPosition(to, middleRadius);
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 5) return null;

    const angle = Math.atan2(dy, dx);
    const headX = toPos.x - 5 * Math.cos(angle);
    const headY = toPos.y - 5 * Math.sin(angle);
    const headLength = 10;
    const leftX = headX - headLength * Math.cos(angle - Math.PI / 6);
    const leftY = headY - headLength * Math.sin(angle - Math.PI / 6);
    const rightX = headX - headLength * Math.cos(angle + Math.PI / 6);
    const rightY = headY - headLength * Math.sin(angle + Math.PI / 6);

    return (
      <g key={`${from}-${to}-${color}-${Math.random()}`}>
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

  const startGesture = (num: number, e: React.MouseEvent | React.TouchEvent) => {
    if (isVoting) {
      const action = pendingNom?.voters.includes(num.toString()) ? 'remove' : 'add';
      setDragAction(action);
      setGestureStart(num);
      setGestureCurrent(num);
      setIsSliding(false);
      onVoterToggle(num.toString(), action);
    } else {
      setGestureStart(num);
      setGestureCurrent(num);
      setIsSliding(false);
    }
  };

  const moveGesture = (clientX: number, clientY: number) => {
    if (gestureStart === null) return;
    const current = getPlayerAtPos(clientX, clientY);
    if (!current || current === gestureCurrent) return;

    setGestureCurrent(current);
    setIsSliding(true);

    if (isVoting && dragAction) {
      onVoterToggle(current.toString(), dragAction);
    }
  };

  const endGesture = () => {
    if (gestureStart !== null) {
      if (!isVoting) {
        if (!isSliding) {
          onPlayerClick(gestureStart);
        } else if (gestureCurrent !== null && gestureStart !== gestureCurrent) {
          onNominationSlideEnd(gestureStart.toString(), gestureCurrent.toString());
        }
      }
    }
    setGestureStart(null);
    setGestureCurrent(null);
    setIsSliding(false);
    setDragAction(null);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <svg 
        ref={svgRef}
        viewBox="0 0 288 288" 
        className="w-80 h-80 touch-none select-none"
        onMouseMove={(e) => moveGesture(e.clientX, e.clientY)}
        onMouseUp={endGesture}
        onMouseLeave={endGesture}
        onTouchMove={(e) => moveGesture(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={endGesture}
        onTouchCancel={endGesture}
      >
        {playersList.map((num, i) => {
          const numStr = num.toString();
          let fill = '#ffffff';
          const intensity = !isVoting ? (counts[numStr] ? counts[numStr] / maxCount : 0) : 0;
          
          if (isVoting && pendingNom?.voters.includes(numStr)) {
            fill = '#ef4444';
          } else if (intensity > 0) {
            fill = `rgba(6, 182, 212, ${intensity})`;
          }

          const path = getSlicePath(i, playerCount);
          const isDead = deadPlayers.includes(num);
          const death = deaths.find(d => parseInt(d.playerNo) === num);
          const deathReason = death?.reason || '';
          const playerData = players.find(p => p.no === num);
          const properties = playerData?.property ? playerData.property.split('|').map((p: string) => p.trim()) : [];
          
          const middlePos = getPosition(num, middleRadius);
          const innerPos = getPosition(num, innerRadius);

          return (
            <g 
              key={num} 
              onMouseDown={(e) => startGesture(num, e)}
              onTouchStart={(e) => { e.preventDefault(); startGesture(num, e); }}
              className="cursor-pointer"
            >
              <path d={path} fill={fill} stroke="#f1f5f9" strokeWidth="1" className="transition-colors duration-150" />
              {isDead && deathReason && (
                <text x={innerPos.x} y={innerPos.y} textAnchor="middle" alignmentBaseline="middle" className="text-[10px] font-black fill-slate-600 pointer-events-none">
                  {deathReason}
                </text>
              )}
              <text x={middlePos.x} y={middlePos.y} textAnchor="middle" alignmentBaseline="middle" className={`text-[12px] font-black pointer-events-none ${(intensity > 0 || (isVoting && pendingNom?.voters.includes(numStr))) ? 'fill-white' : 'fill-slate-600'}`}>
                {num}
              </text>
              {properties.map((prop: string, idx: number) => {
                const propRadius = middleRadius + 15 + (idx * 15);
                if (propRadius > outerRadius - 5) return null;
                const propPos = getPosition(num, propRadius);
                return (
                  <text key={idx} x={propPos.x} y={propPos.y} textAnchor="middle" alignmentBaseline="middle" className={`text-[8px] font-bold pointer-events-none ${(intensity > 0 || (isVoting && pendingNom?.voters.includes(numStr))) ? 'fill-white' : 'fill-slate-600'}`}>
                    {prop.length > 5 ? prop.substring(0, 5) + '..' : prop}
                  </text>
                );
              })}
            </g>
          );
        })}

        {!isVoting && (
          <>
            {nominatedToArrows.map(arrow => drawArrow(arrow.from, arrow.to, '#ef4444'))}
            {nominatedByArrows.map(arrow => drawArrow(arrow.from, arrow.to, '#22c55e'))}
          </>
        )}

        {isSliding && gestureStart && gestureCurrent && gestureStart !== gestureCurrent && !isVoting && (
          drawArrow(gestureStart, gestureCurrent, '#a855f7', 3)
        )}

        {pendingNom && drawArrow(parseInt(pendingNom.f), parseInt(pendingNom.t), '#a855f7', 4)}

        <g className="cursor-pointer group" onClick={(e) => { e.stopPropagation(); onToggleVotingPhase(); }}>
          <circle cx={cx} cy={cy} r="25" fill={isVoting ? "#ef4444" : pendingNom ? "#a855f7" : "#0f172a"} className="transition-colors duration-200" />
          {pendingNom ? (
            <text x={cx} y={cy} textAnchor="middle" alignmentBaseline="middle" className="text-white text-[14px] font-black pointer-events-none">{isVoting ? 'SAVE' : 'V'}</text>
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