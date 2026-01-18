"use client";

import React, { useState } from 'react';
import { Type, Globe, RotateCcw, ShieldAlert, Hash, User, Save, Database, History, Trash2, CheckCircle2, PlayCircle } from 'lucide-react';
import { type IdentityMode, type SessionMeta } from '../../../../type';

interface GeneralSectionProps {
  fontSize: 'small' | 'mid' | 'large';
  setFontSize: (size: 'small' | 'mid' | 'large') => void;
  language: string;
  setLanguage: (lang: string) => void;
  identityMode: IdentityMode;
  setIdentityMode: (mode: IdentityMode) => void;
  resetCustomization: () => void;
  storagePrefix: string;
  switchStoragePath: (path: string) => void;
  sessions: SessionMeta[];
  saveSessionSnapshot: (name: string) => void;
  loadSession: (session: SessionMeta) => void;
  deleteSession: (id: string) => void;
}

const GeneralSection: React.FC<GeneralSectionProps> = ({ 
  fontSize, setFontSize, language, setLanguage, identityMode, setIdentityMode, resetCustomization,
  storagePrefix, switchStoragePath, sessions, saveSessionSnapshot, loadSession, deleteSession
}) => {
  const [newPath, setNewPath] = useState(storagePrefix);
  const [newSessionName, setNewSessionName] = useState('');

  const handleSaveSession = () => {
    if (newSessionName.trim()) {
      saveSessionSnapshot(newSessionName.trim());
      setNewSessionName('');
    }
  };

  return (
    <div className="space-y-10">
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

      <section className="pt-6 border-t border-slate-100 space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Save size={14} /> Game Sessions (Snapshots)
        </h3>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-sm">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Session Name (e.g. Saturday Night Game)..." 
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
            />
            <button 
              onClick={handleSaveSession}
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-all active:scale-95 shadow-md"
            >
              <Save size={14} /> Snapshot
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {sessions.map(session => (
              <div key={session.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${session.storagePrefix === storagePrefix ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-700">{session.name}</span>
                    {session.storagePrefix === storagePrefix && <CheckCircle2 size={12} className="text-blue-500" />}
                  </div>
                  <span className="text-[8px] text-slate-400 font-mono">
                    {new Date(session.lastSaved).toLocaleString()} • {session.storagePrefix}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {session.storagePrefix !== storagePrefix && (
                    <button 
                      onClick={() => loadSession(session)}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Load this session"
                    >
                      <PlayCircle size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteSession(session.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete session data"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-6 border-t border-slate-100 space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Database size={14} /> Storage Path (Prefix)
        </h3>
        <p className="text-[10px] text-slate-500 leading-relaxed italic">
          Advanced: Change the base key for data persistence. This effectively switches "save slots" at a global level.
        </p>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={newPath} 
            onChange={(e) => setNewPath(e.target.value)} 
            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[10px] focus:ring-2 focus:ring-indigo-500/20"
          />
          <button 
            onClick={() => switchStoragePath(newPath)}
            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all active:scale-95"
          >
            Switch Path
          </button>
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