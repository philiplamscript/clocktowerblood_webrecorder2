"use client";

import React, { useState } from 'react';
import { X, UserPlus, UserMinus, GripVertical, CornerDownRight, RotateCcw, User } from 'lucide-react';
import { type Player } from '../../../type';

interface PlayerRosterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  updatePlayerName: (no: number, name: string) => void;
  resetPlayerNames: () => void;
  reorderPlayers: (from: number, to: number) => void;
  addPlayer: () => void;
  removePlayer: (no: number) => void;
  mePlayerNo: number | null;
  setMePlayerNo: (no: number | null) => void;
}

const PlayerRosterPopup: React.FC<PlayerRosterPopupProps> = ({
  isOpen, onClose, players, updatePlayerName, resetPlayerNames, reorderPlayers, addPlayer, removePlayer,
  mePlayerNo, setMePlayerNo
}) => {
  const [movingIdx, setMovingIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleMoveAction = (targetIdx: number) => {
    if (movingIdx !== null) {
      reorderPlayers(movingIdx, targetIdx);
      setMovingIdx(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[10015] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <header className="flex-none bg-slate-900 text-white px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <UserPlus size={14} className="text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Player Roster Management</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full transition-colors">
            <X size={18} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-2">
            <p className="text-[9px] text-blue-600 font-bold uppercase tracking-wider text-center">
              {movingIdx === null 
                ? "Tap the move handle ⠿ to select a player to move" 
                : `Moving Player ${players[movingIdx].no}. Tap any "MOVE TO" button below.`}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-[9px] font-black text-slate-400 uppercase">
                <tr>
                  <th className="w-10 py-2 text-center">#</th>
                  <th className="w-12 py-2 text-center">Me</th>
                  <th className="w-14 py-2 text-center">Move</th>
                  <th className="px-4 py-2 text-left">Player Name</th>
                  <th className="w-10 py-2 text-center">Del</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {players.map((p, idx) => (
                  <tr key={p.no} className={`transition-colors group ${movingIdx === idx ? 'bg-blue-600/10' : mePlayerNo === p.no ? 'bg-blue-50' : 'hover:bg-blue-50/30'}`}>
                    <td className="py-3 text-center text-[10px] font-mono text-slate-400 font-bold">{p.no}</td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => setMePlayerNo(mePlayerNo === p.no ? null : p.no)}
                        className={`px-1.5 py-1 rounded text-[8px] font-black uppercase tracking-wider transition-all ${
                          mePlayerNo === p.no
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-300 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                        title={mePlayerNo === p.no ? 'Clear Me (South seat)' : 'Mark as Me (always South)'}
                      >
                        <User size={12} className="inline" />
                      </button>
                    </td>
                    <td className="py-3 text-center">
                      {movingIdx === null ? (
                        <button 
                          onClick={() => setMovingIdx(idx)}
                          className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
                          title="Select to Move"
                        >
                          <GripVertical size={16} />
                        </button>
                      ) : movingIdx === idx ? (
                        <button 
                          onClick={() => setMovingIdx(null)}
                          className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-1 rounded shadow-sm"
                        >
                          CANCEL
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleMoveAction(idx)}
                          className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[8px] font-black px-2 py-1 rounded shadow-sm transition-all active:scale-90"
                        >
                          <CornerDownRight size={10} /> MOVE
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="text" 
                        value={p.name} 
                        onChange={(e) => updatePlayerName(p.no, e.target.value)}
                        placeholder={`Player ${p.no}...`}
                        className="w-full bg-transparent border-none p-0 text-[11px] font-black focus:ring-0 text-slate-700 placeholder:opacity-30"
                      />
                    </td>
                    <td className="py-3 text-center">
                      <button 
                        onClick={() => removePlayer(p.no)}
                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <UserMinus size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button 
            onClick={addPlayer}
            className="w-full py-3 bg-white border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus size={14} /> Add New Player Slot
          </button>
        </main>
        
        <footer className="bg-white border-t border-slate-100 p-4 flex justify-between items-center gap-3">
          <button 
            onClick={resetPlayerNames}
            className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all flex items-center gap-2 active:scale-95"
            title="Clear all player names"
          >
            <RotateCcw size={12} /> Reset Names
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md active:scale-95"
          >
            Finished
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PlayerRosterPopup;
