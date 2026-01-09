"use client";

import React, { useState } from 'react';
import { 
  Skull,
  Vote,
  Tag,
  Calendar,
  Key,
  X,
  Grid3X3,
  FilePlus2
} from 'lucide-react';

import { REASON_CYCLE, type NotepadTemplate } from '../type';
import TextRotaryPicker from './pickers/RotaryPicker/TextRotaryPicker';
import VoteHistoryClock from './popitems/VoteHistoryClock/VoteHistoryClock';

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
  setCurrentDay: (day: number) => void;
  assignmentMode?: 'death' | 'property' | null;
  selectedReason?: string;
  selectedProperty?: string;
  onPlayerClick?: (num: number) => void;
  setAssignmentMode?: (mode: 'death' | 'property' | null) => void;
  setSelectedReason?: (reason: string) => void;
  setSelectedProperty?: (property: string) => void;
  notepadTemplates?: NotepadTemplate[];
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
  currentDay,
  setCurrentDay,
  assignmentMode,
  selectedReason,
  selectedProperty,
  onPlayerClick,
  setAssignmentMode,
  setSelectedReason,
  setSelectedProperty,
  notepadTemplates = []
}) => {
  const [pendingNom, setPendingNom] = useState<{ f: string; t: string; voters: string[] } | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [filterDay, setFilterDay] = useState<number | 'all'>('all');
  const [showKeywords, setShowKeywords] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showDeathIcons, setShowDeathIcons] = useState(true);
  const [showAxis, setShowAxis] = useState(true);

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

  const insertTemplate = (content: string) => {
    const currentInfo = currentPlayer?.inf || '';
    const newInfo = currentInfo + (currentInfo ? '\n\n' : '') + content;
    updatePlayerInfo(playerNo, newInfo);
    setShowTemplates(false);
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
                
                <div className="flex items-center gap-1.5">
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
                  
                  <div className="flex bg-white border rounded-full p-0.5 shadow-sm">
                    <button 
                      onClick={() => setShowDeathIcons(!showDeathIcons)}
                      title="Toggle Death Icons"
                      className={`p-1 rounded-full transition-colors ${showDeathIcons ? 'bg-red-50 text-red-600' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                      <Skull size={12} />
                    </button>
                    <button 
                      onClick={() => setShowAxis(!showAxis)}
                      title="Toggle Grid Axis"
                      className={`p-1 rounded-full transition-colors ${showAxis ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                      <Grid3X3 size={12} />
                    </button>
                  </div>
                  
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

              {/* Assignment Row */}
              <div className="w-full flex items-center gap-2">
                <div className="flex items-center bg-slate-900 rounded-lg h-8 overflow-hidden border border-slate-700 shadow-lg">
                  <button 
                    onClick={() => setAssignmentMode?.(assignmentMode === 'death' ? null : 'death')} 
                    className={`px-2 h-full text-[8px] font-black uppercase tracking-widest transition-colors ${assignmentMode === 'death' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    DEATH
                  </button>
                  <button 
                    onClick={() => {
                      if (setSelectedReason) {
                        const currentIndex = REASON_CYCLE.indexOf(selectedReason || '⚔️');
                        const nextIndex = (currentIndex + 1) % REASON_CYCLE.length;
                        setSelectedReason(REASON_CYCLE[nextIndex]);
                      }
                    }}
                    className="bg-slate-800 text-white text-[10px] border-none focus:ring-0 h-full px-2 hover:bg-slate-700 transition-colors"
                  >
                    {selectedReason || '⚔️'}
                  </button>
                </div>

                <div className="flex items-center bg-slate-900 rounded-lg h-8 overflow-hidden border border-slate-700 shadow-lg">
                  <button 
                    onClick={() => setAssignmentMode?.(assignmentMode === 'property' ? null : 'property')} 
                    className={`px-2 h-full text-[8px] font-black uppercase tracking-widest transition-colors ${assignmentMode === 'property' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    PROP
                  </button>
                  <input 
                    type="text" 
                    value={selectedProperty || ''} 
                    onChange={(e) => setSelectedProperty?.(e.target.value)} 
                    placeholder="Type property..." 
                    className="bg-slate-800 text-white text-[10px] border-none focus:ring-0 h-full px-1 w-20"
                  />
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
                onPlayerClick={(num) => onPlayerClick?.(num)}
                pendingNom={pendingNom}
                isVoting={isVoting}
                onNominationSlideEnd={handleNominationSlideEnd}
                onVoterToggle={handleVoterToggle}
                onToggleVotingPhase={handleToggleVotingPhase}
                currentDay={currentDay}
                setCurrentDay={setCurrentDay}
                showDeathIcons={showDeathIcons}
                showAxis={showAxis}
                assignmentMode={assignmentMode}
                selectedReason={selectedReason}
                selectedProperty={selectedProperty}
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

            {/* Expandable Sections */}
            <div className="flex flex-col gap-2">
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
                            }}
                            className={`${categoryBg[item.category as keyof typeof categoryBg]} text-slate-900 px-2 py-1 rounded text-[9px] font-bold transition-colors text-left w-full`}
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
                            }}
                            className={`${categoryBg[item.category as keyof typeof categoryBg]} text-slate-900 px-2 py-1 rounded text-[9px] font-bold transition-colors text-left`}
                          >
                            {item.role}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-xs text-center italic">No roles defined yet.</p>
                  )}
                </div>
              )}

              {showTemplates && (
                <div className="bg-white border rounded-lg p-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                  <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Notepad Templates</h4>
                  {notepadTemplates.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {notepadTemplates.map(template => (
                        <button 
                          key={template.id} 
                          onClick={() => insertTemplate(template.content)}
                          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg text-[9px] font-black uppercase transition-all text-left flex flex-col"
                        >
                          {template.label}
                          <span className="text-[7px] font-normal text-slate-400 normal-case line-clamp-1">{template.content}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-xs text-center italic py-2">No templates defined in settings.</p>
                  )}
                </div>
              )}
            </div>

            {/* Player Note Section */}
            <div className="flex gap-2 items-start">
              <textarea 
                className="flex-1 min-h-[120px] border border-slate-200 bg-white rounded-lg p-4 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none font-medium leading-relaxed shadow-sm transition-all"
                placeholder="Type social reads, role claims, or night info here..."
                value={currentPlayer?.inf || ''}
                onChange={(e) => updatePlayerInfo(playerNo, e.target.value)}
              />
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => { setShowKeywords(!showKeywords); setShowTemplates(false); }}
                  className={`p-2 rounded-full shadow-sm transition-all ${showKeywords ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  title="Insert Roles"
                >
                  <Key size={14} />
                </button>
                <button 
                  onClick={() => { setShowTemplates(!showTemplates); setShowKeywords(false); }}
                  className={`p-2 rounded-full shadow-sm transition-all ${showTemplates ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  title="Insert Template"
                >
                  <FilePlus2 size={14} />
                </button>
              </div>
            </div>

            {/* Death Status and Prop in one row */}
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