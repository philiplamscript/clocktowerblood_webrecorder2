"use client";

import React from 'react';
import { Type, Globe, RotateCcw, ShieldAlert, Hash, User, FolderOpen } from 'lucide-react';
import { type IdentityMode } from '../../../../type';

interface GeneralSectionProps {
  fontSize: 'small' | 'mid' | 'large';
  setFontSize: (size: 'small' | 'mid' | 'large') => void;
  language: string;
  setLanguage: (lang: string) => void;
  identityMode: IdentityMode;
  setIdentityMode: (mode: IdentityMode) => void;
  resetCustomization: () => void;
  exportPath: string;
  setExportPath: (path: string) => void;
}

const GeneralSection: React.FC<GeneralSectionProps> = ({ 
  identityMode, setIdentityMode, resetCustomization, exportPath, setExportPath 
}) => {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <User size={14} /> Identity Display Mode
        </h3>
        <p className="text-[10px] text-slate-500 italic">Choose whether the UI identifies players by their seat number or their custom name.</p>
        <div className="flex gap-2">
          <button 
            onClick={() => setIdentityMode('number')}
            className={`flex-1 py-3 rounded-xl border-2 font-black uppercase text-[10px] transition-all flex items-center justify-center gap-2 ${identityMode === 'number' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
          >
            <Hash size={12} /> Number Base
          </button>
          <button 
            onClick={() => setIdentityMode('name')}
            className={`flex-1 py-3 rounded-xl border-2 font-black uppercase text-[10px] transition-all flex items-center justify-center gap-2 ${identityMode === 'name' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
          >
            <User size={12} /> Player Name Base
          </button>
        </div>
      </section>

      <section className="space-y-3 pt-6 border-t border-slate-100">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <FolderOpen size={14} /> Backup & Restore Configuration
        </h3>
        <p className="text-[10px] text-slate-500 italic">Set a label for your backup files. When restoring, ensure files are named with this prefix.</p>
        <div className="relative">
          <FolderOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={exportPath}
            onChange={(e) => setExportPath(e.target.value)}
            placeholder="Backup folder/prefix name..."
            className="w-full pl-9 pr-3 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
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