"use client";

import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Tag, 
  ChevronUp, 
  ChevronDown, 
  Palette, 
  RotateCcw, 
  ShieldAlert 
} from 'lucide-react';
import { 
  type NotepadTemplate, 
  type PropTemplate, 
  type ThemeType, 
  type ThemeColors, 
  type ThemePatterns, 
  type Theme 
} from '../../../../type';
import ThemeSection from './ThemeSection';

interface CustomizationSectionProps {
  notepadTemplates: NotepadTemplate[];
  setNotepadTemplates: (templates: NotepadTemplate[]) => void;
  propTemplates: PropTemplate[];
  setPropTemplates: (templates: PropTemplate[]) => void;
  reorderNotepadTemplates: (fromIndex: number, toIndex: number) => void;
  reorderPropTemplates: (fromIndex: number, toIndex: number) => void;
  defaultNotepad: string;
  setDefaultNotepad: (content: string) => void;
  activeTheme: ThemeType;
  setActiveTheme: (theme: ThemeType) => void;
  setCustomThemeColors: (colors: ThemeColors) => void;
  setCustomThemePatterns: (patterns: ThemePatterns) => void;
  savedCustomThemes: Theme[];
  saveCustomTheme: (name: string) => void;
  updateCustomTheme: (id: string, theme: Theme) => void;
  deleteCustomTheme: (id: string) => void;
  renameCustomTheme: (id: string, newName: string) => void;
  aiThemeInput: string;
  setAiThemeInput: (val: string) => void;
  resetCustomization: () => void;
}

const CustomizationSection: React.FC<CustomizationSectionProps> = (props) => {
  const [subTab, setSubTab] = useState<'theme' | 'notepad' | 'props' | 'reset'>('theme');

  const addNotepadTemplate = () => {
    const id = Math.random().toString(36).substr(2, 9);
    props.setNotepadTemplates([...props.notepadTemplates, { id, label: 'New Template', content: '' }]);
  };

  const addPropTemplate = () => {
    const id = Math.random().toString(36).substr(2, 9);
    props.setPropTemplates([...props.propTemplates, { id, label: 'New Prop', value: '🏷️' }]);
  };

  return (
    <div className="space-y-6">
      <nav className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setSubTab('theme')}
          className={`flex-1 min-w-[100px] py-3 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${subTab === 'theme' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Palette size={12} /> Themes
        </button>
        <button 
          onClick={() => setSubTab('notepad')}
          className={`flex-1 min-w-[100px] py-3 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${subTab === 'notepad' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <FileText size={12} /> Notepad
        </button>
        <button 
          onClick={() => setSubTab('props')}
          className={`flex-1 min-w-[100px] py-3 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${subTab === 'props' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Tag size={12} /> Props
        </button>
        <button 
          onClick={() => setSubTab('reset')}
          className={`flex-1 min-w-[100px] py-3 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${subTab === 'reset' ? 'border-b-2 border-red-600 text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </nav>

      {subTab === 'theme' && (
        <ThemeSection 
          activeTheme={props.activeTheme} setActiveTheme={props.setActiveTheme}
          setCustomThemeColors={props.setCustomThemeColors} 
          setCustomThemePatterns={props.setCustomThemePatterns}
          savedCustomThemes={props.savedCustomThemes} saveCustomTheme={props.saveCustomTheme}
          updateCustomTheme={props.updateCustomTheme}
          deleteCustomTheme={props.deleteCustomTheme} renameCustomTheme={props.renameCustomTheme}
          aiThemeInput={props.aiThemeInput} setAiThemeInput={props.setAiThemeInput}
        />
      )}

      {subTab === 'notepad' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <section className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FileText size={14} /> Default Notepad
            </h3>
            <textarea 
              className="w-full bg-white border border-slate-200 rounded-lg p-3 text-[11px] focus:ring-0 h-24 resize-none font-mono"
              value={props.defaultNotepad}
              onChange={(e) => props.setDefaultNotepad(e.target.value)}
              placeholder="Default content for new player notepads..."
            />
          </section>

          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FileText size={14} /> Notepad Templates
            </h3>
            <button onClick={addNotepadTemplate} className="p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {props.notepadTemplates.map((template, index) => (
              <div key={template.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 relative group">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => index > 0 && props.reorderNotepadTemplates(index, index - 1)} disabled={index === 0} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"><ChevronUp size={12} /></button>
                    <button onClick={() => index < props.notepadTemplates.length - 1 && props.reorderNotepadTemplates(index, index + 1)} disabled={index === props.notepadTemplates.length - 1} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"><ChevronDown size={12} /></button>
                  </div>
                  <div className="flex-1">
                    <input className="w-full bg-transparent font-black text-[10px] uppercase border-none p-0 focus:ring-0 text-slate-700" value={template.label} onChange={(e) => props.setNotepadTemplates(props.notepadTemplates.map(t => t.id === template.id ? { ...t, label: e.target.value } : t))} placeholder="Template Name" />
                  </div>
                  <button onClick={() => props.setNotepadTemplates(props.notepadTemplates.filter(t => t.id !== template.id))} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                </div>
                <textarea className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[11px] focus:ring-0 h-20 resize-none font-mono" value={template.content} onChange={(e) => props.setNotepadTemplates(props.notepadTemplates.map(t => t.id === template.id ? { ...t, content: e.target.value } : t))} placeholder="Template Content..." />
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'props' && (
        <div className="space-y-4 animate-in fade-in duration-300">
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
                  <th className="px-4 py-2 text-left text-[9px] font-black text-slate-400 uppercase">Value</th>
                  <th className="px-4 py-2 text-center text-[9px] font-black text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {props.propTemplates.map((template, index) => (
                  <tr key={template.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => index > 0 && props.reorderPropTemplates(index, index - 1)} disabled={index === 0}><ChevronUp size={12} /></button>
                        <button onClick={() => index < props.propTemplates.length - 1 && props.reorderPropTemplates(index, index + 1)} disabled={index === props.propTemplates.length - 1}><ChevronDown size={12} /></button>
                      </div>
                    </td>
                    <td className="px-4 py-3"><input className="w-full bg-transparent border-none p-0 text-[10px] focus:ring-0 font-bold" value={template.label} onChange={(e) => props.setPropTemplates(props.propTemplates.map(t => t.id === template.id ? { ...t, label: e.target.value } : t))} /></td>
                    <td className="px-4 py-3"><input className="w-full bg-transparent border-none p-0 text-[10px] focus:ring-0 font-bold" value={template.value} onChange={(e) => props.setPropTemplates(props.propTemplates.map(t => t.id === template.id ? { ...t, value: e.target.value } : t))} /></td>
                    <td className="px-4 py-3 text-center"><button onClick={() => props.setPropTemplates(props.propTemplates.filter(t => t.id !== template.id))} className="text-slate-300 hover:text-red-500"><Trash2 size={12} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'reset' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-4">
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <ShieldAlert size={20} />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="text-[11px] font-black text-red-900 uppercase">Reset Customizations</h4>
              <p className="text-[10px] text-red-600 leading-relaxed">
                This will reset all Themes, Notepad Templates, and Property Shortcuts back to factory defaults. Your current game session data will not be affected.
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (confirm('Are you sure you want to reset all customizations? This cannot be undone.')) {
                props.resetCustomization();
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-red-200 text-red-600 rounded-2xl text-[10px] font-black uppercase hover:bg-red-50 transition-all active:scale-95 shadow-sm"
          >
            <RotateCcw size={14} /> Reset All Customization to Default
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomizationSection;