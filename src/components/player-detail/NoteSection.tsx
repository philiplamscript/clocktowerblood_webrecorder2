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
          <div className="bg-[#f4ead5] border-2 border-[#d4c5a9] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-200 relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/parchment.png")' }} />
            {allRoles.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 relative z-10">
                {['Townsfolk', 'Outsider', 'Minion'].map(cat => (
                  <div key={cat} className="space-y-2">
                    <h4 className={`text-[8px] font-black uppercase tracking-widest pb-1 border-b border-black/10 ${cat === 'Townsfolk' ? 'text-blue-800' : cat === 'Outsider' ? 'text-indigo-600' : 'text-red-800'}`}>{cat}</h4>
                    <div className="space-y-1">
                      {allRoles.filter(r => r.category === cat || (cat === 'Minion' && r.category === 'Demon')).map((item, idx) => (
                        <button key={idx} onClick={() => updatePlayerInfo(playerNo, (currentPlayer?.inf || '') + (currentPlayer?.inf ? '\n' : '') + item.role)} className="bg-black/5 hover:bg-black/10 text-[#3d2b1f] px-2 py-1.5 rounded text-[9px] font-bold transition-all text-left w-full border border-black/5 hover:border-black/10">
                          {item.role}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-stone-600 text-[10px] text-center italic py-2">The record is empty.</p>}
          </div>
        )}

        {showTemplates && (
          <div className="bg-[#f4ead5] border-2 border-[#d4c5a9] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-200 relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/parchment.png")' }} />
            <h4 className="text-[9px] font-black text-stone-800 uppercase tracking-[0.2em] mb-3 relative z-10 border-b border-black/10 pb-1">Notary Templates</h4>
            <div className="grid grid-cols-2 gap-3 relative z-10">
              {notepadTemplates.map(template => (
                <button key={template.id} onClick={() => insertTemplate(template.content)} className="bg-white/40 hover:bg-white/60 border border-[#d4c5a9] text-stone-900 px-3 py-2.5 rounded-lg text-[9px] font-black uppercase transition-all text-left flex flex-col shadow-sm group">
                  <span className="group-hover:text-amber-800 transition-colors">{template.label}</span>
                  <span className="text-[7px] font-medium text-stone-500 normal-case line-clamp-1 mt-0.5">{template.content}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 items-stretch h-[160px]">
        <div className="flex-1 relative bg-[#f4ead5] rounded-xl p-0.5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1),0_4px_15px_rgba(0,0,0,0.2)] border-2 border-[#d4c5a9]">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/parchment.png")' }} />
          <textarea 
            className="w-full h-full bg-transparent p-4 text-[13px] text-[#2d1e16] focus:ring-0 outline-none resize-none font-medium leading-relaxed placeholder:text-stone-400 relative z-10 selection:bg-amber-800/20"
            placeholder="Scribe your findings here..."
            value={currentPlayer?.inf || ''}
            onChange={(e) => updatePlayerInfo(playerNo, e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3 justify-center">
          <button onClick={() => { setShowKeywords(!showKeywords); setShowTemplates(false); }} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${showKeywords ? 'bg-amber-600 text-white scale-110' : 'bg-[#4d3a2b] text-amber-200/60 hover:text-amber-200 border border-[#5d4a3b]'}`}><Key size={16} /></button>
          <button onClick={() => { setShowTemplates(!showTemplates); setShowKeywords(false); }} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${showTemplates ? 'bg-amber-600 text-white scale-110' : 'bg-[#4d3a2b] text-amber-200/60 hover:text-amber-200 border border-[#5d4a3b]'}`}><FilePlus2 size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default NoteSection;