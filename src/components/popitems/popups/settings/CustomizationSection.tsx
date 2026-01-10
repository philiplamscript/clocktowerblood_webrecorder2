"use client";

import React, { useState } from 'react';
import { FileText, Plus, Trash2, Tag, ChevronUp, ChevronDown } from 'lucide-react';
import { type NotepadTemplate, type PropTemplate } from '../../../../type';

interface CustomizationSectionProps {
  notepadTemplates: NotepadTemplate[];
  setNotepadTemplates: (templates: NotepadTemplate[]) => void;
  propTemplates: PropTemplate[];
  setPropTemplates: (templates: PropTemplate[]) => void;
  reorderNotepadTemplates: (fromIndex: number, toIndex: number) => void;
  reorderPropTemplates: (fromIndex: number, toIndex: number) => void;
  defaultNotepad: string;
  setDefaultNotepad: (content: string) => void;
}

const CustomizationSection: React.FC<CustomizationSectionProps> = ({
  notepadTemplates, setNotepadTemplates, propTemplates, setPropTemplates,
  reorderNotepadTemplates, reorderPropTemplates, defaultNotepad, setDefaultNotepad
}) => {
  const [subTab, setSubTab] = useState<'notepad' | 'props'>('notepad');

  const addNotepadTemplate = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotepadTemplates([...notepadTemplates, { id, label: 'New Template', content: '' }]);
  };

  const addPropTemplate = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setPropTemplates([...propTemplates, { id, label: 'New Prop', value: '🏷️' }]);
  };

  return (
    <div className="space-y-6">
      <nav className="flex border-b border-slate-200">
        <button 
          onClick={() => setSubTab('notepad')}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider transition-all ${subTab === 'notepad' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Notepad Templates
        </button>
        <button 
          onClick={() => setSubTab('props')}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider transition-all ${subTab === 'props' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Property Shortcuts
        </button>
      </nav>

      {subTab === 'notepad' && (
        <div className="space-y-4">
          <section className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FileText size={14} /> Default Notepad (Apply after Reset)
            </h3>
            <textarea 
              className="w-full bg-white border border-slate-200 rounded-lg p-3 text-[11px] focus:ring-0 h-24 resize-none font-mono"
              value={defaultNotepad}
              onChange={(e) => setDefaultNotepad(e.target.value)}
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
                {propTemplates.map((template, index) => (
                  <tr key={template.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <button 
                          onClick={() => index > 0 && reorderPropTemplates(index, index - 1)}
                          disabled={index === 0}
                        >
                          <ChevronUp size={12} />
                        </button>
                        <button 
                          onClick={() => index < propTemplates.length - 1 && reorderPropTemplates(index, index + 1)}
                          disabled={index === propTemplates.length - 1}
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
                        className="text-slate-300 hover:text-red-500"
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
  );
};

export default CustomizationSection;