"use client";

import React, { useState, useRef, useMemo } from 'react';
import ClockFace from './ClockFace';
import PlayerSlices from './PlayerSlices';
import VoteArrows from './VoteArrows';
import ClockCenter from './ClockCenter';
import { cx, cy, innerRadius, outerRadius } from './utils';

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
  const [gestureStart, setGestureStart] = useState<number | null>(null);
  const [gestureCurrent, setGestureCurrent] = useState<number | null>(null);
  const [isSliding, setIsSliding] = useState(false);
  const [dragAction, setDragAction] = useState<'add' | 'remove' | null>(null);
  const [centerTouchX, setCenterTouchX] = useState<number | null>(null);
  const [centerSwiped, setCenterSwiped] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const lastEventTime = useRef<number>(0);

  const maxDay = useMemo(() => Math.max(...props.nominations.map(n => n.day), 1, props.currentDay), [props.nominations, props.currentDay]);
  const ringCount = Math.max(maxDay, 1);
  const ringWidth = (outerRadius - innerRadius) / ringCount;

  // Calculate offset to place reviewing player on the left (180 degrees)
  const baseAngle = ((props.playerNo - 1) * (360 / props.playerCount)) - 90;
  const offset = 180 - baseAngle;

  const data = useMemo(() => {
    const votedAtDay: Record<string, Record<number, number>> = {}; 
    const arrowData: any[] = [];
    const playerStr = props.playerNo.toString();

    props.nominations.forEach(n => {
      const day = n.day;
      if (props.filterDay !== 'all' && day !== props.filterDay) return;
      const voteCount = n.voters ? n.voters.split(',').filter((v: string) => v).length : 0;

      if (props.mode === 'allReceive') {
        if (n.t && n.t !== '-') {
          if (!votedAtDay[n.t]) votedAtDay[n.t] = {};
          votedAtDay[n.t][day] = voteCount;
        }
        if (n.f && n.f !== '-' && n.t && n.t !== '-') {
          const fromNum = parseInt(n.f), toNum = parseInt(n.t);
          let type: 'to' | 'from' | 'self' = fromNum === toNum ? 'self' : toNum === props.playerNo ? 'from' : fromNum === props.playerNo ? 'to' : 'to';
          arrowData.push({ from: fromNum, to: toNum, day, type });
        }
      } else if (props.mode === 'vote') {
        if (n.voters.split(',').includes(playerStr) && n.t && n.t !== '-' && n.t !== playerStr) {
          if (!votedAtDay[n.t]) votedAtDay[n.t] = {};
          votedAtDay[n.t][day] = voteCount;
        }
        if (n.f === playerStr) arrowData.push({ from: props.playerNo, to: parseInt(n.t), day, type: n.f === n.t ? 'self' : 'to' });
      } else {
        if (n.t === playerStr) {
          n.voters.split(',').forEach((v: string) => {
            if (v && v !== playerStr) {
              if (!votedAtDay[v]) votedAtDay[v] = {};
              votedAtDay[v][day] = voteCount;
            }
          });
          if (n.f && n.f !== '-') arrowData.push({ from: parseInt(n.f), to: props.playerNo, day, type: n.f === n.t ? 'self' : 'from' });
        }
      }
    });
    return { votedAtDay, arrowData };
  }, [props.nominations, props.playerNo, props.mode, props.filterDay]);

  const getPlayerAtPos = (clientX: number, clientY: number) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const x = clientX - (rect.left + rect.width / 2), y = clientY - (rect.top + rect.height / 2);
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90 - offset; // Adjust for offset
    if (angle < 0) angle += 360;
    return (Math.floor(angle / (360 / props.playerCount)) % props.playerCount) + 1;
  };

  const handleStart = (num: number, e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    if (now - lastEventTime.current < 100) return;
    lastEventTime.current = now;
    if (e.cancelable) e.preventDefault();

    if (props.isVoting) {
      const action = props.pendingNom?.voters.includes(num.toString()) ? 'remove' : 'add';
      setDragAction(action); setGestureStart(num); setGestureCurrent(num);
      props.onVoterToggle(num.toString(), action);
      return;
    }
    setGestureStart(num); setGestureCurrent(num); setIsSliding(false);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (centerTouchX !== null) {
      const deltaX = clientX - centerTouchX;
      if (Math.abs(deltaX) > 40 && !centerSwiped) {
        if (deltaX > 0) props.setCurrentDay?.(Math.max(1, props.currentDay - 1));
        else props.setCurrentDay?.(props.currentDay + 1);
        setCenterSwiped(true);
      }
      return;
    }
    if (gestureStart === null) return;
    const current = getPlayerAtPos(clientX, clientY);
    if (!current) return;
    if (props.isVoting) {
      if (current !== gestureCurrent) { setGestureCurrent(current); props.onVoterToggle(current.toString(), dragAction!); }
    } else if (current !== gestureCurrent) { setGestureCurrent(current); setIsSliding(true); }
  };

  const handleEnd = () => {
    if (centerTouchX !== null) { if (!centerSwiped) props.onToggleVotingPhase(); setCenterTouchX(null); setCenterSwiped(false); return; }
    if (gestureStart !== null) {
      if (!props.isVoting && !isSliding) props.onPlayerClick(gestureStart);
      else if (!props.isVoting && isSliding && gestureCurrent !== null) props.onNominationSlideEnd(gestureStart.toString(), gestureCurrent.toString());
    }
    setGestureStart(null); setGestureCurrent(null); setIsSliding(false); setDragAction(null);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <svg ref={svgRef} viewBox="0 0 288 288" className="w-80 h-80 touch-none select-none drop-shadow-sm"
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)} onMouseUp={handleEnd} onMouseLeave={handleEnd}
        onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)} onTouchEnd={handleEnd}
      >
        <defs>
          <radialGradient id="playerSpotlight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="1" />
            <stop offset="50%" stopColor="#fef3c7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fde68a" stopOpacity="0.4" />
          </radialGradient>
        </defs>
        <ClockFace ringCount={ringCount} ringWidth={ringWidth} showAxis={props.showAxis ?? true} />
        <PlayerSlices 
          playerCount={props.playerCount} playerNo={props.playerNo} isVoting={props.isVoting} pendingNomVoters={props.pendingNom?.voters ?? []}
          deaths={props.deaths} ringCount={ringCount} ringWidth={ringWidth} votedAtDay={data.votedAtDay} mode={props.mode} 
          showDeathIcons={props.showDeathIcons} assignmentMode={props.assignmentMode ?? null} onStart={handleStart} offset={offset}
        />
        <VoteArrows 
          arrowData={data.arrowData} playerCount={props.playerCount} playerNo={props.playerNo} isVoting={props.isVoting} 
          isSliding={isSliding} gestureStart={gestureStart} gestureCurrent={gestureCurrent} pendingNom={props.pendingNom} 
          currentDay={props.currentDay} mode={props.mode} ringWidth={ringWidth} offset={offset}
        />
        <ClockCenter 
          isVoting={props.isVoting} pendingNom={props.pendingNom} assignmentMode={props.assignmentMode ?? null} 
          selectedReason={props.selectedReason} playerNo={props.playerNo} currentDay={props.currentDay} mode={props.mode}
          onStart={(e) => { e.stopPropagation(); setCenterTouchX('touches' in e ? e.touches[0].clientX : e.clientX); setCenterSwiped(false); }}
        />
      </svg>
    </div>
  );
};

export default VoteHistoryClock;