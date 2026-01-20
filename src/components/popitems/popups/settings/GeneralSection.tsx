"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Hash, User, Save, CheckCircle2, Trash2, PlayCircle, Download, Upload, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
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
  identityMode, setIdentityMode,
  storagePrefix, sessions, saveSessionSnapshot, loadSession, deleteSession
}) => {
  const [newSessionName, setNewSessionName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reference the parent key based on storagePrefix context
  // Usually this is "main" in this app's current implementation
  const globalPath = 'main'; 

  useEffect(() => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].slice(0, 5);
    setNewSessionName(`${dateStr} ${timeStr}`);
  }, [sessions]);

  const handleSaveSession = () => {
    if (newSessionName.trim()) {
      saveSessionSnapshot(newSessionName.trim());
    }
  };

  const exportSession = (session: SessionMeta) => {
    const sessionData: Record<string, any> = {};
    const keys = ['day', 'count', 'players', 'nominations', 'deaths', 'chars', 'dist', 'note', 'showHub', 'splitView'];
    
    sessionData['session_meta'] = session;
    
    keys.forEach(k => {
      const val = localStorage.getItem(`${globalPath}/save/${session.id}/${k}`);
      if (val) sessionData[k] = val;
    });

    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clocktracker_record_${session.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Session exported!');
  };

  const importSession = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        const meta = data.session_meta as SessionMeta;
        
        if (!meta || !meta.id) throw new Error('Invalid session file');

        const newId = `imp_${Date.now()}`;
        const newMeta = { 
          id: newId, 
          name: `Import: ${meta.name}`, 
          storagePrefix: newId, 
          lastSaved: Date.now() 
        };

        // Save game data to local storage using the new ID
        Object.entries(data).forEach(([key, val]) => {
          if (key !== 'session_meta') {
            localStorage.setItem(`${globalPath}/save/${newId}/${key}`, val as string);
          }
        });

        // Update session index in local storage
        const sessionsKey = `${globalPath}_sessions_index`;
        const existing: SessionMeta[] = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
        localStorage.setItem(sessionsKey, JSON.stringify([newMeta, ...existing]));

        toast.success('Record importing! Refreshing...');
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        toast.error('Invalid record file.');
      }
    };
    reader.readAsText(file);
  };

  const sortedSessions = [...sessions].sort((a, b) => {
    // 1. If 'a' is the default, move it up (return negative)
  if (a.id === 'default') return -1;
  
  // 2. If 'b' is the default, move it up (return positive)
  if (b.id === 'default') return 1;

  // 3. Otherwise, sort by lastSaved descending
  return b.lastSaved - a.lastSaved;
  });

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <User size={14} /> Identity Display Mode
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setIdentityMode('number')}
            className={`flex-1 py-3 rounded-xl border-2 font-black uppercase text-[10px] transition-all flex items-center justify-center gap-2 ${identityMode === 'number' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
          >
            <Hash size={12} /> Number
          </button>
          <button 
            onClick={() => setIdentityMode('name')}
            className={`flex-1 py-3 rounded-xl border-2 font-black uppercase text-[10px] transition-all flex items-center justify-center gap-2 ${identityMode === 'name' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
          >
            <User size={12} /> Name
          </button>
        </div>
      </section>

      <section className="pt-6 border-t border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Save size={14} /> Session Snapshots
          </h3>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase hover:bg-emerald-100 transition-colors"
          >
            <Upload size={12} /> Import Record
            <input type="file" ref={fileInputRef} onChange={importSession} className="hidden" accept=".json" />
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-sm">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Clock size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Session Name..." 
                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
              />
            </div>
            <button 
              onClick={handleSaveSession}
              className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
            >
              <Save size={14} /> Snapshot
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1 no-scrollbar">
            {sortedSessions.map(session => (
              <div key={session.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${session.id === storagePrefix ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-700 truncate">{session.name}</span>
                    {session.id === storagePrefix && <CheckCircle2 size={12} className="text-blue-500 shrink-0" />}
                  </div>
                  <span className="text-[8px] text-slate-400 font-mono truncate">
                    {new Date(session.lastSaved).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button 
                    onClick={() => exportSession(session)}
                    className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                    title="Export Record"
                  >
                    <Download size={16} />
                  </button>
                  <button 
                    onClick={() => loadSession(session)}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Load"
                  >
                    <PlayCircle size={18} />
                  </button>
                  {session.id !== 'default' && (
                    <button 
                      onClick={() => deleteSession(session.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GeneralSection;