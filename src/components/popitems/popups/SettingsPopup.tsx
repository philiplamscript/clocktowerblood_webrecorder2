"use client";

import React, { useState } from 'react';
import { X, Type, Globe, FileText, Tag, Plus, Trash2, Palette, Sparkles, Copy, Check } from 'lucide-react';
import { type NotepadTemplate, type PropTemplate, type ThemeType, type ThemeColors, THEMES } from '../../../type';
import { toast } from 'react-hot-toast';

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
  activeTheme: ThemeType;
  setActiveTheme: (theme: ThemeType) => void;
  setCustomThemeColors: (colors: ThemeColors) => void;
}

const SettingsPopup: React.FC<SettingsPopupProps> = ({
  isOpen, onClose, fontSize, setFontSize, language, setLanguage,
  notepadTemplates, setNotepadTemplates, propTemplates, setPropTemplates,
  activeTheme, setActiveTheme, setCustomThemeColors
}) => {
  const [activeSection, setActiveSection] = useState<'general' | 'notepad' | 'props' | 'theme'>('general');
  const [aiThemeInput, setAiThemeInput] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const addNotepadTemplate = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotepadTemplates([...notepadTemplates, { id, label: 'New Template', content: '' }]);
  };

  const addPropTemplate = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setPropTemplates([...propTemplates, { id, label: 'New Prop', value: '🏷️' }]);
  };

  const applyAiTheme = () => {
    try {
      const colors = JSON.parse(aiThemeInput);
      const required = ['bg', 'panel', 'header', 'accent', 'text', 'border', 'muted'];
      const missing = required.filter(k => !colors[k]);
      
      if (missing.length > 0) {
        toast.error(`Invalid format. Missing: ${missing.join(', ')}`);
        return;
      }
      
      setCustomThemeColors(colors);
      setActiveTheme('custom');
      toast.success('AI Theme Applied!');
    } catch (e) {
      toast.error('Invalid JSON format.');
    }
  };

  const aiPrompt = `Generate a JSON object for a Blood on the Clocktower app theme. 
Style: [YOUR DESIRED STYLE HERE]. 
Format: {
  "bg": "hex code",
  "panel": "hex code",
  "header": "hex code",
  "accent": "hex code",
  "text": "hex code",
  "border": "hex code",
  "muted": "hex code"
}`;

  const copyPrompt = () => {
    navigator.clipboard.writeText(aiPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Prompt copied to clipboard');
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
          <aside className="w-40 bg-slate-50 border-r border-slate-200 flex flex-col p-2 gap-1">
            <button 
              onClick={() => setActiveSection('general')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeSection === 'general' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-200'}`}
            >
              <Globe size={14} /> General
            </button>
            <button 
              onClick={() => setActiveSection('theme')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeSection === 'theme' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-200'}`}
            >
              <Palette size={14} /> Themes
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

            {activeSection === 'theme' && (
              <div className="space-y-6">
                <section className="space-y-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Palette size={14} /> Built-in Themes
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {(Object.values(THEMES)).map((theme) => (
                      <button 
                        key={theme.id}
                        onClick={() => setActiveTheme(theme.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col gap-2 ${activeTheme === theme.id ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-100 hover:border-slate-200'}`}
                      >
                        <span className="text-[10px] font-black uppercase">{theme.name}</span>
                        <div className="flex gap-1">
                          <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: theme.colors.bg }} />
                          <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: theme.colors.header }} />
                          <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: theme.colors.accent }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={14} /> AI Custom Theme
                  </h3>
                  
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <p className="text-[10px] text-slate-500 leading-relaxed italic">
                      Copy the prompt below and paste it into an LLM (ChatGPT, Claude, etc.) to generate a custom visual style.
                    </p>
                    
                    <div className="relative">
                      <pre className="bg-slate-900 text-slate-300 p-3 rounded-lg text-[9px] font-mono whitespace-pre-wrap">
                        {aiPrompt}
                      </pre>
                      <button 
                        onClick={copyPrompt}
                        className="absolute top-2 right-2 p-1.5 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors"
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </div>

                    <textarea 
                      className="w-full h-24 bg-white border border-slate-200 rounded-lg p-3 text-[10px] font-mono focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
                      placeholder='Paste JSON here... e.g. {"bg": "#000", ...}'
                      value={aiThemeInput}
                      onChange={(e) => setAiThemeInput(e.target.value)}
                    />
                    
                    <button 
                      onClick={applyAiTheme}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-[10px] font-black uppercase transition-all shadow-md active:scale-95"
                    >
                      Apply Custom AI Style
                    </button>
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
                  {notepadTemplates.map((template) => (
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
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingsPopup;