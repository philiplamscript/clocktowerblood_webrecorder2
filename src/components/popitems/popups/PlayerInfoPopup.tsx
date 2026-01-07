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
  const isDead = deadPlayers.includes(popupPlayerNo);
  const dayOptions = ['ALL', ...Array.from({ length: currentDay }, (_, i) => `D${i + 1}`)];
  const currentFilterText = filterDay === 'all' ? 'ALL' : `D${filterDay}`;

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-[2px]" onClick={closePopup}>
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-[400px] max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Player Ribbon */}
        <div className="flex-none bg-slate-800 border-b border-slate-700 p-2 shadow-inner">
          <div className="flex flex-wrap items-center gap-1 justify-center">
            {Array.from({ length: playerCount }, (_, i) => i + 1).map(num => {
              const numIsDead = deadPlayers.includes(num);
              const hasInfo = players.find(p => p.no === num)?.inf !== '';
              return (
                <button 
                  key={num} 
                  onClick={() => setPopupPlayerNo(num)}
                  className={`flex-none w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black transition-all border shadow-sm ${
                    num === popupPlayerNo
                      ? 'bg-red-600 text-white border-red-400'
                      : numIsDead 
                        ? 'bg-slate-900 text-slate-500 border-red-900/50 grayscale' 
                        : hasInfo 
                          ? 'bg-blue-600 text-white border-blue-400' 
                          : 'bg-slate-700 text-slate-300 border-slate-600'
                  } active:scale-90`}
                >
                  {numIsDead ? <Skull size={8} /> : num}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Status Section */}
          <div className="bg-slate-50 rounded border p-2">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <Skull size={12} className="text-red-500" />
                <span className="text-[9px] font-black text-slate-600 uppercase">Status & Properties</span>
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <button 
                onClick={() => togglePlayerAlive(popupPlayerNo)}
                className={`flex-1 h-9 rounded text-[10px] font-black uppercase transition-colors flex items-center justify-center gap-2 ${isDead ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
              >
                {isDead ? <Skull size={12} /> : null}
                {isDead ? 'DEAD' : 'ALIVE'}
              </button>
              <div className="flex-[1.5] flex items-center bg-white border rounded px-2 h-9">
                <Tag size={10} className="text-slate-400 mr-2" />
                <input 
                  type="text" 
                  value={currentPlayer?.property || ''} 
                  onChange={(e) => updatePlayerProperty(popupPlayerNo, e.target.value)}
                  placeholder="Props (Good|⭐)"
                  className="bg-transparent border-none p-0 text-[10px] font-bold focus:ring-0 w-full"
                />
              </div>
            </div>
            {deadPlayers.includes(popupPlayerNo) && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-red-600">Day {currentPlayer?.day}</span>
                <div className="flex-1 h-8">
                  <TextRotaryPicker 
                    value={currentPlayer?.reason || ''} 
                    options={REASON_CYCLE} 
                    onChange={(val) => {
                      const death = deaths.find(d => parseInt(d.playerNo) === popupPlayerNo);
                      if (death) {
                        setDeaths(deaths.map(d => d.id === death.id ? { ...d, reason: val } : d));
                      }
                    }}
                    color="text-red-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Player Notepad */}
          <textarea 
            className="w-full min-h-[100px] border-none bg-slate-50 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500/50 resize-none font-medium leading-relaxed"
            placeholder="Enter player info/role/reads..."
            value={currentPlayer?.inf || ''}
            onChange={(e) => updatePlayerInfo(popupPlayerNo, e.target.value)}
          />

          {/* Role Selector */}
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
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-[10px] font-black uppercase transition-colors"
            >
              Keywords
            </button>
            {pendingNom && (
              <button 
                onClick={() => { setPendingNom(null); setIsVoting(false); }}
                className="bg-slate-200 text-slate-600 px-3 py-2 rounded text-[10px] font-black uppercase"
              >
                Cancel Nom
              </button>
            )}
          </div>

          {/* Vote History / Interaction Clock */}
          <div className="bg-slate-50 rounded border p-2 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Vote size={12} className="text-blue-500" />
                <span className="text-[9px] font-black text-slate-600 uppercase">
                  {isVoting ? 'Voting Mode' : 'History'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Day Filter Rotary */}
                {!isVoting && !pendingNom && (
                  <div className="flex items-center gap-1 bg-white border rounded px-1 h-6">
                    <Calendar size={10} className="text-slate-400" />
                    <div className="w-8">
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
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded text-[8px] font-bold uppercase"
                  disabled={isVoting}
                >
                  {voteHistoryMode === 'vote' ? 'Votes' : 'Received'}
                </button>
              </div>
            </div>
            
            <VoteHistoryClock 
              playerNo={popupPlayerNo} 
              nominations={nominations} 
              playerCount={playerCount} 
              deadPlayers={deadPlayers} 
              mode={voteHistoryMode} 
              players={players}
              deaths={deaths}
              filterDay={filterDay}
              // Interactive Props
              onPlayerClick={(num) => setPopupPlayerNo(num)}
              pendingNom={pendingNom}
              isVoting={isVoting}
              onNominationSlideEnd={handleNominationSlideEnd}
              onVoterToggle={handleVoterToggle}
              onToggleVotingPhase={handleToggleVotingPhase}
              currentDay={currentDay}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfoPopup;