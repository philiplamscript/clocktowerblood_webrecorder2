"use client";

import React from 'react';
import { Type, Globe, RotateCcw, ShieldAlert } from 'lucide-react';

interface GeneralSectionProps {
  fontSize: 'small' | 'mid' | 'large';
  setFontSize: (size: 'small' | 'mid' | 'large') => void;
  language: string;
  setLanguage: (lang: string) => void;
  resetCustomization: () => void;
}

const GeneralSection: React.FC<GeneralSectionProps> = ({ fontSize, setFontSize, language, setLanguage, resetCustomization }) => {
  return (
    <div className="space-y-8">
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

      <section className="pt-6 border-t border-slate-100 space-y-4">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-4">
          <div className="p-2 bg-red-100 rounded-lg text-red-600">
            <ShieldAlert size={20} />
          </div>
          <div className="space-y-1 flex-1">
            <h4 className="text-[11px] font-black text-red-900 uppercase">Reset Customizations</h4>
            <p className="text-[10px] text-red-600 leading-relaxed">
              This will reset all Notepad Templates, Property Shortcuts, and the Default Notepad back to factory defaults.
            </p>
          </div>
        </div>
        <button 
          onClick={() => {
            if (confirm('Are you sure you want to reset all customizations? This cannot be undone.')) {
              resetCustomization();
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-red-200 text-red-600 rounded-xl text-[10px] font-black uppercase hover:bg-red-50 transition-all active:scale-95"
        >
          <RotateCcw size={14} /> Reset All Customization to Default
        </button>
      </section>
    </div>
  );
};

export default GeneralSection;