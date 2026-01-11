"use client";

import React, { useState } from 'react';
import { Palette, Sparkles, Copy, Check, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { type ThemeType, type ThemeColors, THEMES } from '../../../../type';

interface ThemeSectionProps {
  activeTheme: ThemeType;
  setActiveTheme: (theme: ThemeType) => void;
  setCustomThemeColors: (colors: ThemeColors) => void;
  savedCustomThemes: any[];
  saveCustomTheme: (name: string) => void;
}

const ThemeSection: React.FC<ThemeSectionProps> = ({
  activeTheme, setActiveTheme, setCustomThemeColors, savedCustomThemes, saveCustomTheme
}) => {
  const [aiThemeInput, setAiThemeInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSaveTheme, setShowSaveTheme] = useState(false);
  const [themeName, setThemeName] = useState('');

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

  return (
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
            Copy the prompt below and paste it into an LLM to generate a custom visual style.
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
            placeholder='Paste JSON here...'
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
  );
};

export default ThemeSection;