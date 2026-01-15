"use client";

import React, { useState } from 'react';
import { Key, FilePlus2 } from 'lucide-react';
import { type NotepadTemplate } from '../../type';
import KeywordPopup from '../popitems/popups/KeywordPopup';

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
  const handleSelectRole = (role: string) => {
    updatePlayerInfo(playerNo, (currentPlayer?.inf || '') + (currentPlayer?.inf ? '\n' : '') + role);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2">
        <KeywordPopup 
          isOpen={showKeywords}
          onClose={() => setShowKeywords(false)}
          playerNo={playerNo}
          allRoles={allRoles}
          categoryBg={categoryBg}
          onSelectRole={handleSelectRole}
        />

        {showTemplates && (
          <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Notepad Templates</h4>
            <div className="grid grid-cols-2 gap-2">
              {notepadTemplates.map(template => (
                <button key={template.id} onClick={() => insertTemplate(template.content)} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 px-3 py-2 rounded-lg text-[9px] font-black uppercase transition-all text-left flex flex-col group">
                  <span className="group-hover:text-blue-600 transition-colors">{template.label}</span>
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
          <button 
            onClick={() => { setShowKeywords(!showKeywords); setShowTemplates(false); }} 
            className={`p-2.5 rounded-xl shadow-sm transition-all active:scale-90 ${showKeywords ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white border border-slate-200 text-slate-400 hover:text-blue-600'}`}
            title="Insert Role Keyword"
          >
            <Key size={16} />
          </button>
          <button 
            onClick={() => { setShowTemplates(!showTemplates); setShowKeywords(false); }} 
            className={`p-2.5 rounded-xl shadow-sm transition-all active:scale-90 ${showTemplates ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-white border border-slate-200 text-slate-400 hover:text-emerald-600'}`}
            title="Insert Template"
          >
            <FilePlus2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteSection;