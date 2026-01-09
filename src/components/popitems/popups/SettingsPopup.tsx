"use client";

import React, { useState } from 'react';
import { X, Type, Globe, FileText, Tag, Plus, Trash2 } from 'lucide-react';
import { type NotepadTemplate, type PropTemplate } from '../../../type';

interface SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: 'small' | 'mid' | 'large';
  setFontSize: (size: 'small' | 'mid' | 'large') => void;
  language: string;
  setLanguage: (lang: string) => void;
  notepadTemplates: NotepadTemplate[];
  setNotepadTemplates: (templates: NotepadTemplate[]) => void;
  propTemplates: PropTemplate[];
  setPropTemplates: (templates: PropTemplate[]) => void;
}

const SettingsPopup: React.FC<SettingsPopupProps> = ({
  isOpen, onClose, fontSize, setFontSize, language, setLanguage,
  notepadTemplates, setNotepadTemplates, propTemplates, setPropTemplates
}) => {
  const [activeSection, setActiveSection] = useState<'general' | 'notepad' | 'props'>('general');

  if (!isOpen) return null;

  const addNotepadTemplate = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotepadTemplates([...notepadTemplates, { id, label: 'New Template', content: '' }]);
  };

  const addPropTemplate = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setPropTemplates([...propTemplates, { id, label: 'New Prop', value: '🏷️' }]);
  };

  return (
    <div className="fixed inset-0 z-[10008] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <header className="flex-none bg-slate-900 text-white px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Application Settings</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Tabs */}
          <aside className="w-40 bg-slate-50 border-r border-slate-200 flex flex-col p-2 gap-1">
            <button 
              onClick={() => setActiveSection('general')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeSection === 'general' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-200'}`}
            >
              <Globe size={14} /> General
            </button>
            <button 
              onClick={() => setActiveSection('notepad')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeSection === 'notepad' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-200'}`}
            >
              <FileText size={14} /> Notepad
            </button>
            <button 
              onClick={() => setActiveSection('props')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeSection === 'props' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-200'}`}
            >
              <Tag size={14} /> Properties
            </button>
          </aside>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeSection === 'general' && (
              <div className="space-y-6">
                <section className="space-y-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Type size={14} /> Text Scaling
                  </h3>
                  <div className="flex gap-2">
                    {(['small', 'mid', 'large'] as const).map(size => (
                      <button 
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`flex-1 py-3 rounded-xl border-2 font-black uppercase text-[10px] transition-all ${fontSize === size ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Globe size={14} /> Preferred Language
                  </h3>
                  <div className="flex gap-2">
                    {['Eng', '簡中', '繁中'].map(lang => (
                      <button 
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`flex-1 py-3 rounded-xl border-2 font-black text-[10px] transition-all ${language === lang ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'notepad' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} /> Notepad Templates
                  </h3>
                  <button onClick={addNotepadTemplate} className="p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="space-y-3">
                  {notepadTemplates.map((template, idx) => (
                    <div key={template.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 relative group">
                      <button 
                        onClick={() => setNotepadTemplates(notepadTemplates.filter(t => t.id !== template.id))}
                        className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                      <input 
                        className="w-full bg-transparent font-black text-[10px] uppercase border-none p-0 focus:ring-0 text-slate-700"
                        value={template.label}
                        onChange={(e) => setNotepadTemplates(notepadTemplates.map(t => t.id === template.id ? { ...t, label: e.target.value } : t))}
                        placeholder="Template Name"
                      />
                      <textarea 
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[11px] focus:ring-0 h-20 resize-none font-mono"
                        value={template.content}
                        onChange={(e) => setNotepadTemplates(notepadTemplates.map(t => t.id === template.id ? { ...t, content: e.target.value } : t))}
                        placeholder="Template Content..."
                      />
                    </div>
                  ))}
                  {notepadTemplates.length === 0 && <p className="text-center text-slate-400 text-[10px] italic py-8">No templates saved yet.</p>}
                </div>
              </div>
            )}

            {activeSection === 'props' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Tag size={14} /> Property Shortcuts
                  </h3>
                  <button onClick={addPropTemplate} className="p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {propTemplates.map((template) => (
                    <div key={template.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 relative group">
                      <button 
                        onClick={() => setPropTemplates(propTemplates.filter(t => t.id !== template.id))}
                        className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={12} />
                      </button>
                      <div className="space-y-1">
                        <label className="text-[7px] font-black text-slate-400 uppercase">Label</label>
                        <input 
                          className="w-full bg-white border border-slate-200 rounded p-1.5 text-[10px] focus:ring-0 font-bold"
                          value={template.label}
                          onChange={(e) => setPropTemplates(propTemplates.map(t => t.id === template.id ? { ...t, label: e.target.value } : t))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[7px] font-black text-slate-400 uppercase">Value / Icon</label>
                        <input 
                          className="w-full bg-white border border-slate-200 rounded p-1.5 text-[10px] focus:ring-0 font-bold"
                          value={template.value}
                          onChange={(e) => setPropTemplates(propTemplates.map(t => t.id === template.id ? { ...t, value: e.target.value } : t))}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {propTemplates.length === 0 && <p className="text-center text-slate-400 text-[10px] italic py-8">No property shortcuts saved yet.</p>}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingsPopup;