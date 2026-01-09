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
    <div className="space-y-2">
      <div className="flex flex-col gap-2">
        {showKeywords && (
          <div className="bg-white border rounded-lg p-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            {allRoles.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {['Townsfolk', 'Outsider', 'Minion'].map(cat => (
                  <div key={cat} className="space-y-1">
                    <h4 className={`text-[8px] font-black uppercase ${cat === 'Townsfolk' ? 'text-blue-400' : cat === 'Outsider' ? 'text-blue-200' : 'text-red-400'}`}>{cat}</h4>
                    {allRoles.filter(r => r.category === cat || (cat === 'Minion' && r.category === 'Demon')).map((item, idx) => (
                      <button key={idx} onClick={() => updatePlayerInfo(playerNo, (currentPlayer?.inf || '') + (currentPlayer?.inf ? '\n' : '') + item.role)} className={`${categoryBg[item.category]} text-slate-900 px-2 py-1 rounded text-[9px] font-bold transition-colors text-left w-full`}>
                        {item.role}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ) : <p className="text-slate-500 text-xs text-center italic">No roles defined yet.</p>}
          </div>
        )}

        {showTemplates && (
          <div className="bg-white border rounded-lg p-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Templates</h4>
            <div className="grid grid-cols-2 gap-2">
              {notepadTemplates.map(template => (
                <button key={template.id} onClick={() => insertTemplate(template.content)} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg text-[9px] font-black uppercase transition-all text-left flex flex-col">
                  {template.label}
                  <span className="text-[7px] font-normal text-slate-400 normal-case line-clamp-1">{template.content}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 items-start">
        <textarea 
          className="flex-1 min-h-[120px] border border-slate-200 bg-white rounded-lg p-4 text-xs focus:ring-2 focus:ring-blue-500/20 outline-none resize-none font-medium leading-relaxed shadow-sm transition-all"
          placeholder="Type social reads, role claims..."
          value={currentPlayer?.inf || ''}
          onChange={(e) => updatePlayerInfo(playerNo, e.target.value)}
        />
        <div className="flex flex-col gap-2">
          <button onClick={() => { setShowKeywords(!showKeywords); setShowTemplates(false); }} className={`p-2 rounded-full shadow-sm transition-all ${showKeywords ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}><Key size={14} /></button>
          <button onClick={() => { setShowTemplates(!showTemplates); setShowKeywords(false); }} className={`p-2 rounded-full shadow-sm transition-all ${showTemplates ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}><FilePlus2 size={14} /></button>
        </div>
      </div>
    </div>
  );
};

export default NoteSection;