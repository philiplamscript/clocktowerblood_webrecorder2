"use client";

import React, { useState } from 'react';
import { X, Type, Globe, FileText, Tag, Plus, Trash2, Palette, Sparkles, Copy, Check, Save, ChevronUp, ChevronDown } from 'lucide-react';
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
  savedCustomThemes: any[];
  saveCustomTheme: (name: string) => void;
  reorderNotepadTemplates: (fromIndex: number, toIndex: number) => void;
  reorderPropTemplates: (fromIndex: number, toIndex: number) => void;
}

const SettingsPopup: React.FC<SettingsPopupProps> = ({
  isOpen, onClose, fontSize, setFontSize, language, setLanguage,
  notepadTemplates, setNotepadTemplates, propTemplates, setPropTemplates,
  activeTheme, setActiveTheme, setCustomThemeColors,
  savedCustomThemes, saveCustomTheme, reorderNotepadTemplates, reorderPropTemplates
}) => {
  const [activeSection, setActiveSection] = useState<'general' | 'theme' | 'customization'>('general');
  const [customizationSubTab, setCustomizationSubTab] = useState<'notepad' | 'props'>('notepad');
  const [aiThemeInput, setAiThemeInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSaveTheme, setShowSaveTheme] = useState(false);
  const [themeName, setThemeName] = useState('');

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
      setShowSaveTheme(true);
      toast.success('AI Theme Applied!');
    } catch (e) {
      toast.error('Invalid JSON format.');
    }
  };

  const handleSaveTheme = () => {
    if (themeName.trim()) {
      saveCustomTheme(themeName.trim());
      setThemeName('');
      setShowSaveTheme(false);
    } else {
      toast.error('Please enter a theme name.');
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
              onClick={() => setActiveSection('customization')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeSection === 'customization' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-200'}`}
            >
              <FileText size={14} /> Customization
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

                {savedCustomThemes.length > 0 && (
                  <section className="space-y-3">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Save size={14} /> Saved Custom Themes
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {savedCustomThemes.map((theme) => (
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
                )}

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
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={applyAiTheme}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-[10px] font-black uppercase transition-all shadow-md active:scale-95"
                      >
                        Apply Custom AI Style
                      </button>
                      {showSaveTheme && (
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Theme Name" 
                            value={themeName} 
                            onChange={(e) => setThemeName(e.target.value)} 
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-[10px] focus:ring-0"
                          />
                          <button 
                            onClick={handleSaveTheme}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all shadow-md active:scale-95"
                          >
                            <Save size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'customization' && (
              <div className="space-y-6">
                <nav className="flex border-b border-slate-200">
                  <button 
                    onClick={() => setCustomizationSubTab('notepad')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider transition-all ${customizationSubTab === 'notepad' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Notepad Templates
                  </button>
                  <button 
                    onClick={() => setCustomizationSubTab('props')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider transition-all ${customizationSubTab === 'props' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Property Shortcuts
                  </button>
                </nav>

                {customizationSubTab === 'notepad' && (
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
                      {notepadTemplates.map((template, index) => (
                        <div key={template.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 relative group">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex flex-col gap-1">
                              <button 
                                onClick={() => index > 0 && reorderNotepadTemplates(index, index - 1)}
                                disabled={index === 0}
                                className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                              >
                                <ChevronUp size={12} />
                              </button>
                              <button 
                                onClick={() => index < notepadTemplates.length - 1 && reorderNotepadTemplates(index, index + 1)}
                                disabled={index === notepadTemplates.length - 1}
                                className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                              >
                                <ChevronDown size={12} />
                              </button>
                            </div>
                            <div className="flex-1">
                              <input 
                                className="w-full bg-transparent font-black text-[10px] uppercase border-none p-0 focus:ring-0 text-slate-700"
                                value={template.label}
                                onChange={(e) => setNotepadTemplates(notepadTemplates.map(t => t.id === template.id ? { ...t, label: e.target.value } : t))}
                                placeholder="Template Name"
                              />
                            </div>
                            <button 
                              onClick={() => setNotepadTemplates(notepadTemplates.filter(t => t.id !== template.id))}
                              className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
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

                {customizationSubTab === 'props' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Tag size={14} /> Property Shortcuts
                      </h3>
                      <button onClick={addPropTemplate} className="p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-[9px] font-black text-slate-400 uppercase">Order</th>
                            <th className="px-4 py-2 text-left text-[9px] font-black text-slate-400 uppercase">Label</th>
                            <th className="px-4 py-2 text-left text-[9px] font-black text-slate-400 uppercase">Value / Icon</th>
                            <th className="px-4 py-2 text-center text-[9px] font-black text-slate-400 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {propTemplates.map((template, index) => (
                            <tr key={template.id} className="hover:bg-slate-50">
                              <td className="px-4 py-3">
                                <div className="flex flex-col gap-1">
                                  <button 
                                    onClick={() => index > 0 && reorderPropTemplates(index, index - 1)}
                                    disabled={index === 0}
                                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                                  >
                                    <ChevronUp size={12} />
                                  </button>
                                  <button 
                                    onClick={() => index < propTemplates.length - 1 && reorderPropTemplates(index, index + 1)}
                                    disabled={index === propTemplates.length - 1}
                                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                                  >
                                    <ChevronDown size={12} />
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <input 
                                  className="w-full bg-transparent border-none p-0 text-[10px] focus:ring-0 font-bold"
                                  value={template.label}
                                  onChange={(e) => setPropTemplates(propTemplates.map(t => t.id === template.id ? { ...t, label: e.target.value } : t))}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input 
                                  className="w-full bg-transparent border-none p-0 text-[10px] focus:ring-0 font-bold"
                                  value={template.value}
                                  onChange={(e) => setPropTemplates(propTemplates.map(t => t.id === template.id ? { ...t, value: e.target.value } : t))}
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button 
                                  onClick={() => setPropTemplates(propTemplates.filter(t => t.id !== template.id))}
                                  className="text-slate-300 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingsPopup;