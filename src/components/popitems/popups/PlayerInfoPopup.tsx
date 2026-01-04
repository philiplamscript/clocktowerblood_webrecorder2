"use client";

import React, { useState } from 'react';
import { 
  Skull,
  Vote,
  X,
  Plus,
  Calendar,
  Tag
} from 'lucide-react';

import { REASON_CYCLE } from '../../../type';
import TextRotaryPicker from '../../pickers/RotaryPicker/TextRotaryPicker';
import VoteHistoryClock from '../VoteHistoryClock';

interface PlayerInfoPopupProps {
  popupPlayerNo: number | null;
  setPopupPlayerNo: (no: number | null) => void;
  playerCount: number;
  players: any[];
  deadPlayers: number[];
  updatePlayerInfo: (no: number, text: string) => void;
  updatePlayerProperty: (no: number, text: string) => void;
  togglePlayerAlive: (no: number) => void;
  chars: any;
  nominations: any[];
  setNominations: (noms: any[]) => void;
  voteHistoryMode: 'vote' | 'beVoted';
  setVoteHistoryMode: (mode: 'vote' | 'beVoted') => void;
  setShowRoleSelector: (selector: { playerNo: number; roles: { role: string; category: string }[] } | null) => void;
  deaths: any[];
  setDeaths: (deaths: any[]) => void;
  currentDay: number;
}

const PlayerInfoPopup: React.FC<PlayerInfoPopupProps> = ({
  popupPlayerNo,
  setPopupPlayerNo,
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
  // Local interaction state
  const [pendingNom, setPendingNom] = useState<{ f: string; t: string; voters: string[] } | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [filterDay, setFilterDay] = useState<number | 'all'>('all');

  if (popupPlayerNo === null) return null;

  const handleToggleVotingPhase = () => {
    if (!pendingNom) return;
    
    if (!isVoting) {
      setIsVoting(true);
    } else {
      // Save the nomination
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
        // Toggle behavior
        voters = hasVoter ? voters.filter(v => v !== voterNo) : [...voters, voterNo];
      }
      
      return { ...prev, voters: voters.sort((a, b) => parseInt(a) - parseInt(b)) };
    });
  };

  const handleNominationSlideEnd = (from: string, to: string) => {
    setPendingNom({ f: from, t: to, voters: [] });
    setIsVoting(false);
  };

  const closePopup = () => {
    setPendingNom(null);
    setIsVoting(false);
    setPopupPlayerNo(null);
  };

  const currentPlayer = players.find(p => p.no === popupPlayerNo);
  const dayOptions = ['ALL', ...Array.from({ length: currentDay }, (_, i) => `D${i + 1}`)];
  const currentFilterText = filterDay === 'all' ? 'ALL' : `D${filterDay}`;

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={closePopup}>
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-[95vw] max-h-[95vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Player Ribbon */}
        <div className="flex-none bg-slate-800 border-b border-slate-700 p-2 shadow-inner">
          <div className="flex flex-wrap items-center gap-1 justify-center">
            {Array.from({ length: playerCount }, (_, i) => i + 1).map(num => {
              const isDead = deadPlayers.includes(num);
              const hasInfo = players.find(p => p.no === num)?.inf !== '';
              return (
                <button 
                  key={num} 
                  onClick={() => setPopupPlayerNo(num)}
                  className={`flex-none w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all border shadow-sm ${
                    num === popupPlayerNo
                      ? 'bg-red-600 text-white border-red-400 scale-110 z-10'
                      : isDead 
                        ? 'bg-slate-900 text-slate-500 border-red-900/50 grayscale' 
                        : hasInfo 
                          ? 'bg-blue-600 text-white border-blue-400' 
                          : 'bg-slate-700 text-slate-300 border-slate-600'
                  } active:scale-90`}
                >
                  {isDead ? <Skull size={10} /> : num}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column: Data & Info */}
            <div className="space-y-4">
              {/* Status Section */}
              <div className="bg-slate-50 rounded border p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Skull size={14} className="text-red-500" />
                    <span className="text-xs font-black text-slate-600 uppercase">Status & Properties</span>
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  <button 
                    onClick={() => togglePlayerAlive(popupPlayerNo)}
                    className={`flex-1 py-3 rounded text-xs font-black uppercase transition-colors ${deadPlayers.includes(popupPlayerNo) ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
                  >
                    {deadPlayers.includes(popupPlayerNo) ? 'DEAD' : 'ALIVE'}
                  </button>
                  <div className="flex-1 flex items-center bg-white border rounded px-3 h-12">
                    <Tag size={12} className="text-slate-400 mr-2" />
                    <input 
                      type="text" 
                      value={currentPlayer?.property || ''} 
                      onChange={(e) => updatePlayerProperty(popupPlayerNo, e.target.value)}
                      placeholder="Props (Good|⭐)"
                      className="bg-transparent border-none p-0 text-xs font-bold focus:ring-0 w-full"
                    />
                  </div>
                </div>
                {deadPlayers.includes(popupPlayerNo) && (
                  <div className="flex items-center gap-3 bg-white rounded border p-2 shadow-sm">
                    <span className="text-xs font-black text-red-600 uppercase italic tracking-tighter whitespace-nowrap">Day {currentPlayer?.day}</span>
                    <div className="flex-1 flex items-center justify-around gap-1">
                      {REASON_CYCLE.map(reason => {
                        const isSelected = currentPlayer?.reason === reason;
                        return (
                          <button 
                            key={reason}
                            onClick={() => {
                              const death = deaths.find(d => parseInt(d.playerNo) === popupPlayerNo);
                              if (death) {
                                setDeaths(deaths.map(d => d.id === death.id ? { ...d, reason: reason } : d));
                              }
                            }}
                            className={`w-10 h-10 flex items-center justify-center text-lg rounded transition-all ${isSelected ? 'bg-red-600 shadow-inner scale-110' : 'bg-slate-50 hover:bg-slate-100 grayscale opacity-40 hover:opacity-100 hover:grayscale-0'}`}
                          >
                            {reason}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Player Notepad */}
              <textarea 
                autoFocus
                className="w-full min-h-[200px] border-none bg-slate-50 rounded p-3 text-sm focus:ring-1 focus:ring-blue-500/50 resize-none font-medium leading-relaxed"
                placeholder="Enter player info/role/reads..."
                value={currentPlayer?.inf || ''}
                onChange={(e) => updatePlayerInfo(popupPlayerNo, e.target.value)}
              />

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const allRoles = [
                      ...chars.Townsfolk.map(c => ({ role: c.name, category: 'Townsfolk' })).filter(item => item.role),
                      ...chars.Outsider.map(c => ({ role: c.name, category: 'Outsider' })).filter(item => item.role),
                      ...chars.Minion.map(c => ({ role: c.name, category: 'Minion' })).filter(item => item.role),
                      ...chars.Demon.map(c => ({ role: c.name, category: 'Demon' })).filter(item => item.role)
                    ];
                    setShowRoleSelector({ playerNo: popupPlayerNo, roles: allRoles });
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded text-xs font-black uppercase transition-colors"
                >
                  Keywords
                </button>
                {pendingNom && (
                  <button 
                    onClick={() => { setPendingNom(null); setIsVoting(false); }}
                    className="bg-slate-200 text-slate-600 px-4 py-3 rounded text-xs font-black uppercase"
                  >
                    Cancel Nom
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Large Interaction Clock */}
            <div className="bg-slate-50 rounded border p-4 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Vote size={16} className="text-blue-500" />
                  <span className="text-xs font-black text-slate-600 uppercase">
                    {isVoting ? 'Voting Mode' : 'Vote History'}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  {!isVoting && !pendingNom && (
                    <div className="flex items-center gap-1 bg-white border rounded px-2 h-8">
                      <Calendar size={12} className="text-slate-400" />
                      <div className="w-12">
                        <TextRotaryPicker 
                          value={currentFilterText} 
                          options={dayOptions} 
                          onChange={(val) => setFilterDay(val === 'ALL' ? 'all' : parseInt(val.replace('D', '')))}
                          color="text-slate-700"
                        />
                      </div>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => setVoteHistoryMode(voteHistoryMode === 'vote' ? 'beVoted' : 'vote')}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded text-[10px] font-bold uppercase"
                    disabled={isVoting}
                  >
                    {voteHistoryMode === 'vote' ? 'Vote Count' : 'Be Voted Count'}
                  </button>
                </div>
              </div>
              
              <div className="flex-1 w-full flex items-center justify-center">
                <VoteHistoryClock 
                  playerNo={popupPlayerNo} 
                  nominations={nominations} 
                  playerCount={playerCount} 
                  deadPlayers={deadPlayers} 
                  mode={voteHistoryMode} 
                  players={players}
                  deaths={deaths}
                  filterDay={filterDay}
                  onPlayerClick={(num) => setPopupPlayerNo(num)}
                  pendingNom={pendingNom}
                  isVoting={isVoting}
                  onNominationSlideEnd={handleNominationSlideEnd}
                  onVoterToggle={handleVoterToggle}
                  onToggleVotingPhase={handleToggleVotingPhase}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfoPopup;