"use client";

import React from 'react';
import { Scroll, Plus, Trash2 } from 'lucide-react';
import RotaryPicker from '../pickers/RotaryPicker/RotaryPicker';
import { STATUS_OPTIONS, type Character, type CharDict, type RoleDist } from '../../type';

interface CharsTabProps {
  chars: CharDict;
  setChars: React.Dispatch<React.SetStateAction<CharDict>>;
  playerCount: number;
  setPlayerCount: React.Dispatch<React.SetStateAction<number>>;
  roleDist: RoleDist;
  setRoleDist: React.Dispatch<React.SetStateAction<RoleDist>>;
}

const CharsTab: React.FC<CharsTabProps> = ({ chars, setChars, playerCount, setPlayerCount, roleDist, setRoleDist }) => {
  // Reorder categories to put Townsfolk last
  const categories: (keyof CharDict)[] = ['Outsider', 'Minion', 'Demon', 'Townsfolk'];

  const toggleStatus = (category: keyof CharDict, index: number) => {
    const currentStatus = chars[category][index].status;
    const nextIndex = (STATUS_OPTIONS.indexOf(currentStatus) + 1) % STATUS_OPTIONS.length;
    const nextStatus = STATUS_OPTIONS[nextIndex];
    
    setChars({
      ...chars,
      [category]: chars[category].map((item, idx) => 
        idx === index ? { ...item, status: nextStatus } : item
      )
    });
  };

  const addRow = (category: keyof CharDict) => {
    setChars({
      ...chars,
      [category]: [...chars[category], { name: '', status: '—', note: '' }]
    });
  };

  const removeRow = (category: keyof CharDict, index: number) => {
    setChars({
      ...chars,
      [category]: chars[category].filter((_, idx) => idx !== index)
    });
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case "POSS": return "bg-blue-500 text-white";
      case "CONF": return "bg-emerald-500 text-white";
      case "NOT": return "bg-red-500 text-white";
      default: return "bg-[var(--bg-color)] text-[var(--muted-color)]";
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-[var(--header-color)] rounded border border-[var(--border-color)] shadow-2xl overflow-hidden max-w-lg mx-auto transition-colors duration-500">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border-color)] bg-black/20">
          <Scroll size={12} className="text-yellow-500" />
          <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Script & Player Distribution</span>
        </div>
        <div className="grid grid-cols-5 divide-x divide-[var(--border-color)]">
          <div className="flex flex-col items-center py-2 bg-black/10">
            <span className="text-[7px] font-black text-slate-500 mb-1">PLAYERS</span>
            <RotaryPicker value={playerCount} min={1} max={20} onChange={setPlayerCount} color="text-yellow-500" />
          </div>
          {[
            { key: 'townsfolk', label: 'TOWNS', color: 'text-blue-400' },
            { key: 'outsiders', label: 'OUTS', color: 'text-blue-200' },
            { key: 'minions', label: 'MINIONS', color: 'text-red-400' },
            { key: 'demons', label: 'DEMON', color: 'text-red-600' }
          ].map(d => (
            <div key={d.key} className="flex flex-col items-center py-2">
              <span className={`text-[7px] font-black ${d.color} mb-1`}>{d.label}</span>
              <RotaryPicker 
                value={roleDist[d.key as keyof RoleDist]} 
                min={0} 
                max={20} 
                onChange={(val) => setRoleDist({ ...roleDist, [d.key]: val })} 
                color={d.color}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {categories.map((f) => (
          <div key={f} className="space-y-1">
            <div className="flex justify-between items-center px-1 mb-1">
              <h3 className="text-[9px] font-black text-[var(--muted-color)] uppercase tracking-widest">{f}s</h3>
              <button 
                onClick={() => addRow(f)}
                className="p-1 hover:bg-black/5 rounded text-[var(--muted-color)] hover:text-[var(--text-color)] transition-colors"
                title="Add Row"
              >
                <Plus size={10} />
              </button>
            </div>
            <div className="bg-[var(--panel-color)] rounded border border-[var(--border-color)] overflow-hidden transition-colors duration-500">
              {chars[f].map((c: Character, i: number) => (
                <div key={i} className="flex border-b border-[var(--border-color)] last:border-0 h-8 items-center px-2 gap-2 group hover:bg-black/5 transition-colors">
                  <input 
                    className="flex-1 bg-transparent border-none p-0 text-[10px] focus:ring-0 font-bold text-[var(--text-color)]" 
                    placeholder="..." 
                    value={c.name} 
                    onChange={(e) => setChars({ ...chars, [f]: chars[f].map((item, idx) => idx === i ? { ...item, name: e.target.value } : item) })} 
                  />
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => toggleStatus(f, i)}
                      className={`w-10 h-5 rounded text-[7px] font-black flex items-center justify-center transition-colors ${getStatusStyle(c.status)}`}
                    >
                      {c.status}
                    </button>
                    {chars[f].length > 1 && (
                      <button 
                        onClick={() => removeRow(f, i)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[var(--muted-color)] hover:text-[var(--accent-color)] transition-all"
                      >
                        <Trash2 size={10} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharsTab;