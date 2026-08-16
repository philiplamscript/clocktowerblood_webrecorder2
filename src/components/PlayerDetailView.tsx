"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X } from 'lucide-react';

import { REASON_CYCLE, getFrontierDay, type NotepadTemplate, type PropTemplate, type IdentityMode, type ReviewRole, type RoleDetectMap, normalizeDetectStatus } from '../type';
import VoteHistoryClock from './popitems/VoteHistoryClock/VoteHistoryClock';
import DetailHeader from './player-detail/DetailHeader';
import AssignmentControls from './player-detail/AssignmentControls';
import NoteSection from './player-detail/NoteSection';
import ScriptStatusSection from './player-detail/ScriptStatusSection';
import StatusSection from './player-detail/StatusSection';

interface PlayerDetailViewProps {
  playerNo: number;
  setPlayerNo: (no: number) => void;
  playerCount: number;
  players: any[];
  deadPlayers: number[];
  updatePlayerInfo: (no: number, text: string) => void;
  updatePlayerProperty: (no: number, text: string) => void;
  togglePlayerAlive: (no: number) => void;
  updateDeathInfo: (no: number, day: number | null, reason: string | null) => void;
  chars: any;
  setChars: React.Dispatch<React.SetStateAction<any>>;
  nominations: any[];
  setNominations: (noms: any[]) => void;
  voteHistoryMode: 'vote' | 'beVoted' | 'allReceive';
  setVoteHistoryMode: (mode: 'vote' | 'beVoted' | 'allReceive') => void;
  setShowRoleSelector: (selector: any) => void;
  deaths: any[];
  setDeaths: (deaths: any[]) => void;
  currentDay: number;
  setCurrentDay: (day: number) => void;
  assignmentMode?: 'death' | 'property' | null;
  selectedReason?: string;
  selectedProperty?: string;
  onPlayerClick?: (num: number) => void;
  setAssignmentMode?: (mode: 'death' | 'property' | null) => void;
  setSelectedReason?: (reason: string) => void;
  setSelectedProperty?: (property: string) => void;
  notepadTemplates?: NotepadTemplate[];
  propTemplates?: PropTemplate[];
  identityMode?: IdentityMode;
  flowerGirlDetect: RoleDetectMap;
  townCrierDetect: RoleDetectMap;
  toggleFlowerGirlDetect: (day: number) => void;
  toggleTownCrierDetect: (day: number) => void;
}

const PlayerDetailView: React.FC<PlayerDetailViewProps> = (props) => {
  const [pendingNom, setPendingNom] = useState<{ f: string; t: string; voters: string[] } | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [filterDay, setFilterDay] = useState<number | 'all'>('all');
  const [showKeywords, setShowKeywords] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showDeathIcons, setShowDeathIcons] = useState(true);
  const [showAxis, setShowAxis] = useState(true);
  const [showArrows, setShowArrows] = useState(true);
  const [showProperties, setShowProperties] = useState(true);
  const [reviewRole, setReviewRole] = useState<ReviewRole | null>(null);
  const [nextDayArmed, setNextDayArmed] = useState(false);
  const skipClearOnMount = useRef(true);
  const nextDayArmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const frontierDay = useMemo(
    () => getFrontierDay(props.currentDay, props.nominations, props.deaths),
    [props.currentDay, props.nominations, props.deaths]
  );

  useEffect(() => {
    if (reviewRole) setFilterDay('all');
  }, [reviewRole]);

  useEffect(() => {
    return () => {
      if (nextDayArmTimer.current) clearTimeout(nextDayArmTimer.current);
    };
  }, []);

  useEffect(() => {
    if (skipClearOnMount.current) {
      skipClearOnMount.current = false;
      return;
    }
    setPendingNom(null);
    setIsVoting(false);
    setNextDayArmed(false);
    if (nextDayArmTimer.current) clearTimeout(nextDayArmTimer.current);
    setFilterDay((prev) => (prev === 'all' ? prev : props.currentDay));
  }, [props.currentDay]);

  const clearNextDayArm = () => {
    setNextDayArmed(false);
    if (nextDayArmTimer.current) {
      clearTimeout(nextDayArmTimer.current);
      nextDayArmTimer.current = null;
    }
  };

  const executeNextDay = () => {
    clearNextDayArm();
    const next = frontierDay + 1;
    props.setCurrentDay(next);
    setFilterDay(next);
    props.setAssignmentMode?.('death');
  };

  const armOrConfirmNextDay = () => {
    if (pendingNom || isVoting) return;
    if (nextDayArmed) {
      executeNextDay();
      return;
    }
    setNextDayArmed(true);
    if (nextDayArmTimer.current) clearTimeout(nextDayArmTimer.current);
    nextDayArmTimer.current = setTimeout(() => setNextDayArmed(false), 4000);
  };

  const handleDayPick = (val: number | 'all') => {
    if (val === 'all') {
      setFilterDay('all');
      return;
    }
    props.setCurrentDay(val);
    setFilterDay(val);
  };

  const handleToggleVotingPhase = () => {
    if (!pendingNom) return;
    clearNextDayArm();
    if (!isVoting) setIsVoting(true);
    else {
      const newNom = { id: Math.random().toString(36).substr(2, 9), day: props.currentDay, f: pendingNom.f, t: pendingNom.t, voters: pendingNom.voters.join(','), note: '' };
      props.setNominations([...props.nominations, newNom]);
      setPendingNom(null); setIsVoting(false);
    }
  };

  const toggleReviewDay = (day: number) => {
    if (reviewRole === 'flowerGirl') props.toggleFlowerGirlDetect(day);
    else if (reviewRole === 'townCrier') props.toggleTownCrierDetect(day);
  };

  const handleCenterTap = () => {
    if (pendingNom) {
      handleToggleVotingPhase();
      return;
    }
    if (nextDayArmed) {
      executeNextDay();
      return;
    }
    if (reviewRole) {
      toggleReviewDay(props.currentDay);
      return;
    }
  };

  const handleVoterToggle = (voterNo: string, forceAction?: 'add' | 'remove') => {
    if (!isVoting || !pendingNom) return;
    setPendingNom(prev => {
      if (!prev) return null;
      let voters = [...prev.voters];
      const exists = voters.includes(voterNo);
      if (forceAction === 'add' ? !exists : forceAction === 'remove' ? exists : true) {
        voters = (forceAction === 'remove' || (forceAction !== 'add' && exists)) ? voters.filter(v => v !== voterNo) : [...voters, voterNo];
      }
      return { ...prev, voters: voters.sort((a, b) => parseInt(a) - parseInt(b)) };
    });
  };

  const insertTemplate = (content: string) => {
    const cur = props.players.find(p => p.no === props.playerNo)?.inf || '';
    props.updatePlayerInfo(props.playerNo, cur + (cur ? '\n\n' : '') + content);
    setShowTemplates(false);
  };

  const updateDeathDay = (no: number, day: number) => {
    const existing = props.deaths.find(d => d.playerNo === no.toString());
    props.updateDeathInfo(no, day, existing?.reason || '⚔️');
  };

  const cycleDeathReason = () => {
    const exists = props.deaths.find(d => d.playerNo === props.playerNo.toString());
    const curReason = exists?.reason || '⚔️';
    const nextReason = REASON_CYCLE[(REASON_CYCLE.indexOf(curReason) + 1) % REASON_CYCLE.length];
    props.updateDeathInfo(props.playerNo, exists?.day || props.currentDay, nextReason);
  };

  const reviewDetectMap = reviewRole === 'flowerGirl'
    ? props.flowerGirlDetect
    : reviewRole === 'townCrier'
      ? props.townCrierDetect
      : {};

  const reviewStatus = normalizeDetectStatus(reviewDetectMap[props.currentDay] ?? 'DET');

  const currentPlayer = props.players.find(p => p.no === props.playerNo);
  const death = props.deaths.find(d => d.playerNo === props.playerNo.toString());
  const allRoles = ['Townsfolk', 'Outsider', 'Minion', 'Demon'].flatMap(cat => 
    props.chars[cat].map((c: any) => ({ role: c.name, category: cat })).filter((i: any) => i.role)
  );

  const remainingVoters = useMemo(() => {
    if (!isVoting || !pendingNom) return [];
    const voted = new Set(pendingNom.voters);
    return Array.from({ length: props.playerCount }, (_, i) => i + 1).filter(
      (n) => !voted.has(n.toString())
    );
  }, [isVoting, pendingNom, props.playerCount]);

  return (
    <div className="h-full bg-[var(--panel-color)] overflow-y-auto p-2 space-y-4 pb-24 transition-colors duration-500">
      <div className="bg-[var(--bg-color)] rounded-xl border border-[var(--border-color)] p-4 shadow-sm relative overflow-hidden flex flex-col items-center min-h-[420px] transition-colors duration-500">
        <div className="absolute inset-0 pointer-events-none opacity-100 z-0" style={{ backgroundImage: 'var(--bg-pattern)' }} />
        <div className="relative z-10 w-full flex flex-col items-center">
          <DetailHeader 
            isVoting={isVoting}
            filterDay={filterDay}
            frontierDay={frontierDay}
            currentDay={props.currentDay}
            onDayPick={handleDayPick}
            showDeathIcons={showDeathIcons} setShowDeathIcons={setShowDeathIcons}
            showAxis={showAxis} setShowAxis={setShowAxis}
            showProperties={showProperties} setShowProperties={setShowProperties}
            voteHistoryMode={props.voteHistoryMode} setVoteHistoryMode={props.setVoteHistoryMode}
            showArrows={showArrows} setShowArrows={setShowArrows}
            reviewRole={reviewRole} setReviewRole={setReviewRole}
          />

          <div className="relative w-full flex-1 flex flex-col items-center justify-center pt-2">
            <VoteHistoryClock 
              playerNo={props.playerNo} nominations={props.nominations} playerCount={props.playerCount} deadPlayers={props.deadPlayers} 
              mode={props.voteHistoryMode} players={props.players} deaths={props.deaths} filterDay={filterDay}
              onPlayerClick={props.onPlayerClick ?? (() => {})} pendingNom={pendingNom} isVoting={isVoting}
              onNominationSlideEnd={(f, t) => setPendingNom({ f, t, voters: [] })}
              onVoterToggle={handleVoterToggle} onToggleVotingPhase={handleCenterTap}
              currentDay={props.currentDay} setCurrentDay={props.setCurrentDay}
              frontierDay={frontierDay}
              onRequestNextDay={armOrConfirmNextDay}
              showDeathIcons={showDeathIcons} showAxis={showAxis}
              showProperties={showProperties}
              assignmentMode={props.assignmentMode} selectedReason={props.selectedReason} selectedProperty={props.selectedProperty}
              showArrows={showArrows}
              identityMode={props.identityMode}
              reviewRole={reviewRole}
              reviewStatus={reviewStatus}
              reviewDetectMap={reviewDetectMap}
              onReviewDayToggle={toggleReviewDay}
              nextDayArmed={nextDayArmed}
            />

            <div className="w-full mt-2 flex justify-center">
              <button
                type="button"
                disabled={!!pendingNom || isVoting}
                onClick={armOrConfirmNextDay}
                className={`px-4 h-8 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm transition-all active:scale-95 disabled:opacity-40 ${
                  nextDayArmed
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-[var(--header-color)] text-[var(--text-on-header)] hover:opacity-90'
                }`}
              >
                {nextDayArmed ? `Confirm → D${frontierDay + 1}` : `Next day → D${frontierDay + 1}`}
              </button>
            </div>

            <div className="absolute bottom-2 left-0 z-10">
              <AssignmentControls 
                assignmentMode={props.assignmentMode ?? null} setAssignmentMode={props.setAssignmentMode ?? (() => {})}
                selectedReason={props.selectedReason ?? '⚔️'} setSelectedReason={props.setSelectedReason ?? (() => {})}
                selectedProperty={props.selectedProperty ?? ''} setSelectedProperty={props.setSelectedProperty ?? (() => {})}
                propTemplates={props.propTemplates}
              />
            </div>

            {isVoting && pendingNom && remainingVoters.length > 0 && (
              <div className="absolute bottom-2 right-0 z-20 max-w-[55%] flex flex-wrap items-center justify-end gap-1">
                <span className="text-[8px] font-black uppercase tracking-widest text-[var(--muted-color)]">Left:</span>
                {remainingVoters.map((n) => {
                  const isDead = props.deadPlayers.includes(n);
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleVoterToggle(n.toString())}
                      className={`min-w-[24px] h-6 px-1.5 rounded-md text-[9px] font-black border transition-all active:scale-90 ${
                        isDead
                          ? 'bg-black/5 border-[var(--border-color)] text-[var(--muted-color)] opacity-60'
                          : 'bg-[var(--panel-color)] border-[var(--border-color)] text-[var(--text-on-panel)] hover:border-[var(--accent-color)]'
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            )}

            {pendingNom && !isVoting && (
              <div className="absolute bottom-0 bg-[var(--accent-color)] text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-2 animate-bounce shadow-lg z-20">
                {pendingNom.f} ➔ {pendingNom.t}
                <button onClick={() => setPendingNom(null)} className="ml-1 bg-white/20 hover:bg-white/30 p-1 rounded-md transition-colors"><X size={10} /></button>
              </div>
            )}
          </div>
        </div>
      </div>

      <NoteSection 
        currentPlayer={currentPlayer} playerNo={props.playerNo} updatePlayerInfo={props.updatePlayerInfo}
        showKeywords={showKeywords} setShowKeywords={setShowKeywords} showTemplates={showTemplates} setShowTemplates={setShowTemplates}
        allRoles={allRoles} categoryBg={{ Townsfolk: 'bg-blue-100', Outsider: 'bg-blue-50', Minion: 'bg-orange-50', Demon: 'bg-red-100' }}
        notepadTemplates={props.notepadTemplates ?? []} insertTemplate={insertTemplate}
      />

      <StatusSection 
        isDead={props.deadPlayers.includes(props.playerNo)} togglePlayerAlive={props.togglePlayerAlive}
        playerNo={props.playerNo} death={death} currentDay={props.currentDay}
        updateDeathDay={updateDeathDay}
        cycleDeathReason={cycleDeathReason}
        currentPlayer={currentPlayer} updatePlayerProperty={props.updatePlayerProperty}
      />

      <ScriptStatusSection chars={props.chars} setChars={props.setChars} />
      
      <div className="h-16" />
      <div className="h-16" />
    </div>
  );
};

export default PlayerDetailView;
