"use client";

import React from 'react';
import { Globe, Palette, FileText } from 'lucide-react';

interface SettingsSidebarProps {
  activeSection: 'general' | 'theme' | 'customization';
  setActiveSection: (section: 'general' | 'theme' | 'customization') => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeSection, setActiveSection }) => {
  return (
    <aside className="w-40 bg-slate-50 border-r border-slate-200 flex flex-col p-2 gap-1">
      {/* <button 
        onClick={() => setActiveSection('general')}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeSection === 'general' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-200'}`}
      >
        <Globe size={14} /> General
      </button> */}
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
  );
};

export default SettingsSidebar;