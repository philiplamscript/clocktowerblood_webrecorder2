"use client";

import React from 'react';
import { X, Users, Vote, ShieldAlert, FileText } from 'lucide-react';
import PlayersTab from '../../tabs/PlayersTab';
import VotesTab from '../../tabs/VotesTab';
import CharsTab from '../../tabs/CharsTab';
import NotesTab from '../../tabs/NotesTab';

interface LedgerTabsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'players' | 'votes' | 'chars' | 'notes';
  setActiveTab: (tab: 'players' | 'votes' | 'chars' | 'notes') => void;
  players: any[];
  setPlayers: any;
  nominations: any[];
  setNominations: any;
  chars: any;
  setChars: any;
  note: string;
  setNote: any;
  playerCount: number;
  setPlayerCount: any;
  roleDist: any;
  setRoleDist: any;
  deadPlayers: number[];
  addNomination: () => void;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  dragAction: 'add' | 'remove' | null;
  setDragAction: (v: 'add' | 'remove' | null) => void;
  lastDraggedPlayer: number | null;
  setLastDraggedPlayer: (v: number | null) => void;
}

const LedgerTabsPopup: React.FC<LedgerTabsPopupProps> = ({
  isOpen, onClose, activeTab, setActiveTab,
  players, setPlayers, nominations, setNominations,
  chars, setChars, note, setNote,
  playerCount, setPlayerCount, roleDist, setRoleDist,
  deadPlayers, addNomination,
  isDragging, setIsDragging, dragAction, setDragAction,
  lastDraggedPlayer, setLastDraggedPlayer
}) => {
  if (!isOpen) return null;

  const tabs = [
    { id: 'players', icon: Users, label: 'PLAYERS' },
    { id: 'votes', icon: Vote, label: 'VOTES' },
    { id: 'chars', icon: ShieldAlert, label: 'ROLES' },
    { id: 'notes', icon: FileText, label: 'NOTES' },
  ];

  return (
    <div className="fixed inset-0 z-[10005] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-100 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <header className="flex-none bg-slate-900 text-white px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Game Ledger</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </header>

        <nav className="flex-none bg-white border-b flex shadow-sm">
          {tabs.map((t) => (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id as any)} 
              className={`flex-1 py-3 flex flex-col items-center gap-1 border-b-2 transition-all ${activeTab === t.id ? 'border-red-600 bg-red-50 text-red-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              <t.icon size={16} /><span className="text-[10px] font-black uppercase tracking-tighter">{t.label}</span>
            </button>
          ))}
        </nav>

        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {activeTab === 'players' && <PlayersTab players={players} setPlayers={setPlayers} />}
            {activeTab === 'votes' && (
              <VotesTab 
                nominations={nominations} setNominations={setNominations} 
                isDragging={isDragging} setIsDragging={setIsDragging} 
                dragAction={dragAction} setDragAction={setDragAction} 
                lastDraggedPlayer={lastDraggedPlayer} setLastDraggedPlayer={setLastDraggedPlayer} 
                deadPlayers={deadPlayers} playerCount={playerCount} 
                addNomination={addNomination} 
              />
            )}
            {activeTab === 'chars' && (
              <CharsTab 
                chars={chars} setChars={setChars} 
                playerCount={playerCount} setPlayerCount={setPlayerCount} 
                roleDist={roleDist} setRoleDist={setRoleDist} 
              />
            )}
            {activeTab === 'notes' && <NotesTab note={note} setNote={setNote} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LedgerTabsPopup;