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
      default: return "bg-slate-100 text-slate-400";
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 rounded border border-slate-800 shadow-2xl overflow-hidden max-w-lg mx-auto">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-800 bg-slate-950">
          <Scroll size={12} className="text-yellow-500" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Script & Player Distribution</span>
        </div>
        <div className="grid grid-cols-5 divide-x divide-slate-800">
          <div className="flex flex-col items-center py-2 bg-slate-900/50">
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
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{f}s</h3>
              <button 
                onClick={() => addRow(f)}
                className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors"
                title="Add Row"
              >
                <Plus size={10} />
              </button>
            </div>
            <div className="bg-white rounded border overflow-hidden">
              {chars[f].map((c: Character, i: number) => (
                <div key={i} className="flex border-b last:border-0 h-8 items-center px-2 gap-2 group">
                  <input 
                    className="flex-1 bg-transparent border-none p-0 text-[10px] focus:ring-0 font-bold" 
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
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all"
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