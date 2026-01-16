"use client";

import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { REASON_CYCLE, type Player, type Death, type PropTemplate, type IdentityMode } from '../../type';

interface PlayerHubProps {
  currentDay: number;
  setCurrentDay: (day: number) => void;
  playerCount: number;
  players: Player[];
  deadPlayers: number[];
  deaths: Death[];
  assignmentMode: 'death' | 'property' | null;
  setAssignmentMode: (mode: 'death' | 'property' | null) => void;
  selectedReason: string;
  setSelectedReason: (reason: string) => void;
  selectedProperty: string;
  setSelectedProperty: (prop: string) => void;
  propTemplates: PropTemplate[];
  focusPlayerNo: number;
  onPlayerClick: (num: number) => void;
  identityMode: IdentityMode;
}

const PlayerHub: React.FC<PlayerHubProps> = ({
  currentDay, setCurrentDay, playerCount, players, deadPlayers, deaths,
  assignmentMode, setAssignmentMode, selectedReason, setSelectedReason,
  selectedProperty, setSelectedProperty, propTemplates, focusPlayerNo, onPlayerClick, identityMode
}) => {
  const cycleSelectedReason = () => {
    const nextIndex = (REASON_CYCLE.indexOf(selectedReason) + 1) % REASON_CYCLE.length;
    setSelectedReason(REASON_CYCLE[nextIndex]);
  };

  return (
    <div className="flex-none bg-slate-800 border-b border-slate-700 p-2 shadow-inner animate-in slide-in-from-top-4 duration-200 transition-all">
      <div className="flex flex-wrap items-center gap-1.5 max-w-5xl mx-auto">
        <div className="flex items-center bg-slate-900 rounded-lg h-7 overflow-hidden border border-slate-700 shadow-lg mr-1 w-[58px]">
          <button onClick={() => setCurrentDay(Math.max(1, currentDay - 1))} className="flex-1 hover:bg-slate-800 text-slate-500 transition-colors flex items-center justify-center"><Minus size={10} /></button>
          <div className="w-6 font-black text-[9px] text-white bg-slate-800 h-full flex items-center justify-center tracking-tighter border-x border-slate-700">D{currentDay}</div>
          <button onClick={() => setCurrentDay(currentDay + 1)} className="flex-1 hover:bg-slate-800 text-slate-500 transition-colors flex items-center justify-center"><Plus size={10} /></button>
        </div>

        <div className="flex items-center gap-1 mr-2">
          <div className="flex items-center bg-slate-900 rounded-lg h-7 overflow-hidden border border-slate-700 shadow-lg">
            <button onClick={() => setAssignmentMode(assignmentMode === 'death' ? null : 'death')} className={`px-2 h-full text-[8px] font-black uppercase tracking-widest transition-colors ${assignmentMode === 'death' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>DEATH</button>
            <button onClick={cycleSelectedReason} className="bg-slate-800 text-white text-[10px] h-full px-2 hover:bg-slate-700 transition-colors">{selectedReason}</button>
          </div>
          <div className="flex items-center bg-slate-900 rounded-lg h-7 overflow-hidden border border-slate-700 shadow-lg">
            <button onClick={() => setAssignmentMode(assignmentMode === 'property' ? null : 'property')} className={`px-2 h-full text-[8px] font-black uppercase tracking-widest transition-colors ${assignmentMode === 'property' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>PROP</button>
            <input type="text" value={selectedProperty} onChange={(e) => setSelectedProperty(e.target.value)} placeholder="Type property..." className="bg-transparent text-white text-[10px] border-none focus:ring-0 h-full px-2 w-20" />
            <div className="flex border-l border-slate-700">
              {propTemplates.slice(0, 3).map(pt => (
                <button key={pt.id} onClick={() => setSelectedProperty(pt.value)} className={`px-1.5 h-full text-[10px] hover:bg-slate-700 transition-colors ${selectedProperty === pt.value ? 'bg-blue-600' : ''}`}>{pt.value}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {Array.from({ length: playerCount }, (_, i) => i + 1).map(num => {
            const p = players.find(pl => pl.no === num);
            const isDead = deadPlayers.includes(num);
            const death = deaths.find(d => parseInt(d.playerNo) === num);
            
            // Determine display label based on identity mode
            const label = identityMode === 'name' && p?.name ? p.name : num;

            return (
              <button key={num} onClick={() => onPlayerClick(num)} className={`flex-none px-3 py-1 rounded-full text-[10px] font-black transition-all border-2 shadow-sm ${assignmentMode ? 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600' : num === focusPlayerNo ? 'bg-white text-slate-900 border-red-500 scale-105 z-10' : isDead ? 'bg-slate-900 text-white border-red-900/50' : p?.inf ? 'bg-blue-600 text-white border-blue-400' : p?.property ? 'bg-green-600 text-white border-green-400' : 'bg-slate-700 text-slate-300 border-slate-600'} active:scale-90`}>
                <span>{label}</span>{isDead && <span className="ml-1 text-[8px] opacity-75">{death?.reason}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayerHub;