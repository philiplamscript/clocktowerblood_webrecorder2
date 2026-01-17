"use client";

import React, { useState } from 'react';
import { Palette, Sparkles, Copy, Check, Save, Wand2, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { type ThemeType, type ThemeColors, THEMES, THEME_GENERATION_PROMPT } from '../../../../type';

interface ThemeSectionProps {
  activeTheme: ThemeType;
  setActiveTheme: (theme: ThemeType) => void;
  setCustomThemeColors: (colors: ThemeColors) => void;
  savedCustomThemes: any[];
  saveCustomTheme: (name: string) => void;
  deleteCustomTheme: (id: string) => void;
  renameCustomTheme: (id: string, newName: string) => void;
  aiThemeInput: string;
  setAiThemeInput: (val: string) => void;
}

const ThemeSection: React.FC<ThemeSectionProps> = ({
  activeTheme, setActiveTheme, setCustomThemeColors, savedCustomThemes, saveCustomTheme, deleteCustomTheme, renameCustomTheme, aiThemeInput, setAiThemeInput
}) => {
  const [desiredStyle, setDesiredStyle] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSaveTheme, setShowSaveTheme] = useState(false);
  const [themeName, setThemeName] = useState('');
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  // AI Pattern Options
  const [includeBgPattern, setIncludeBgPattern] = useState(false);
  const [includePanelPattern, setIncludePanelPattern] = useState(false);

  const getAiPrompt = () => {
    let patternInstruction = "";
    let svgRules = "";
    let patternJsonFields = "";

    if (includeBgPattern || includePanelPattern) {
      patternInstruction = "5. TEXTURE: Generate custom SVG patterns for depth.";
      svgRules = "- \"bgPattern\": A full CSS url(\"data:image/svg+xml;utf8,...\") containing a subtle tiled SVG.\n- \"panelPattern\": A full CSS url(\"data:image/svg+xml;utf8,...\") containing a subtle texture SVG.";
      
      if (includeBgPattern) patternJsonFields += ",\n  \"bgPattern\": \"url(...)\"";
      if (includePanelPattern) patternJsonFields += ",\n  \"panelPattern\": \"url(...)\"";
    }

    return THEME_GENERATION_PROMPT
      .replace('{style}', desiredStyle || '[YOUR DESIRED STYLE]')
      .replace('{pattern_instruction}', patternInstruction)
      .replace('{svg_rules}', svgRules)
      .replace('{pattern_json_fields}', patternJsonFields);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(getAiPrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('AI Prompt copied!');
  };

  const applyAiTheme = () => {
    try {
      const colors = JSON.parse(aiThemeInput);
      const required = ['bg', 'panel', 'header', 'accent', 'text', 'border', 'muted'];
      const missing = required.filter(k => !colors[k]);
      if (missing.length > 0) {
        toast.error(`Missing colors: ${missing.join(', ')}`);
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
      toast.error('Enter a theme name.');
    }
  };

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Palette size={14} /> Built-in Themes
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(Object.values(THEMES)).map((theme) => (
            <button 
              key={theme.id}
              onClick={() => setActiveTheme(theme.id)}
              className={`p-3 rounded-xl border-2 transition-all text-left flex flex-col gap-2 ${activeTheme === theme.id ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-100 hover:border-slate-200'}`}
            >
              <span className="text-[10px] font-black uppercase truncate">{theme.name}</span>
              <div className="flex gap-1">
                <div className="w-3.5 h-3.5 rounded-full border border-black/5" style={{ backgroundColor: theme.colors.bg }} />
                <div className="w-3.5 h-3.5 rounded-full border border-black/5" style={{ backgroundColor: theme.colors.header }} />
                <div className="w-3.5 h-3.5 rounded-full border border-black/5" style={{ backgroundColor: theme.colors.accent }} />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedCustomThemes.map((theme) => (
              <div 
                key={theme.id}
                className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${activeTheme === theme.id ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100'}`}
              >
                <button onClick={() => setActiveTheme(theme.id)} className="flex-1 flex flex-col gap-1.5 text-left min-w-0">
                  <span className="text-[10px] font-black uppercase truncate">{theme.name}</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full border border-black/5" style={{ backgroundColor: theme.colors.bg }} />
                    <div className="w-3 h-3 rounded-full border border-black/5" style={{ backgroundColor: theme.colors.header }} />
                    <div className="w-3 h-3 rounded-full border border-black/5" style={{ backgroundColor: theme.colors.accent }} />
                  </div>
                </button>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => deleteCustomTheme(theme.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="pt-6 border-t border-slate-100 space-y-4">
        <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={14} /> AI Theme Generator
        </h3>

        {(includeBgPattern || includePanelPattern) && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-3 animate-in fade-in zoom-in-95">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <p className="text-[9px] text-amber-800 font-medium leading-relaxed">
              Generating SVG patterns requires high reasoning. For best results, use <span className="font-black">GPT-4o, Claude 3.5, or Gemini 2.0+</span>.
            </p>
          </div>
        )}
        
        <div className="bg-slate-50 rounded-2xl p-4 space-y-4">
          <div className="space-y-3">
            <p className="text-[10px] text-slate-500 italic">1. Select Style & Options</p>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Wand2 size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="e.g. Haunted Victorian, Neon Cyberpunk..." 
                  value={desiredStyle}
                  onChange={(e) => setDesiredStyle(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setIncludeBgPattern(!includeBgPattern)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border transition-all ${includeBgPattern ? 'bg-indigo-600 border-indigo-700 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300'}`}
                >
                  BG Pattern
                </button>
                <button 
                  onClick={() => setIncludePanelPattern(!includePanelPattern)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border transition-all ${includePanelPattern ? 'bg-indigo-600 border-indigo-700 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300'}`}
                >
                  Panel Pattern
                </button>
              </div>

              <button onClick={copyPrompt} className="w-full h-10 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase shadow-lg active:scale-95">
                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Prompt Copied' : 'Copy Generator Prompt'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-slate-500 italic">2. Paste AI Result</p>
            <textarea 
              className="w-full h-24 bg-white border border-slate-200 rounded-xl p-3 text-[10px] font-mono focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
              placeholder='Paste JSON here...'
              value={aiThemeInput}
              onChange={(e) => setAiThemeInput(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={applyAiTheme}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-[10px] font-black uppercase shadow-md active:scale-95"
            >
              Apply Theme Preview
            </button>
            
            {showSaveTheme && (
              <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <input 
                  type="text" 
                  placeholder="Name your theme..." 
                  value={themeName} 
                  onChange={(e) => setThemeName(e.target.value)} 
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-[10px] outline-none"
                />
                <button onClick={handleSaveTheme} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
                  <Save size={14} /> Save
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ThemeSection;