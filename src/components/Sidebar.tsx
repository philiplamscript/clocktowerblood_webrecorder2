"use client";

import React from 'react';
import { 
  ShieldAlert, 
  RotateCcw, 
  FileEdit, 
  History, 
  UserCircle, 
  Settings, 
  HelpCircle, 
  Info, 
  MessageSquare, 
  Heart,
  ChevronLeft,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onReset: () => void;
  onLoadRole: () => void;
  onShowUpdateLog: () => void;
  onFocusPlayerDetail: () => void;
  onOpenSettings: () => void;
  onShowHowToUse: () => void;
  onShowAbout: () => void;
  onShowFAQ: () => void;
  onShowDonation: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen, setIsOpen, onReset, onLoadRole, onShowUpdateLog, 
  onFocusPlayerDetail, onOpenSettings, onShowHowToUse, 
  onShowAbout, onShowFAQ, onShowDonation
}) => {
  const NavItem = ({ icon: Icon, label, onClick, color = "text-slate-400" }: any) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 group"
    >
      <Icon size={18} className={`${color} group-hover:scale-110 transition-transform`} />
      <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[10006] md:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-full bg-slate-900 z-[10007] border-r border-slate-800 transition-all duration-300 flex flex-col ${isOpen ? 'w-64' : 'w-0 -translate-x-full md:translate-x-0 md:w-16'}`}>
        {/* Header */}
        <div className={`flex items-center h-14 px-4 border-b border-slate-800 overflow-hidden ${!isOpen && 'md:justify-center md:px-0'}`}>
          <div className="flex items-center gap-3 min-w-[200px]">
            <ShieldAlert className="text-red-500 shrink-0" size={24} />
            <h2 className="text-white font-black text-sm uppercase tracking-tighter truncate">Ledger Menu</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className={`md:hidden text-slate-400 hover:text-white transition-colors`}>
            <X size={20} />
          </button>
        </div>

        {/* Upper Section */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          <div className={`mb-2 px-3 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ${!isOpen && 'md:hidden'}`}>Management</div>
          <NavItem icon={FileEdit} label="Load Role" onClick={onLoadRole} color="text-blue-400" />
          <NavItem icon={RotateCcw} label="Reset session" onClick={onReset} color="text-red-500" />
          <NavItem icon={History} label="Update Log" onClick={onShowUpdateLog} color="text-yellow-500" />
          <NavItem icon={UserCircle} label="Player Detail" onClick={onFocusPlayerDetail} color="text-emerald-500" />
          <NavItem icon={Settings} label="Settings" onClick={onOpenSettings} color="text-slate-400" />
        </div>

        {/* Lower Section */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <div className={`mb-2 px-3 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ${!isOpen && 'md:hidden'}`}>Information</div>
          <NavItem icon={HelpCircle} label="How to use?" onClick={onShowHowToUse} color="text-indigo-400" />
          <NavItem icon={Info} label="About" onClick={onShowAbout} color="text-slate-400" />
          <NavItem icon={MessageSquare} label="FAQ" onClick={onShowFAQ} color="text-slate-400" />
          <NavItem icon={Heart} label="Donation" onClick={onShowDonation} color="text-pink-500" />
        </div>

        {/* Desktop Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:flex absolute top-1/2 -right-3 w-6 h-12 bg-slate-800 border border-slate-700 rounded-full items-center justify-center text-slate-400 hover:text-white transition-all hover:scale-110 active:scale-95"
        >
          <ChevronLeft size={14} className={`transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`} />
        </button>
      </aside>
    </>
  );
};

export default Sidebar;