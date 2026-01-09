"use client";

import React from 'react';
import { Skull, Tag } from 'lucide-react';
import { REASON_CYCLE } from '../../type';

interface PlayerStatusActionsProps {
  playerNo: number;
  isDead: boolean;
  property: string;
  deathDay: number;
  deathReason: string;
  currentDay: number;
  toggleAlive: (no: number) => void;
  updateProperty: (no: number, text: string) => void;
  updateDeath: (playerNo: number, field: 'day' | 'reason', val: any) => void;
}

const PlayerStatusActions: React.FC<PlayerStatusActionsProps> = ({
  playerNo, isDead, property, deathDay, deathReason, currentDay, toggleAlive, updateProperty, updateDeath
}) => {
  return (
    <div className="flex items-center gap-2 h-10">
      {isDead ? (
        <div className="flex-[8] flex items-center gap-1 h-full">
          <button onClick={() => toggleAlive(playerNo)} className="flex-1 h-full bg-red-600 text-white rounded-lg flex items-center justify-center"><Skull size={14} /></button>
          <input type="number" value={deathDay} onChange={(e) => updateDeath(playerNo, 'day', parseInt(e.target.value) || currentDay)} className="flex-1 h-full bg-white border rounded-lg text-center text-[10px] font-black" />
          <button onClick={() => {
            const nextIdx = (REASON_CYCLE.indexOf(deathReason) + 1) % REASON_CYCLE.length;
            updateDeath(playerNo, 'reason', REASON_CYCLE[nextIdx]);
          }} className="flex-[2] h-full bg-white border rounded-lg text-center text-[12px]">{deathReason}</button>
        </div>
      ) : (
        <button onClick={() => toggleAlive(playerNo)} className="flex-[8] h-full rounded-lg text-[10px] font-black uppercase bg-emerald-600 text-white">ALIVE</button>
      )}
      <div className="flex-[2] flex items-center bg-white border rounded-lg px-3 h-full">
        <Tag size={12} className="text-slate-400 mr-2" />
        <input type="text" value={property} onChange={(e) => updateProperty(playerNo, e.target.value)} placeholder="Prop" className="bg-transparent border-none p-0 text-[11px] font-bold focus:ring-0 w-full" />
      </div>
    </div>
  );
};

export default PlayerStatusActions;