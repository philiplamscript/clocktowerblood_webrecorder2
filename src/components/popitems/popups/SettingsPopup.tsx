"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { type NotepadTemplate, type PropTemplate, type ThemeType, type ThemeColors } from '../../../type';

import SettingsSidebar from './settings/SettingsSidebar';
import ThemeSection from './settings/ThemeSection';
import CustomizationSection from './settings/CustomizationSection';

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
  defaultNotepad: string;
  setDefaultNotepad: (content: string) => void;
}

const SettingsPopup: React.FC<SettingsPopupProps> = (props) => {
  const [activeSection, setActiveSection] = useState<'theme' | 'customization'>('theme');

  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10008] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl h-[85vh] md:h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <header className="flex-none bg-slate-900 text-white px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Application Settings</span>
          </div>
          <button onClick={props.onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <SettingsSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/30">
            {activeSection === 'theme' && (
              <ThemeSection 
                activeTheme={props.activeTheme} setActiveTheme={props.setActiveTheme}
                setCustomThemeColors={props.setCustomThemeColors} 
                savedCustomThemes={props.savedCustomThemes} saveCustomTheme={props.saveCustomTheme}
              />
            )}
            {activeSection === 'customization' && (
              <CustomizationSection 
                notepadTemplates={props.notepadTemplates} setNotepadTemplates={props.setNotepadTemplates}
                propTemplates={props.propTemplates} setPropTemplates={props.setPropTemplates}
                reorderNotepadTemplates={props.reorderNotepadTemplates} reorderPropTemplates={props.reorderPropTemplates}
                defaultNotepad={props.defaultNotepad} setDefaultNotepad={props.setDefaultNotepad}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingsPopup;