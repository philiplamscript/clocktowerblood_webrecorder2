import React from 'react';
import { 
  Trash2,
  Calendar,
  Target,
  Zap,
  X
} from 'lucide-react';

import {
  type Death,
} from '../../../type'

import { ReasonPicker } from '../../pickers/ClockPicker/ClockPicker';

// --- COMPONENT 4: DEATH LEDGER ---

const DeathLedger = ({ deaths, setDeaths, playerCount }: any) => {
  return (
    <div className="bg-[var(--panel-color)] rounded border border-[var(--border-color)] shadow-sm transition-colors duration-500">
      <div className="bg-[var(--header-color)] px-3 py-1.5 flex items-center gap-2">
        <X size={12} className="text-[var(--accent-color)]" />
        <span className="text-white text-[9px] font-black uppercase tracking-widest">Death Ledger</span>
      </div>
      <table className="w-full border-collapse table-fixed">
        <thead>
          <tr className="bg-[var(--bg-color)] border-b border-[var(--border-color)] text-[8px] uppercase text-[var(--muted-color)] font-black transition-colors duration-500">
            <th className="w-8 py-2 border-r border-[var(--border-color)] text-center">
              <div className="flex flex-col items-center"><Calendar size={10} /></div>
            </th>
            <th className="w-12 py-2 border-r border-[var(--border-color)] text-center">
              <div className="flex flex-col items-center"><Target size={10} /></div>
            </th>
            <th className="w-12 py-2 border-r border-[var(--border-color)] text-center">
              <div className="flex flex-col items-center"><Zap size={10} /></div>
            </th>
            <th className="py-2 px-3 text-left">NOTES</th>
            <th className="w-8 py-2 text-center border-l border-[var(--border-color)]">
              <Trash2 size={10} className="mx-auto opacity-20" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-color)]">
          {deaths.map((d: Death) => (
            <tr key={d.id} className="h-10 hover:bg-black/5 transition-colors">
              <td className="p-0 border-r border-[var(--border-color)]">
                <input 
                  type="number" 
                  className="w-full text-center border-none bg-transparent focus:ring-0 text-[10px] font-black p-0 text-[var(--text-color)]" 
                  value={d.day} 
                  onChange={(e) => setDeaths(deaths.map((it: any) => it.id === d.id ? { ...it, day: parseInt(e.target.value) || 1 } : it))} 
                />
              </td>
              <td className="p-0.5 border-r border-[var(--border-color)]">
                <input 
                  type="text" 
                  className="w-full text-center border-none bg-transparent focus:ring-0 text-[10px] font-black p-0 text-[var(--text-color)]" 
                  value={d.playerNo} 
                  onChange={(e) => setDeaths(deaths.map((it: any) => it.id === d.id ? { ...it, playerNo: e.target.value } : it))} 
                />
              </td>
              <td className="p-0 border-r border-[var(--border-color)] text-center">
                <ReasonPicker 
                  value={d.reason} 
                  onChange={(val) => setDeaths(deaths.map((it: any) => it.id === d.id ? { ...it, reason: val } : it))} 
                />
              </td>
              <td className="p-0 px-2 font-mono">
                <input 
                  placeholder="..." 
                  className="w-full border-none bg-transparent focus:ring-0 text-[10px] h-10 text-[var(--text-color)]" 
                  value={d.note} 
                  onChange={(e) => setDeaths(deaths.map((it: any) => it.id === d.id ? { ...it, note: e.target.value } : it))} 
                />
              </td>
              <td className="p-0 text-center border-l border-[var(--border-color)]">
                <button 
                  onClick={() => setDeaths(deaths.filter((it: any) => it.id !== d.id))} 
                  className="text-[var(--muted-color)] opacity-20 hover:text-[var(--accent-color)] hover:opacity-100 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeathLedger;