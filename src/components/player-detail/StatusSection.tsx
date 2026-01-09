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
    <div className="flex items-center gap-2 pt-2 border-t border-[#4a3a32]/30">
      {isDead ? (
        <div className="flex-[8] flex items-center gap-1.5 h-11">
          <button 
            onClick={() => togglePlayerAlive(playerNo)} 
            className="flex-1 h-full bg-red-900 text-stone-100 rounded-xl flex items-center justify-center shadow-lg border border-red-700/50 hover:bg-red-800 transition-all active:scale-95"
          >
            <Skull size={16} />
          </button>
          <div className="flex-1 h-full bg-[#1a1412] border border-[#4a3a32] rounded-xl flex items-center px-1 shadow-inner group">
             <span className="text-[7px] font-black text-stone-600 uppercase transform -rotate-90">DAY</span>
             <input 
              type="number" 
              value={death?.day || currentDay} 
              onChange={(e) => updateDeathDay(playerNo, parseInt(e.target.value) || currentDay)} 
              className="w-full bg-transparent border-none text-center text-amber-500 text-sm font-black focus:ring-0 p-0" 
             />
          </div>
          <button 
            onClick={cycleDeathReason} 
            className="flex-[2] h-full bg-[#2d241f] border border-[#4a3a32] rounded-xl text-center text-lg font-black hover:bg-[#3d2f28] transition-all shadow-md active:shadow-inner"
          >
            {death?.reason || '⚔️'}
          </button>
        </div>
      ) : (
        <button 
          onClick={() => togglePlayerAlive(playerNo)} 
          className="flex-[8] h-11 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 shadow-lg border border-emerald-800/50 bg-emerald-900 text-emerald-100 hover:bg-emerald-800 active:scale-[0.98]"
        >
          <Skull size={14} className="opacity-50" />
          EXECUTE
        </button>
      )}
      <div className="flex-[3] flex items-center bg-[#1a1412] border border-[#4a3a32] rounded-xl px-3 h-11 shadow-inner">
        <Tag size={12} className="text-stone-600 mr-2 flex-shrink-0" />
        <input 
          type="text" 
          value={currentPlayer?.property || ''} 
          onChange={(e) => updatePlayerProperty(playerNo, e.target.value)} 
          placeholder="Props" 
          className="bg-transparent border-none p-0 text-[11px] font-bold focus:ring-0 w-full text-amber-500/80 placeholder:text-stone-800" 
        />
      </div>
    </div>
  );
};

export default StatusSection;