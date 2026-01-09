"use client";

import React, { useState, useRef, useMemo } from 'react';
import ClockArrow from './ClockArrow';
import ClockSlice from './ClockSlice';
import ClockCenter from './ClockCenter';

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

const VoteHistoryClock: React.FC<VoteHistoryClockProps> = (props) => {
  const { 
    playerNo, nominations, playerCount, deadPlayers, mode, deaths, filterDay,
    onPlayerClick, pendingNom, isVoting, onNominationSlideEnd, onVoterToggle, onToggleVotingPhase,
    currentDay, setCurrentDay, showDeathIcons, showAxis = true, assignmentMode, selectedReason
  } = props;

  const [gestureStart, setGestureStart] = useState<number | null>(null);
  const [gestureCurrent, setGestureCurrent] = useState<number | null>(null);
  const [isSliding, setIsSliding] = useState(false);
  const [dragAction, setDragAction] = useState<'add' | 'remove' | null>(null);
  const [centerTouchX, setCenterTouchX] = useState<number | null>(null);
  const [centerSwiped, setCenterSwiped] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const cx = 144, cy = 144, outerRadius = 142, innerRadius = 55;
  const ringCount = Math.max(Math.max(...nominations.map(n => n.day), 1, currentDay), 1);
  const ringWidth = (outerRadius - innerRadius) / ringCount;

  const { votedAtDay, arrowData } = useMemo(() => {
    const votes: Record<string, Record<number, number>> = {};
    const arrows: any[] = [];
    nominations.forEach(n => {
      if (filterDay !== 'all' && n.day !== filterDay) return;
      const vArr = n.voters.split(',').filter((v: any) => v);
      if (mode === 'allReceive' && n.t && n.t !== '-') {
        if (!votes[n.t]) votes[n.t] = {};
        votes[n.t][n.day] = vArr.length;
        arrows.push({ from: parseInt(n.f), to: parseInt(n.t), day: n.day, type: n.f === n.t ? 'self' : parseInt(n.t) === playerNo ? 'from' : parseInt(n.f) === playerNo ? 'to' : 'to' });
      } else if (mode === 'vote' && vArr.includes(playerNo.toString()) && n.t !== '-' && n.t !== playerNo.toString()) {
        if (!votes[n.t]) votes[n.t] = {};
        votes[n.t][n.day] = vArr.length;
        arrows.push({ from: playerNo, to: parseInt(n.t), day: n.day, type: 'to' });
      } else if (mode === 'beVoted' && n.t === playerNo.toString()) {
        vArr.forEach((v: any) => { if (v !== playerNo.toString()) { if (!votes[v]) votes[v] = {}; votes[v][n.day] = vArr.length; arrows.push({ from: parseInt(v), to: playerNo, day: n.day, type: 'from' }); } });
        if (n.f === n.t) arrows.push({ from: playerNo, to: playerNo, day: n.day, type: 'self' });
      }
    });
    return { votedAtDay: votes, arrowData: arrows };
  }, [nominations, filterDay, mode, playerNo]);

  const getPlayerAtPos = (clientX: number, clientY: number) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const x = clientX - (rect.left + rect.width / 2), y = clientY - (rect.top + rect.height / 2);
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    return (Math.floor(angle / (360 / playerCount)) % playerCount) + 1;
  };

  const handleStart = (num: number, e: React.MouseEvent | React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    if (isVoting) {
      const action = pendingNom?.voters.includes(num.toString()) ? 'remove' : 'add';
      setDragAction(action); setGestureStart(num); setGestureCurrent(num); onVoterToggle(num.toString(), action);
    } else {
      setGestureStart(num); setGestureCurrent(num); setIsSliding(false);
    }
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (centerTouchX !== null) {
      const dx = clientX - centerTouchX;
      if (Math.abs(dx) > 40 && !centerSwiped) {
        if (dx > 0) setCurrentDay?.(Math.max(1, currentDay - 1)); else setCurrentDay?.(currentDay + 1);
        setCenterSwiped(true);
      }
      return;
    }
    if (gestureStart === null) return;
    const current = getPlayerAtPos(clientX, clientY);
    if (current && current !== gestureCurrent) {
      setGestureCurrent(current);
      if (isVoting) onVoterToggle(current.toString(), dragAction!); else setIsSliding(true);
    }
  };

  const handleEnd = () => {
    if (centerTouchX !== null) { if (!centerSwiped) onToggleVotingPhase(); setCenterTouchX(null); setCenterSwiped(false); return; }
    if (gestureStart !== null) {
      if (!isVoting && !isSliding) onPlayerClick(gestureStart);
      else if (!isVoting && isSliding && gestureCurrent !== null) onNominationSlideEnd(gestureStart.toString(), gestureCurrent.toString());
    }
    setGestureStart(null); setGestureCurrent(null); setIsSliding(false); setDragAction(null);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <svg ref={svgRef} viewBox="0 0 288 288" className="w-80 h-80 touch-none select-none"
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)} onMouseUp={handleEnd} onMouseLeave={handleEnd}
        onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)} onTouchEnd={handleEnd}
      >
        <defs>
          <radialGradient id="playerSpotlight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#facc15" stopOpacity="0.8" /><stop offset="70%" stopColor="#fef08a" stopOpacity="0.4" /><stop offset="100%" stopColor="#fef08a" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        {showAxis && <g className="pointer-events-none opacity-40">
          {Array.from({ length: ringCount + 1 }).map((_, i) => <circle key={i} cx={cx} cy={cy} r={innerRadius + i * ringWidth} fill="none" stroke="#cbd5e1" strokeWidth="0.75" strokeDasharray="2,2" />)}
        </g>}
        {Array.from({ length: playerCount }, (_, i) => i + 1).map(num => (
          <ClockSlice key={num} num={num} playerCount={playerCount} isCurrent={num === playerNo} isVoter={isVoting && pendingNom?.voters.includes(num.toString())} isDead={deadPlayers.includes(num)} innerRadius={innerRadius} outerRadius={outerRadius} ringCount={ringCount} ringWidth={ringWidth} votedAtDay={votedAtDay[num.toString()] || {}} deathInfo={deaths.find(d => d.playerNo === num.toString())} showDeathIcons={showDeathIcons} mode={mode} assignmentMode={assignmentMode || null} onStart={(e) => handleStart(num, e)} />
        ))}
        {!isVoting && arrowData.map((a, idx) => <ClockArrow key={idx} {...a} playerCount={playerCount} innerRadius={innerRadius} ringWidth={ringWidth} width={mode === 'allReceive' ? 1.5 : 2.5} />)}
        {isSliding && gestureStart && gestureCurrent && <ClockArrow from={gestureStart} to={gestureCurrent} day={ringCount} type={gestureStart === gestureCurrent ? 'self' : 'to'} playerCount={playerCount} innerRadius={innerRadius} ringWidth={ringWidth} width={3} />}
        <ClockCenter cx={cx} cy={cy} isVoting={isVoting} pendingNom={pendingNom} assignmentMode={assignmentMode || null} selectedReason={selectedReason} playerNo={playerNo} currentDay={currentDay} mode={mode} onStart={(e) => { const x = 'touches' in e ? e.touches[0].clientX : e.clientX; setCenterTouchX(x); setCenterSwiped(false); }} />
      </svg>
    </div>
  );
};

export default VoteHistoryClock;