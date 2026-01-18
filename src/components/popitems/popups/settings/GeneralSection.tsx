"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Hash, User, Save, CheckCircle2, Trash2, PlayCircle, Download, Upload, FileJson, Clock } from 'lucide-react';
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

  // Default session name to current datetime
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

  const exportAllData = () => {
    const allData: Record<string, any> = {};
    // We export everything starting with ct_ (configs) and the save paths
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('ct_') || key.includes('/save/'))) {
        allData[key] = localStorage.getItem(key);
      }
    }
    
    // Also explicitly include the session index for the current path
    const sessionIndexKey = `main_sessions_index`;
    allData[sessionIndexKey] = localStorage.getItem(sessionIndexKey);
    
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clocktracker_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Backup exported successfully!');
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        const sessionIndexKey = `main_sessions_index`;
        
        // 1. Handle the Session Index Merge
        const currentSessions: SessionMeta[] = JSON.parse(localStorage.getItem(sessionIndexKey) || '[]');
        const importedSessions: SessionMeta[] = importedData[sessionIndexKey] ? JSON.parse(importedData[sessionIndexKey]) : [];
        
        // Create a map of existing IDs to avoid duplicates
        const existingIds = new Set(currentSessions.map(s => s.id));
        const mergedSessions = [...currentSessions];
        
        importedSessions.forEach(s => {
          if (!existingIds.has(s.id)) {
            mergedSessions.push(s);
          }
        });
        
        // 2. Save all imported keys EXCEPT the session index (which we merged)
        Object.entries(importedData).forEach(([key, val]) => {
          if (key !== sessionIndexKey) {
            // Only write if it doesn't exist or if it's specific session data
            // This prevents overwriting your current global settings if they already exist
            if (!localStorage.getItem(key) || key.includes('/save/')) {
              localStorage.setItem(key, val as string);
            }
          }
        });
        
        // 3. Save the merged index
        localStorage.setItem(sessionIndexKey, JSON.stringify(mergedSessions));

        toast.success('Sessions merged successfully! Reloading...');
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        toast.error('Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };

  const sortedSessions = [...sessions].sort((a, b) => b.lastSaved - a.lastSaved);

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="space-y-3">
        <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
          <FileJson size={14} /> Backup & Sync
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={exportAllData}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all group"
          >
            <Download size={20} className="text-indigo-500 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-black uppercase">Export All</span>
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all group"
          >
            <Upload size={20} className="text-emerald-500 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-black uppercase">Merge Import</span>
            <input type="file" ref={fileInputRef} onChange={importData} className="hidden" accept=".json" />
          </button>
        </div>
        <p className="text-[8px] text-slate-400 italic px-1">
          * Merge Import adds new sessions from the file to your current list without deleting anything.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <User size={14} /> Identity Display Mode
        </h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            onClick={() => setIdentityMode('number')}
            className={`flex-1 py-3 rounded-xl border-2 font-black uppercase text-[9px] sm:text-[10px] transition-all flex items-center justify-center gap-2 ${identityMode === 'number' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
          >
            <Hash size={12} /> Number Base
          </button>
          <button 
            onClick={() => setIdentityMode('name')}
            className={`flex-1 py-3 rounded-xl border-2 font-black uppercase text-[9px] sm:text-[10px] transition-all flex items-center justify-center gap-2 ${identityMode === 'name' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
          >
            <User size={12} /> Player Name Base
          </button>
        </div>
      </section>

      <section className="pt-6 border-t border-slate-100 space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Save size={14} /> Game Sessions
        </h3>
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-2">
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
              <Save size={14} /> Save Snapshot
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