"use client";

import React from 'react';
import { Key, FilePlus2 } from 'lucide-react';
import { type NotepadTemplate } from '../../type';

interface NoteSectionProps {
  currentPlayer: any;
  playerNo: number;
  updatePlayerInfo: (no: number, text: string) => void;
  showKeywords: boolean;
  setShowKeywords: (v: boolean) => void;
  showTemplates: boolean;
  setShowTemplates: (v: boolean) => void;
  allRoles: { role: string; category: string }[];
  categoryBg: Record<string, string>;
  notepadTemplates: NotepadTemplate[];
  insertTemplate: (content: string) => void;
}

const NoteSection: React.FC<NoteSectionProps> = ({
  currentPlayer, playerNo, updatePlayerInfo, showKeywords, setShowKeywords,
  showTemplates, setShowTemplates, allRoles, categoryBg, notepadTemplates, insertTemplate
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2">
        {showKeywords && (
          <div className="bg-[#1a1412] border border-[#4a3a32] rounded-xl p-3 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {allRoles.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {['Townsfolk', 'Outsider', 'Minion'].map(cat => (
                  <div key={cat} className="space-y-1.5">
                    <h4 className={`text-[8px] font-black uppercase tracking-tighter ${cat === 'Townsfolk' ? 'text-blue-400' : cat === 'Outsider' ? 'text-indigo-400' : 'text-red-400'}`}>{cat}</h4>
                    {allRoles.filter(r => r.category === cat || (cat === 'Minion' && r.category === 'Demon')).map((item, idx) => (
                      <button key={idx} onClick={() => updatePlayerInfo(playerNo, (currentPlayer?.inf || '') + (currentPlayer?.inf ? '\n' : '') + item.role)} className={`${categoryBg[item.category]} px-2 py-1.5 rounded text-[9px] font-bold transition-all text-left w-full hover:scale-[1.02] active:scale-95`}>
                        {item.role}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ) : <p className="text-stone-600 text-[10px] text-center italic py-2">No roles defined in char list.</p>}
          </div>
        )}

        {showTemplates && (
          <div className="bg-[#1a1412] border border-[#4a3a32] rounded-xl p-3 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h4 className="text-[8px] font-black text-stone-500 uppercase tracking-widest mb-2 px-1">Scroll Templates</h4>
            <div className="grid grid-cols-2 gap-2">
              {notepadTemplates.map(template => (
                <button key={template.id} onClick={() => insertTemplate(template.content)} className="bg-[#2d241f] hover:bg-[#3d2f28] border border-[#4a3a32] text-stone-300 px-3 py-2 rounded-lg text-[9px] font-black uppercase transition-all text-left flex flex-col group shadow-sm">
                  <span className="text-amber-500 group-hover:text-amber-400 transition-colors">{template.label}</span>
                  <span className="text-[7px] font-normal text-stone-500 normal-case line-clamp-1 mt-0.5">{template.content}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 items-stretch">
        <textarea 
          className="flex-1 min-h-[140px] border border-[#4a3a32] bg-[#1a1412] text-amber-50/90 rounded-xl p-4 text-[11px] focus:ring-1 focus:ring-amber-500/30 outline-none resize-none font-medium leading-relaxed shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] transition-all placeholder:text-stone-800"
          placeholder="Record social reads, role claims, and dark secrets..."
          value={currentPlayer?.inf || ''}
          onChange={(e) => updatePlayerInfo(playerNo, e.target.value)}
        />
        <div className="flex flex-col gap-2">
          <button onClick={() => { setShowKeywords(!showKeywords); setShowTemplates(false); }} className={`w-10 h-10 rounded-xl shadow-lg transition-all flex items-center justify-center border ${showKeywords ? 'bg-amber-600 border-amber-400 text-stone-900' : 'bg-[#2d241f] border-[#4a3a32] text-stone-500 hover:text-amber-500 hover:border-amber-900/50'}`}><Key size={16} /></button>
          <button onClick={() => { setShowTemplates(!showTemplates); setShowKeywords(false); }} className={`w-10 h-10 rounded-xl shadow-lg transition-all flex items-center justify-center border ${showTemplates ? 'bg-emerald-700 border-emerald-500 text-emerald-50' : 'bg-[#2d241f] border-[#4a3a32] text-stone-500 hover:text-emerald-500 hover:border-emerald-900/50'}`}><FilePlus2 size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default NoteSection;