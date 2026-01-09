"use client";

import React, { useState } from 'react';
import { Key, FilePlus2 } from 'lucide-react';
import { type NotepadTemplate } from '../../type';

interface PlayerInfoNotepadProps {
  playerNo: number;
  info: string;
  updateInfo: (no: number, text: string) => void;
  allRoles: { role: string; category: string }[];
  notepadTemplates: NotepadTemplate[];
}

const PlayerInfoNotepad: React.FC<PlayerInfoNotepadProps> = ({
  playerNo, info, updateInfo, allRoles, notepadTemplates
}) => {
  const [showKeywords, setShowKeywords] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const categoryBg = {
    Townsfolk: 'bg-blue-100 hover:bg-blue-200',
    Outsider: 'bg-blue-50 hover:bg-blue-100',
    Minion: 'bg-orange-50 hover:bg-orange-100',
    Demon: 'bg-red-100 hover:bg-red-200'
  };

  const insertText = (text: string) => {
    const newInfo = info + (info ? '\n' : '') + text;
    updateInfo(playerNo, newInfo);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2">
        {showKeywords && (
          <div className="bg-white border rounded-lg p-3 shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-3 gap-2">
              {['Townsfolk', 'Outsider', 'Minion'].map(cat => (
                <div key={cat} className="space-y-1">
                  <h4 className="text-[8px] font-black text-slate-400 uppercase">{cat}</h4>
                  {allRoles.filter(r => r.category === cat || (cat === 'Minion' && r.category === 'Demon')).map((item, idx) => (
                    <button key={idx} onClick={() => insertText(item.role)} className={`${categoryBg[item.category as keyof typeof categoryBg]} text-slate-900 px-2 py-1 rounded text-[9px] font-bold w-full text-left`}>
                      {item.role}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
        {showTemplates && (
          <div className="bg-white border rounded-lg p-3 shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2">
              {notepadTemplates.map(t => (
                <button key={t.id} onClick={() => { insertText(t.content); setShowTemplates(false); }} className="bg-slate-50 border p-2 rounded text-[9px] font-black uppercase text-left">
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <textarea 
          className="flex-1 min-h-[120px] border border-slate-200 rounded-lg p-4 text-xs font-medium leading-relaxed outline-none"
          placeholder="Type social reads here..."
          value={info}
          onChange={(e) => updateInfo(playerNo, e.target.value)}
        />
        <div className="flex flex-col gap-2">
          <button onClick={() => { setShowKeywords(!showKeywords); setShowTemplates(false); }} className={`p-2 rounded-full ${showKeywords ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}><Key size={14} /></button>
          <button onClick={() => { setShowTemplates(!showTemplates); setShowKeywords(false); }} className={`p-2 rounded-full ${showTemplates ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}><FilePlus2 size={14} /></button>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfoNotepad;