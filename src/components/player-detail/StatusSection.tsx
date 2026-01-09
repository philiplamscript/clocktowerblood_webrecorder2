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
    <div className="flex items-center gap-2">
      {isDead ? (
        <div className="flex-[8] flex items-center gap-1 h-10">
          <button onClick={() => togglePlayerAlive(playerNo)} className="flex-1 h-full bg-red-600 text-white rounded-lg flex items-center justify-center shadow-sm transition-all"><Skull size={14} /></button>
          <input type="number" value={death?.day || currentDay} onChange={(e) => updateDeathDay(playerNo, parseInt(e.target.value) || currentDay)} className="flex-1 h-full bg-white border rounded-lg text-center text-[10px] font-black focus:ring-0" />
          <button onClick={cycleDeathReason} className="flex-[2] h-full bg-white border rounded-lg text-center text-[12px] font-black hover:bg-slate-50 transition-colors">{death?.reason || '⚔️'}</button>
        </div>
      ) : (
        <button onClick={() => togglePlayerAlive(playerNo)} className="flex-[8] h-10 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 shadow-sm bg-emerald-600 text-white">EXECUTE</button>
      )}
      <div className="flex-[2] flex items-center bg-white border rounded-lg px-3 h-10 shadow-sm">
        <Tag size={12} className="text-slate-400 mr-2" />
        <input type="text" value={currentPlayer?.property || ''} onChange={(e) => updatePlayerProperty(playerNo, e.target.value)} placeholder="Props" className="bg-transparent border-none p-0 text-[11px] font-bold focus:ring-0 w-full" />
      </div>
    </div>
  );
};

export default StatusSection;