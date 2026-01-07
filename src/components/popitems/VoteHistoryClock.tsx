"use client";

import React, { useState, useRef, useEffect } from 'react';

interface VoteHistoryClockProps {
  playerNo: number;
  nominations: any[];
  playerCount: number;
  deadPlayers: number[];
  mode: 'vote' | 'beVoted';
  players: any[];
  deaths: any[];
  filterDay: number | 'all';
  // Interaction Props
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
  const [isSliding, setIsSliding] = useState(false);
  const [dragAction, setDragAction] = useState<'add' | 'remove' | null>(null);
  const [hasMoved, setHasMoved] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Stats calculation
  const votedToCounts: { [key: string]: number } = {};
  const nominatedByCounts: { [key: string]: number } = {};
  const nominatedToArrows: { from: number, to: number }[] = [];
  const nominatedByArrows: { from: number, to: number }[] = [];

  // Filter nominations by day if needed
  const filteredNoms = nominations.filter(n => filterDay === 'all' || n.day === filterDay);

  filteredNoms.forEach(n => {
    // Heatmap data: based on votes
    if (n.voters.split(',').includes(playerStr) && n.t && n.t !== '-') {
      votedToCounts[n.t] = (votedToCounts[n.t] || 0) + 1;
    }
    if (n.t === playerStr && n.voters.length > 0) {
      n.voters.split(',').forEach((v: string) => {
        if (v) nominatedByCounts[v] = (nominatedByCounts[v] || 0) + 1;
      });
    }

    // Arrow data: based on nominations
    if (n.f === playerStr && n.t && n.t !== '-') {
      nominatedToArrows.push({ from: playerNo, to: parseInt(n.t) });
    }
    if (n.t === playerStr && n.f && n.f !== '-') {
      nominatedByArrows.push({ from: parseInt(n.f), to: playerNo });
    }
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
      const baseAngle = (from - 1) * (360 / playerCount) - 90 + (360 / (playerCount * 2));
      const rad = baseAngle * Math.PI / 180;
      
      // Arc parameters for the loop
      const startAngle = rad - 0.25;
      const endAngle = rad + 0.25;
      
      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);
      
      const cpRadius = radius + 35; // How far the loop extends outwards
      const cpx1 = cx + cpRadius * Math.cos(startAngle);
      const cpy1 = cy + cpRadius * Math.sin(startAngle);
      const cpx2 = cx + cpRadius * Math.cos(endAngle);
      const cpy2 = cy + cpRadius * Math.sin(endAngle);

      const pathData = `M ${x1} ${y1} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${x2} ${y2}`;
      
      // Calculate arrowhead direction based on the end of the curve
      const angleAtEnd = Math.atan2(y2 - cpy2, x2 - cpx2);
      const headLen = 7;
      const leftX = x2 - headLen * Math.cos(angleAtEnd - Math.PI / 6);
      const leftY = y2 - headLen * Math.sin(angleAtEnd - Math.PI / 6);
      const rightX = x2 - headLen * Math.cos(angleAtEnd + Math.PI / 6);
      const rightY = y2 - headLen * Math.sin(angleAtEnd + Math.PI / 6);

      return (
        <g key={`self-${from}-${day}`}>
          <path d={pathData} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" opacity="0.6" />
          <polygon points={`${x2},${y2} ${leftX},${leftY} ${rightX},${rightY}`} fill={color} opacity="0.6" />
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
      <g key={`${from}-${to}-${day}-${type}`}>
        <line x1={fromPos.x} y1={fromPos.y} x2={headX} y2={headY} stroke={color} strokeWidth={width} strokeLinecap="round" opacity="0.6" />
        <polygon points={`${headX},${headY} ${leftX},${leftY} ${rightX},${rightY}`} fill={color} opacity="0.6" />
      </g>
    );
  };

  const getPosInfo = (clientX: number, clientY: number) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const scale = 288 / rect.width;
    const x = (clientX - rect.left) * scale - 144;
    const y = (clientY - rect.top) * scale - 144;
    const dist = Math.sqrt(x * x + y * y);
    
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    const playerNum = (Math.floor(angle / (360 / playerCount)) % playerCount) + 1;
    
    return { dist, playerNum };
  };

  const handleMouseDown = (e: React.MouseEvent, num: number | 'center') => {
    const startNum = num === 'center' ? playerNo : num;
    if (isVoting) {
      const action = pendingNom?.voters.includes(startNum.toString()) ? 'remove' : 'add';
      setDragAction(action);
      setGestureStart(startNum);
      setGestureCurrent(startNum);
      onVoterToggle(startNum.toString(), action);
      return;
    }
    setGestureStart(startNum);
    setGestureCurrent(startNum);
    setIsSliding(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gestureStart === null) return;
    const info = getPosInfo(e.clientX, e.clientY);
    if (!info) return;

    let target = info.playerNum;
    if (info.dist < 35) {
      target = gestureStart; // Map center to gestureStart for self-vote
    }

    if (isVoting) {
      if (target !== gestureCurrent) {
        setGestureCurrent(target);
        onVoterToggle(target.toString(), dragAction!);
      }
    } else {
      if (target !== gestureCurrent || info.dist < 35 || info.dist > 50) {
        setGestureCurrent(target);
        setIsSliding(true);
      }
    }
  };

  const handleMouseUp = () => {
    if (gestureStart !== null) {
      if (isVoting) {
        // Just clear dragging
      } else if (!isSliding) {
        onPlayerClick(gestureStart);
      } else if (gestureCurrent !== null && gestureStart !== gestureCurrent) {
        onNominationSlideEnd(gestureStart.toString(), gestureCurrent.toString());
      }
    }
    setGestureStart(null);
    setGestureCurrent(null);
    setIsSliding(false);
    setDragAction(null);
  };

  const handleTouchStart = (e: React.TouchEvent, num: number | 'center') => {
    const startNum = num === 'center' ? playerNo : num;
    setGestureStart(startNum);
    setGestureCurrent(startNum);
    setIsSliding(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setHasMoved(true);
    if (gestureStart === null) return;
    const touch = e.touches[0];
    const info = getPosInfo(touch.clientX, touch.clientY);
    if (!info) return;

    let target = info.playerNum;
    if (info.dist < 35) target = gestureStart;

    if (isVoting) {
      if (target !== gestureCurrent) {
        setGestureCurrent(target);
        onVoterToggle(target.toString(), dragAction!);
      }
    } else {
      if (target !== gestureCurrent || info.dist < 35) {
        setGestureCurrent(target);
        setIsSliding(true);
      }
    }
  };

  const handleTouchEnd = (num: number) => {
    if (!hasMoved) {
      onPlayerClick(num);
    }
    handleMouseUp();
    setHasMoved(false);
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
        onTouchEnd={() => handleMouseUp()}
      >
        {playersList.map((num, i) => {
          const numStr = num.toString();
          
          // Background Color Logic
          let fill = '#ffffff';
          // Hide historical heat map ONLY during active voting
          const showHistorical = !isVoting;
          const intensity = showHistorical ? (counts[numStr] ? counts[numStr] / maxCount : 0) : 0;
          
          if (isVoting && pendingNom?.voters.includes(numStr)) {
            fill = '#ef4444'; // Solid Red for active voters
          } else if (intensity > 0) {
            fill = `rgba(6, 182, 212, ${intensity})`; // Cyan intensity
          }

          const stroke = '#f1f5f9';
          const path = getSlicePath(i, playerCount);
          const isDead = deadPlayers.includes(num);
          const death = deaths.find(d => parseInt(d.playerNo) === num);
          const deathReason = death?.reason || '';
          const playerData = players.find(p => p.no === num);
          
          // Multiple Properties Splitting
          const properties = playerData?.property ? playerData.property.split('|').map((p: string) => p.trim()) : [];
          
          const middlePos = getPosition(num, middleRadius);
          const innerPos = getPosition(num, innerRadius);

          return (
            <g 
              key={num} 
              onMouseDown={() => handleMouseDown(num)}
              onTouchStart={() => handleMouseDown(num)}
              onTouchEnd={() => handleTouchEnd(num)}
              className="cursor-pointer"
            >
              <path d={path} fill={fill} stroke={stroke} strokeWidth="1" className="transition-colors duration-150" />
              {isDead && deathReason && (
                <text x={innerPos.x} y={innerPos.y} textAnchor="middle" alignmentBaseline="middle" className="text-[10px] font-black fill-slate-600 pointer-events-none">
                  {deathReason}
                </text>
              )}
              <text x={middlePos.x} y={middlePos.y} textAnchor="middle" alignmentBaseline="middle" className={`text-[12px] font-black pointer-events-none ${(intensity > 0 || (isVoting && pendingNom?.voters.includes(numStr))) ? 'fill-white' : 'fill-slate-600'}`}>
                {num}
              </text>
              
              {/* Stacked Properties: from middle towards outer */}
              {properties.map((prop: string, idx: number) => {
                const stepRadius = 15;
                const propRadius = middleRadius + 15 + (idx * stepRadius);
                // Cap at outer radius
                if (propRadius > outerRadius - 5) return null;
                const propPos = getPosition(num, propRadius);
                
                return (
                  <text 
                    key={idx}
                    x={propPos.x} 
                    y={propPos.y} 
                    textAnchor="middle" 
                    alignmentBaseline="middle" 
                    className={`text-[8px] font-bold pointer-events-none ${(intensity > 0 || (isVoting && pendingNom?.voters.includes(numStr))) ? 'fill-white' : 'fill-slate-600'}`}
                  >
                    {prop.length > 5 ? prop.substring(0, 5) + '..' : prop}
                  </text>
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

        {/* Historical Arrows (Only if not in active voting phase) */}
        {!isVoting && (
          <>
            {nominatedToArrows.map(arrow => drawArrow(arrow.from, arrow.to, '#ef4444'))}
            {nominatedByArrows.map(arrow => drawArrow(arrow.from, arrow.to, '#22c55e'))}
          </>
        )}

        {/* Active Gesture Arrow */}
        {isSliding && gestureStart && gestureCurrent && gestureStart !== gestureCurrent && (
          drawArrow(gestureStart, gestureCurrent, '#a855f7', 3)
        )}

        {/* Pending Nomination Arrow (Purple) */}
        {pendingNom && drawArrow(parseInt(pendingNom.f), parseInt(pendingNom.t), '#a855f7', 4)}

        {/* Center Control */}
        <g 
          className="cursor-pointer group" 
          onMouseDown={(e) => handleMouseDown(e, 'center')}
          onTouchStart={(e) => handleTouchStart(e, 'center')}
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