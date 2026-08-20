"use client";

import React, { useRef, useState } from 'react';
import { X, UserPlus, UserMinus, GripVertical, RotateCcw, User, Sparkles, Check, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { type Player, buildPlayerNamesPrompt, parsePlayerNames } from '../../../type';
import { generateGemini, readGeminiApiKey, readGeminiModelId } from '../../../lib/gemini';
import { useGeminiSettings } from '../../../hooks/useGeminiSettings';
import GeminiInput from '../../ai/GeminiInput';
import GeminiModeTabs from '../../ai/GeminiModeTabs';

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
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const dragIdxRef = useRef<number | null>(null);
  const overIdxRef = useRef<number | null>(null);
  const [copiedNames, setCopiedNames] = useState(false);
  const { hasKey } = useGeminiSettings();

  if (!isOpen) return null;

  const clearDrag = () => {
    dragIdxRef.current = null;
    overIdxRef.current = null;
    setDragIdx(null);
    setOverIdx(null);
  };

  const endDrag = () => {
    const from = dragIdxRef.current;
    const to = overIdxRef.current;
    if (from !== null && to !== null && from !== to) {
      reorderPlayers(from, to);
    }
    clearDrag();
  };

  const onGripPointerDown = (idx: number, e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragIdxRef.current = idx;
    overIdxRef.current = idx;
    setDragIdx(idx);
    setOverIdx(idx);
  };

  const onGripPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (dragIdxRef.current === null) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const row = el?.closest('[data-player-idx]');
    if (!row) return;
    const next = Number(row.getAttribute('data-player-idx'));
    if (Number.isNaN(next) || next === overIdxRef.current) return;
    overIdxRef.current = next;
    setOverIdx(next);
  };

  const onGripPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (dragIdxRef.current === null) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    endDrag();
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
              {dragIdx === null
                ? 'Drag the ⠿ handle to reorder players'
                : `Moving seat ${dragIdx + 1}. Drop on another row to place.`}
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
                {players.map((p, idx) => {
                  const isDragging = dragIdx === idx;
                  const isDropTarget = dragIdx !== null && overIdx === idx && dragIdx !== idx;
                  return (
                    <tr
                      key={p.no}
                      data-player-idx={idx}
                      className={`transition-colors group select-none ${
                        isDragging
                          ? 'bg-blue-600/15 opacity-60'
                          : isDropTarget
                            ? 'bg-emerald-50 ring-2 ring-inset ring-emerald-400'
                            : mePlayerNo === p.no
                              ? 'bg-blue-50'
                              : 'hover:bg-blue-50/30'
                      }`}
                    >
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
                        <button
                          type="button"
                          onPointerDown={(e) => onGripPointerDown(idx, e)}
                          onPointerMove={onGripPointerMove}
                          onPointerUp={onGripPointerUp}
                          onPointerCancel={clearDrag}
                          className={`p-2 rounded-lg transition-colors touch-none cursor-grab active:cursor-grabbing ${
                            isDragging
                              ? 'text-blue-600 bg-blue-100'
                              : 'text-slate-300 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                          title="Drag to reorder"
                          aria-label={`Drag to reorder player ${p.no}`}
                        >
                          <GripVertical size={16} />
                        </button>
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
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            onClick={addPlayer}
            className="w-full py-3 bg-white border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus size={14} /> Add New Player Slot
          </button>

          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 space-y-2">
            <h4 className="text-[10px] font-black text-indigo-800 uppercase flex items-center gap-2">
              <Sparkles size={12} /> Fill names with AI
            </h4>
            <p className="text-[9px] text-indigo-600 leading-relaxed italic">
              Generate with Gemini to fill seats immediately, or copy a prompt for another chatbot.
            </p>
            <GeminiModeTabs
              apiPanel={
                <GeminiInput
                  hasKey={hasKey}
                  placeholder="Alice, Bob, Carol… or seating notes"
                  generateLabel="Generate names"
                  onGenerate={async ({ text, images }) => {
                    try {
                      const result = await generateGemini({
                        apiKey: readGeminiApiKey(),
                        model: readGeminiModelId(),
                        prompt: buildPlayerNamesPrompt(players.length, text),
                        images,
                        json: true,
                      });
                      const names = parsePlayerNames(result, players.length);
                      if (!names.some(n => n.trim())) {
                        toast.error('No names found. Try a clearer photo or typed list.');
                        return;
                      }
                      names.forEach((name, i) => {
                        if (name.trim()) updatePlayerName(i + 1, name.trim());
                      });
                      toast.success('Player names applied.');
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : 'Gemini request failed.');
                    }
                  }}
                />
              }
              copyPanel={
                <div className="space-y-2">
                  <ol className="text-[9px] text-indigo-700 leading-relaxed list-decimal pl-4 space-y-1">
                    <li>Type the seating list or attach a seating-chart / name-tag photo in the chatbot.</li>
                    <li>Copy the prompt below (it asks for JSON names for {players.length} seats).</li>
                    <li>Paste both into ChatGPT, Claude, or Gemini chat.</li>
                    <li>Paste the JSON reply into Generate notes next time, or type names into the table.</li>
                  </ol>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(buildPlayerNamesPrompt(players.length, ''));
                      setCopiedNames(true);
                      toast.success('Name prompt copied.');
                      setTimeout(() => setCopiedNames(false), 2000);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-indigo-200 hover:border-indigo-400 text-indigo-700 py-2 rounded-lg text-[10px] font-black uppercase"
                  >
                    {copiedNames ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    {copiedNames ? 'Prompt Copied!' : 'Copy name prompt'}
                  </button>
                </div>
              }
            />
          </div>
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
