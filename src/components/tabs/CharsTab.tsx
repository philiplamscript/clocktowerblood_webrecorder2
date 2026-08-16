"use client";

import React, { useState } from 'react';
import { Scroll, Plus, Minus, Trash2, Sparkles } from 'lucide-react';
import {
  ROLES_PAGE_CATEGORIES,
  cycleCharStatus,
  charStatusCellClass,
  normalizeCharStatus,
  getRoleDistForPlayerCount,
  type Character,
  type CharDict,
  type RoleDist,
} from '../../type';

interface CharsTabProps {
  chars: CharDict;
  setChars: React.Dispatch<React.SetStateAction<CharDict>>;
  playerCount: number;
  setPlayerCount: React.Dispatch<React.SetStateAction<number>>;
  roleDist: RoleDist;
  setRoleDist: React.Dispatch<React.SetStateAction<RoleDist>>;
  onShowRoleUpdate?: () => void;
}

const Stepper: React.FC<{
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}> = ({ value, min, max, onChange }) => (
  <div className="flex items-center gap-0.5">
    <button
      type="button"
      onClick={() => onChange(Math.max(min, value - 1))}
      className="w-5 h-5 rounded flex items-center justify-center bg-black/20 text-[var(--text-on-header)] hover:bg-black/30 active:scale-90 disabled:opacity-30"
      disabled={value <= min}
      aria-label="Decrease"
    >
      <Minus size={10} />
    </button>
    <span className="w-5 text-center text-sm font-black text-[var(--text-on-header)] tabular-nums">{value}</span>
    <button
      type="button"
      onClick={() => onChange(Math.min(max, value + 1))}
      className="w-5 h-5 rounded flex items-center justify-center bg-black/20 text-[var(--text-on-header)] hover:bg-black/30 active:scale-90 disabled:opacity-30"
      disabled={value >= max}
      aria-label="Increase"
    >
      <Plus size={10} />
    </button>
  </div>
);

const CharsTab: React.FC<CharsTabProps> = ({
  chars, setChars, playerCount, setPlayerCount, roleDist, setRoleDist, onShowRoleUpdate,
}) => {
  const [customDist, setCustomDist] = useState(false);

  const toggleStatus = (category: keyof CharDict, index: number) => {
    setChars({
      ...chars,
      [category]: chars[category].map((item, idx) =>
        idx === index ? { ...item, status: cycleCharStatus(item.status) } : item
      ),
    });
  };

  const addRow = (category: keyof CharDict) => {
    setChars({
      ...chars,
      [category]: [...chars[category], { name: '', status: 'POSS', note: '' }],
    });
  };

  const removeRow = (category: keyof CharDict, index: number) => {
    setChars({
      ...chars,
      [category]: chars[category].filter((_, idx) => idx !== index),
    });
  };

  const handlePlayerCountChange = (val: number) => {
    setPlayerCount(val);
    if (!customDist) {
      setRoleDist(getRoleDistForPlayerCount(val));
    }
  };

  const distKeys: { key: keyof RoleDist; label: string }[] = [
    { key: 'townsfolk', label: 'TOWNS' },
    { key: 'outsiders', label: 'OUTS' },
    { key: 'minions', label: 'MINIONS' },
    { key: 'demons', label: 'DEMON' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <button
          onClick={onShowRoleUpdate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <Sparkles size={14} /> Insert Role List (AI)
        </button>
      </div>

      <div className="bg-[var(--header-color)] rounded border border-[var(--border-color)] shadow-2xl overflow-hidden max-w-lg mx-auto transition-colors duration-500">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border-color)] bg-black/20">
          <Scroll size={12} className="text-yellow-500" />
          <span className="text-[9px] font-black text-[var(--text-on-header)] opacity-80 uppercase tracking-widest flex-1">
            Script & Player Distribution
          </span>
          <button
            type="button"
            onClick={() => {
              setCustomDist((v) => {
                if (v) setRoleDist(getRoleDistForPlayerCount(playerCount));
                return !v;
              });
            }}
            className={`text-[7px] font-black uppercase tracking-wider px-2 h-5 rounded transition-colors ${
              customDist ? 'bg-amber-500 text-white' : 'bg-black/20 text-[var(--text-on-header)] opacity-80 hover:opacity-100'
            }`}
          >
            Custom
          </button>
        </div>

        <div className="flex items-stretch divide-x divide-[var(--border-color)]">
          <div className="flex flex-col items-center justify-center py-2 px-3 bg-black/10 min-w-[88px]">
            <span className="text-[8px] font-black text-[var(--text-on-panel)] mb-1">PLAYERS</span>
            <Stepper
              value={playerCount}
              min={1}
              max={20}
              onChange={handlePlayerCountChange}
            />
          </div>
          <div className="flex-1 grid grid-cols-4 divide-x divide-[var(--border-color)]">
            {distKeys.map((d) => (
              <div key={d.key} className="flex flex-col items-center justify-center py-2 px-0.5">
                <span className="text-[8px] font-black text-[var(--text-on-panel)] mb-1">{d.label}</span>
                {customDist ? (
                  <Stepper
                    value={roleDist[d.key]}
                    min={0}
                    max={20}
                    onChange={(val) => setRoleDist({ ...roleDist, [d.key]: val })}
                  />
                ) : (
                  <span className="text-sm font-black text-[var(--text-on-header)] py-1">{roleDist[d.key]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <div className="grid grid-cols-4 gap-2 min-w-[560px]">
          {ROLES_PAGE_CATEGORIES.map((f) => (
            <div key={f} className="space-y-1 min-w-0">
              <div className="flex justify-between items-center px-1 mb-1">
                <h3 className="text-[9px] font-black text-[var(--text-on-bg)] uppercase tracking-widest truncate">{f}</h3>
                <button
                  onClick={() => addRow(f)}
                  className="p-1 hover:bg-black/5 rounded text-[var(--text-on-bg)] hover:text-[var(--muted-color)] transition-colors"
                  title="Add Row"
                >
                  <Plus size={10} />
                </button>
              </div>
              <div className="bg-[var(--panel-color)] rounded border border-[var(--border-color)] overflow-hidden transition-colors duration-500">
                {chars[f].map((c: Character, i: number) => (
                  <div
                    key={i}
                    className={`flex border-b border-[var(--border-color)] last:border-0 min-h-8 items-center px-1.5 gap-1 group transition-colors ${charStatusCellClass(c.status)}`}
                    onClick={() => toggleStatus(f, i)}
                    title={`Status: ${normalizeCharStatus(c.status)} (tap to cycle)`}
                  >
                    <input
                      className="flex-1 min-w-0 bg-transparent border-none p-0 text-[10px] focus:ring-0 font-bold text-inherit"
                      placeholder="..."
                      value={c.name}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        setChars({
                          ...chars,
                          [f]: chars[f].map((item, idx) =>
                            idx === i ? { ...item, name: e.target.value } : item
                          ),
                        })
                      }
                    />
                    {chars[f].length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRow(f, i);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[var(--muted-color)] hover:text-[var(--accent-color)] transition-all"
                      >
                        <Trash2 size={10} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharsTab;
