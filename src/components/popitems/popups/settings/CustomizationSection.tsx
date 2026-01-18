"use client";

import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Tag, 
  ChevronUp, 
  ChevronDown, 
  Palette, 
  RotateCcw,
  RefreshCw,
  Download,
  Upload,
  FileJson
} from 'lucide-react';
import { toast } from 'react-hot-toast';
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
  resetCustomization: (part?: 'theme' | 'notepad' | 'props') => void;
}

const CustomizationSection: React.FC<CustomizationSectionProps> = (props) => {
  const [subTab, setSubTab] = useState<'theme' | 'notepad' | 'props' | 'sync'>('theme');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addNotepadTemplate = () => {
    const id = Math.random().toString(36).substr(2, 9);
    props.setNotepadTemplates([...props.notepadTemplates, { id, label: 'New Template', content: '' }]);
  };

  const addPropTemplate = () => {
    const id = Math.random().toString(36).substr(2, 9);
    props.setPropTemplates([...props.propTemplates, { id, label: 'New Prop', value: '🏷️' }]);
  };

  const exportGlobalConfig = () => {
    const config: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('ct_app_config')) {
        config[key] = localStorage.getItem(key);
      }
    }
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clocktracker_config_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Global config exported!');
  };

  const importGlobalConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (confirm('This will overwrite your current themes and templates. Continue?')) {
          Object.entries(data).forEach(([key, val]) => {
            if (key.startsWith('ct_app_config')) {
              localStorage.setItem(key, val as string);
            }
          });
          toast.success('Config imported! Reloading...');
          setTimeout(() => window.location.reload(), 1000);
        }
      } catch (err) {
        toast.error('Invalid config file.');
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'theme', icon: Palette, label: 'Themes' },
    { id: 'notepad', icon: FileText, label: 'Notepad' },
    { id: 'props', icon: Tag, label: 'Props' },
    { id: 'sync', icon: RefreshCw, label: 'Sync' }
  ] as const;

  return (
    <div className="space-y-6">
      <nav className="flex border-b border-slate-200 w-full">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex-1 py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${subTab === tab.id ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/30' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <tab.icon size={12} /> <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="animate-in fade-in duration-300">
        {subTab === 'theme' && (
          <div className="space-y-6">
            <ThemeSection 
              activeTheme={props.activeTheme} setActiveTheme={props.setActiveTheme}
              setCustomThemeColors={props.setCustomThemeColors} 
              setCustomThemePatterns={props.setCustomThemePatterns}
              savedCustomThemes={props.savedCustomThemes} saveCustomTheme={props.saveCustomTheme}
              updateCustomTheme={props.updateCustomTheme}
              deleteCustomTheme={props.deleteCustomTheme} renameCustomTheme={props.renameCustomTheme}
              aiThemeInput={props.aiThemeInput} setAiThemeInput={props.setAiThemeInput}
            />
            <button 
              onClick={() => confirm('Reset all themes to default?') && props.resetCustomization('theme')}
              className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-[9px] font-black uppercase text-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={12} /> Reset Themes
            </button>
          </div>
        )}

        {subTab === 'notepad' && (
          <div className="space-y-6">
            <section className="space-y-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} /> Default Notepad
              </h3>
              <textarea 
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-[11px] focus:ring-0 h-24 resize-none font-mono"
                value={props.defaultNotepad}
                onChange={(e) => props.setDefaultNotepad(e.target.value)}
                placeholder="Default content for new player notepads..."
              />
            </section>

            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} /> Templates
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
            <button 
              onClick={() => confirm('Reset all notepad templates?') && props.resetCustomization('notepad')}
              className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-[9px] font-black uppercase text-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={12} /> Reset Notepad
            </button>
          </div>
        )}

        {subTab === 'props' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Tag size={14} /> Property Shortcuts
              </h3>
              <button onClick={addPropTemplate} className="p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                <Plus size={14} />
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[300px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-[8px] font-black text-slate-400 uppercase">Order</th>
                    <th className="px-3 py-2 text-left text-[8px] font-black text-slate-400 uppercase">Label</th>
                    <th className="px-3 py-2 text-left text-[8px] font-black text-slate-400 uppercase">Value</th>
                    <th className="px-3 py-2 text-center text-[8px] font-black text-slate-400 uppercase">Del</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {props.propTemplates.map((template, index) => (
                    <tr key={template.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2">
                        <div className="flex flex-col gap-0.5">
                          <button onClick={() => index > 0 && props.reorderPropTemplates(index, index - 1)} disabled={index === 0}><ChevronUp size={10} /></button>
                          <button onClick={() => index < props.propTemplates.length - 1 && props.reorderPropTemplates(index, index + 1)} disabled={index === props.propTemplates.length - 1}><ChevronDown size={10} /></button>
                        </div>
                      </td>
                      <td className="px-3 py-2"><input className="w-full bg-transparent border-none p-0 text-[10px] focus:ring-0 font-bold" value={template.label} onChange={(e) => props.setPropTemplates(props.propTemplates.map(t => t.id === template.id ? { ...t, label: e.target.value } : t))} /></td>
                      <td className="px-3 py-2"><input className="w-full bg-transparent border-none p-0 text-[10px] focus:ring-0 font-bold" value={template.value} onChange={(e) => props.setPropTemplates(props.propTemplates.map(t => t.id === template.id ? { ...t, value: e.target.value } : t))} /></td>
                      <td className="px-3 py-2 text-center"><button onClick={() => props.setPropTemplates(props.propTemplates.filter(t => t.id !== template.id))} className="text-slate-300 hover:text-red-500"><Trash2 size={12} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button 
              onClick={() => confirm('Reset all property shortcuts?') && props.resetCustomization('props')}
              className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-[9px] font-black uppercase text-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={12} /> Reset Props
            </button>
          </div>
        )}

        {subTab === 'sync' && (
          <div className="space-y-6">
            <section className="space-y-3">
              <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                <FileJson size={14} /> Global Config Backup
              </h3>
              <p className="text-[10px] text-slate-500 leading-relaxed italic">
                Export your custom themes, notepad templates, and property shortcuts. This does not include game sessions.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={exportGlobalConfig}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all group"
                >
                  <Download size={20} className="text-indigo-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black uppercase">Export Config</span>
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all group"
                >
                  <Upload size={20} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black uppercase">Import Config</span>
                  <input type="file" ref={fileInputRef} onChange={importGlobalConfig} className="hidden" accept=".json" />
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomizationSection;