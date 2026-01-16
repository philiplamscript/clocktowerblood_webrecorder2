"use client";

import React from 'react';
import { X, Users, Vote, ShieldAlert, FileText } from 'lucide-react';
import PlayersTab from '../../tabs/PlayersTab';
import VotesTab from '../../tabs/VotesTab';
import CharsTab from '../../tabs/CharsTab';
import NotesTab from '../../tabs/NotesTab';
import { type IdentityMode } from '../../../type';

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
  identityMode?: IdentityMode;
}

const LedgerTabsPopup: React.FC<LedgerTabsPopupProps> = ({
  isOpen, onClose, activeTab, setActiveTab,
  players, setPlayers, nominations, setNominations,
  chars, setChars, note, setNote,
  playerCount, setPlayerCount, roleDist, setRoleDist,
  deadPlayers, addNomination,
  isDragging, setIsDragging, dragAction, setDragAction,
  lastDraggedPlayer, setLastDraggedPlayer,
  identityMode
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
      <div className="bg-[var(--bg-color)] rounded-2xl shadow-2xl border border-[var(--border-color)] w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 transition-colors duration-500">
        <header className="flex-none bg-[var(--header-color)] text-white px-4 py-3 flex justify-between items-center transition-colors duration-500">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest opacity-60">Game Ledger</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </header>

        <nav className="flex-none bg-[var(--panel-color)] border-b border-[var(--border-color)] flex shadow-sm transition-colors duration-500">
          {tabs.map((t) => (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id as any)} 
              className={`flex-1 py-3 flex flex-col items-center gap-1 border-b-2 transition-all ${
                activeTab === t.id 
                  ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5 text-[var(--accent-color)]' 
                  : 'border-transparent text-[var(--muted-color)] hover:text-[var(--text-color)]'
              }`}
            >
              <t.icon size={16} /><span className="text-[10px] font-black uppercase tracking-tighter">{t.label}</span>
            </button>
          ))}
        </nav>

        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {activeTab === 'players' && <PlayersTab players={players} setPlayers={setPlayers} identityMode={identityMode} />}
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