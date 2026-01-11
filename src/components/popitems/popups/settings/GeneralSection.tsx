"use client";

import React from 'react';
import { Type, Globe } from 'lucide-react';

interface GeneralSectionProps {
  fontSize: 'small' | 'mid' | 'large';
  setFontSize: (size: 'small' | 'mid' | 'large') => void;
  language: string;
  setLanguage: (lang: string) => void;
}

const GeneralSection: React.FC<GeneralSectionProps> = ({ fontSize, setFontSize, language, setLanguage }) => {
  return (
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
  );
};

export default GeneralSection;