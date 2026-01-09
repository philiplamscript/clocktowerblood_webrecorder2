"use client";

import React from 'react';
import { Skull, Tag } from 'lucide-react';

interface StatusSectionProps {
  isDead: boolean;
  togglePlayerAlive: (no: number) => void;
  playerNo: number;
  death: any;
  currentDay: number;
  updateDeathDay: (no: number, day: number) => void;
  cycleDeathReason: () => void;
  currentPlayer: any;
  updatePlayerProperty: (no: number, text: string) => void;
}

const StatusSection: React.FC<StatusSectionProps> = ({
  isDead, togglePlayerAlive, playerNo, death, currentDay, updateDeathDay, cycleDeathReason, currentPlayer, updatePlayerProperty
}) => {
  return (
    <div className="flex items-stretch gap-3 h-11">
      {isDead ? (
        <div className="flex-[7] flex items-center gap-2">
          <button 
            onClick={() => togglePlayerAlive(playerNo)} 
            className="w-11 h-full bg-[#521c1c] hover:bg-[#7a1f1f] border border-red-900/40 text-red-200 rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-95 group"
          >
            <Skull size={16} className="group-hover:scale-110 transition-transform" />
          </button>
          <div className="flex-1 h-full bg-[#1a110b] border border-[#4d3a2b] rounded-xl flex items-center shadow-inner overflow-hidden">
             <span className="text-[8px] font-black text-amber-900/60 uppercase ml-2 select-none">D</span>
             <input 
              type="number" 
              value={death?.day || currentDay} 
              onChange={(e) => updateDeathDay(playerNo, parseInt(e.target.value) || currentDay)} 
              className="w-full bg-transparent text-amber-200 text-center text-sm font-black focus:ring-0 border-none p-0" 
            />
          </div>
          <button 
            onClick={cycleDeathReason} 
            className="flex-[2] h-full bg-[#2d1e16] border border-[#4d3a2b] rounded-xl text-center text-sm font-black text-amber-200 hover:bg-[#3d2b1f] transition-all shadow-md active:scale-95"
          >
            {death?.reason || '⚔️'}
          </button>
        </div>
      ) : (
        <button 
          onClick={() => togglePlayerAlive(playerNo)} 
          className="flex-[7] h-full rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg bg-[#1b4332] hover:bg-[#2d6a4f] text-emerald-100 border border-emerald-900/40 active:scale-[0.98]"
        >
          EXECUTE ORDER
        </button>
      )}
      <div className="flex-[3] flex items-center bg-[#1a110b] border border-[#4d3a2b] rounded-xl px-3 h-full shadow-inner group">
        <Tag size={13} className="text-amber-900/60 mr-2 group-focus-within:text-amber-600 transition-colors" />
        <input 
          type="text" 
          value={currentPlayer?.property || ''} 
          onChange={(e) => updatePlayerProperty(playerNo, e.target.value)} 
          placeholder="Property" 
          className="bg-transparent border-none p-0 text-[11px] font-bold text-amber-200/90 focus:ring-0 w-full placeholder:text-amber-900/40" 
        />
      </div>
    </div>
  );
};

export default StatusSection;