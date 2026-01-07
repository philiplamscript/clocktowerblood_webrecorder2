"use client";

import React, { useState } from 'react';
import { 
  Skull,
  Vote,
  Tag,
  Calendar,
  Key,
  X
} from 'lucide-react';

import { REASON_CYCLE } from '../type';
import TextRotaryPicker from './pickers/RotaryPicker/TextRotaryPicker';
import VoteHistoryClock from './popitems/VoteHistoryClock';

interface PlayerDetailViewProps {
  playerNo: number;
  setPlayerNo: (no: number) => void;
  playerCount: number;
  players: any[];
  deadPlayers: number[];
  updatePlayerInfo: (no: number, text: string) => void;
  updatePlayerProperty: (no: number, text: string) => void;
  togglePlayerAlive: (no: number) => void;
  chars: any;
  nominations: any[];
  setNominations: (noms: any[]) => void;
  voteHistoryMode: 'vote' | 'beVoted' | 'allReceive';
  setVoteHistoryMode: (mode: 'vote' | 'beVoted' | 'allReceive') => void;
  setShowRoleSelector: (selector: { playerNo: number; roles: { role: string; category: string }[] } | null) => void;
  deaths: any[];
  setDeaths: (deaths: any[]) => void;
  currentDay: number;
}

const PlayerDetailView: React.FC<PlayerDetailViewProps> = ({
  playerNo,
  setPlayerNo,
  playerCount,
  players,
  deadPlayers,
  updatePlayerInfo,
  updatePlayerProperty,
  togglePlayerAlive,
  chars,
  nominations,
  setNominations,
  voteHistoryMode,
  setVoteHistoryMode,
  setShowRoleSelector,
  deaths,
  setDeaths,
  currentDay
}) => {
  const [pendingNom, setPendingNom] = useState<{ f: string; t: string; voters: string[] } | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [filterDay, setFilterDay] = useState<number | 'all'>('all');
  const [showKeywords, setShowKeywords] = useState(false);

  const handleToggleVotingPhase = () => {
    if (!pendingNom) return;
    
    if (!isVoting) {
      setIsVoting(true);
    } else {
      const newNom = {
        id: Math.random().toString(36).substr(2, 9),
        day: currentDay,
        f: pendingNom.f,
        t: pendingNom.t,
        voters: pendingNom.voters.join(','),
        note: ''
      };
      setNominations([...nominations, newNom]);
      setPendingNom(null);
      setIsVoting(false);
    }
  };

  const handleVoterToggle = (voterNo: string, forceAction?: 'add' | 'remove') => {
    if (!isVoting || !pendingNom) return;
    setPendingNom(prev => {
      if (!prev) return null;
      let voters = [...prev.voters];
      const hasVoter = voters.includes(voterNo);
      
      if (forceAction === 'add') {
        if (!hasVoter) voters.push(voterNo);
      } else if (forceAction === 'remove') {
        voters = voters.filter(v => v !== voterNo);
      } else {
        voters = hasVoter ? voters.filter(v => v !== voterNo) : [...voters, voterNo];
      }
      
      return { ...prev, voters: voters.sort((a, b) => parseInt(a) - parseInt(b)) };
    });
  };

  const handleNominationSlideEnd = (from: string, to: string) => {
    setPendingNom({ f: from, t: to, voters: [] });
    setIsVoting(false);
  };

  const currentPlayer = players.find(p => p.no === playerNo);
  const isDead = deadPlayers.includes(playerNo);
  const dayOptions = ['ALL', ...Array.from({ length: currentDay }, (_, i) => `D${i + 1}`)];
  const currentFilterText = filterDay === 'all' ? 'ALL' : `D${filterDay}`;

  const modeLabels = {
    vote: 'Votes',
    beVoted: 'Received',
    allReceive: 'All Global'
  };

  const death = deaths.find(d => d.playerNo === playerNo.toString());

  const updateDeathDay = (playerNo: number, newDay: number) => {
    setDeaths(deaths.map(d => d.playerNo === playerNo.toString() ? { ...d, day: newDay } : d));
  };

  const updateDeathReason = (playerNo: number, newReason: string) => {
    setDeaths(deaths.map(d => d.playerNo === playerNo.toString() ? { ...d, reason: newReason } : d));
  };

  const cycleDeathReason = () => {
    const currentReason = death?.reason || '⚔️';
    const currentIndex = REASON_CYCLE.indexOf(currentReason);
    const nextIndex = (currentIndex + 1) % REASON_CYCLE.length;
    updateDeathReason(playerNo, REASON_CYCLE[nextIndex]);
  };

  const allRoles = [
    ...chars.Townsfolk.map((c: any) => ({ role: c.name, category: 'Townsfolk' })).filter((item: any) => item.role),
    ...chars.Outsider.map((c: any) => ({ role: c.name, category: 'Outsider' })).filter((item: any) => item.role),
    ...chars.Minion.map((c: any) => ({ role: c.name, category: 'Minion' })).filter((item: any) => item.role),
    ...chars.Demon.map((c: any) => ({ role: c.name, category: 'Demon' })).filter((item: any) => item.role)
  ];

  const categoryBg = {
    Townsfolk: 'bg-blue-100 hover:bg-blue-200',
    Outsider: 'bg-blue-50 hover:bg-blue-100',
    Minion: 'bg-orange-50 hover:bg-orange-100',
    Demon: 'bg-red-100 hover:bg-red-200'
  };

  return (
    <div className="h-full bg-white overflow-hidden">
      <div className="h-full overflow-y-auto p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            {/* Voting Patterns Section */}
            <div className="bg-slate-50 rounded-lg border p-4 space-y-3 shadow-sm flex flex-col items-center">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Vote size={14} className="text-blue-600" />
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
                    {isVoting ? 'Voting Recording' : 'Voting Patterns'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {!isVoting && !pendingNom && (
                    <div className="flex items-center gap-1 bg-white border rounded-full px-2 h-7 shadow-sm">
                      <Calendar size={12} className="text-slate-400" />
                      <div className="w-10">
                        <TextRotaryPicker 
                          value={currentFilterText} 
                          options={dayOptions} 
                          onChange={(val) => setFilterDay(val === 'ALL' ? 'all' : parseInt(val.replace('D', '')))}
                          color="text-slate-800"
                        />
                      </div>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => {
                      if (voteHistoryMode === 'vote') setVoteHistoryMode('beVoted');
                      else if (voteHistoryMode === 'beVoted') setVoteHistoryMode('allReceive');
                      else setVoteHistoryMode('vote');
                    }}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-full text-[9px] font-black uppercase transition-colors shadow-sm min-w-[80px]"
                    disabled={isVoting}
                  >
                    {modeLabels[voteHistoryMode]}
                  </button>
                </div>
              </div>
              
              <VoteHistoryClock 
                playerNo={playerNo} 
                nominations={nominations} 
                playerCount={playerCount} 
                deadPlayers={deadPlayers} 
                mode={voteHistoryMode} 
                players={players}
                deaths={deaths}
                filterDay={filterDay}
                onPlayerClick={(num) => setPlayerNo(num)}
                pendingNom={pendingNom}
                isVoting={isVoting}
                onNominationSlideEnd={handleNominationSlideEnd}
                onVoterToggle={handleVoterToggle}
                onToggleVotingPhase={handleToggleVotingPhase}
                currentDay={currentDay}
              />

              {pendingNom && !isVoting && (
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 animate-bounce shadow-lg">
                  <span className="w-2 h-2 bg-white rounded-full" />
                  Nomination Ready: {pendingNom.f} ➔ {pendingNom.t}
                  <button 
                    onClick={() => setPendingNom(null)} 
                    className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-[8px] font-bold flex items-center gap-1"
                  >
                    <X size={10} /> CANCEL
                  </button>
                </div>
              )}
            </div>

            {/* Player Note Section with Keyword button on the right */}
            <div className="flex gap-2 items-start">
              <textarea 
                className="flex-1 min-h-[150px] border border-slate-200 bg-white rounded-lg p-4 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none font-medium leading-relaxed shadow-sm transition-all"
                placeholder="Type social reads, role claims, or night info here..."
                value={currentPlayer?.inf || ''}
                onChange={(e) => updatePlayerInfo(playerNo, e.target.value)}
              />
              <button 
                onClick={() => setShowKeywords(!showKeywords)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-sm transition-all"
              >
                <Key size={14} />
              </button>
            </div>

            {/* Expandable Keywords Section */}
            {showKeywords && (
              <div className="bg-white border rounded-lg p-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                {allRoles.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <h4 className="text-[8px] font-black text-blue-400 uppercase">Townsfolk</h4>
                      {allRoles.filter(r => r.category === 'Townsfolk').map((item, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => {
                            updatePlayerInfo(playerNo, (currentPlayer?.inf || '') + (currentPlayer?.inf ? '\n' : '') + item.role);
                            setShowKeywords(false);
                          }}
                          className={`${categoryBg[item.category as keyof typeof categoryBg]} text-slate-900 px-2 py-1 rounded text-[9px] font-bold transition-colors text-left`}
                        >
                          {item.role}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[8px] font-black text-blue-200 uppercase">Outsider</h4>
                      {allRoles.filter(r => r.category === 'Outsider').map((item, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => {
                            updatePlayerInfo(playerNo, (currentPlayer?.inf || '') + (currentPlayer?.inf ? '\n' : '') + item.role);
                            setShowKeywords(false);
                          }}
                          className={`${categoryBg[item.category as keyof typeof categoryBg]} text-slate-900 px-2 py-1 rounded text-[9px] font-bold transition-colors text-left`}
                        >
                          {item.role}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[8px] font-black text-red-400 uppercase">Minions & Demons</h4>
                      {allRoles.filter(r => r.category === 'Minion' || r.category === 'Demon').map((item, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => {
                            updatePlayerInfo(playerNo, (currentPlayer?.inf || '') + (currentPlayer?.inf ? '\n' : '') + item.role);
                            setShowKeywords(false);
                          }}
                          className={`${categoryBg[item.category as keyof typeof categoryBg]} text-slate-900 px-2 py-1 rounded text-[9px] font-bold transition-colors text-left`}
                        >
                          {item.role}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs">No roles defined yet.</p>
                )}
              </div>
            )}

            {/* Death Status and Prop in one row, always visible */}
            <div className="flex items-center gap-2">
              {isDead ? (
                <div className="flex-[8] flex items-center gap-1 h-10">
                  <button 
                    onClick={() => togglePlayerAlive(playerNo)} 
                    className="flex-1 h-full bg-red-600 text-white rounded-lg flex items-center justify-center shadow-sm transition-all"
                  >
                    <Skull size={14} />
                  </button>
                  <input 
                    type="number" 
                    value={death?.day || currentDay} 
                    onChange={(e) => updateDeathDay(playerNo, parseInt(e.target.value) || currentDay)} 
                    className="flex-1 h-full bg-white border rounded-lg text-center text-[10px] font-black focus:ring-0" 
                  />
                  <button 
                    onClick={cycleDeathReason}
                    className="flex-[2] h-full bg-white border rounded-lg text-center text-[12px] font-black hover:bg-slate-50 transition-colors"
                  >
                    {death?.reason || '⚔️'}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => togglePlayerAlive(playerNo)}
                  className="flex-[8] h-10 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 shadow-sm bg-emerald-600 text-white"
                >
                  ALIVE
                </button>
              )}
              <div className="flex-[2] flex items-center bg-white border rounded-lg px-3 h-10 shadow-sm">
                <Tag size={12} className="text-slate-400 mr-2" />
                <input 
                  type="text" 
                  value={currentPlayer?.property || ''} 
                  onChange={(e) => updatePlayerProperty(playerNo, e.target.value)}
                  placeholder="Properties"
                  className="bg-transparent border-none p-0 text-[11px] font-bold focus:ring-0 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailView;