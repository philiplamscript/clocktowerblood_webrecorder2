"use client";

import React from 'react';
import { 
  RotateCcw,
  Edit,
  History,
  UserCircle,
  Settings,
  HelpCircle,
  Info,
  Heart,
  X,
  Database,
  RefreshCw
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
  onSaveCSV: () => void;
  onLoadCSV: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen, setIsOpen, onReset, onLoadRole, onShowUpdateLog, 
  onFocusPlayerDetail, onOpenSettings, onShowHowToUse, 
  onShowAbout, onShowFAQ, onShowDonation, onSaveCSV, onLoadCSV
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
      {/* Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[10006] animate-in fade-in duration-300" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      <aside className={`fixed top-0 left-0 h-full bg-slate-900 z-[10007] border-r border-slate-800 transition-all duration-300 flex flex-col shadow-2xl ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img src="/The_Minimalist_Wheel.svg" alt="Logo" className="w-6 h-6 shrink-0" />
            <h2 className="text-white font-black text-sm uppercase tracking-tighter truncate">Menu</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Upper Section */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 no-scrollbar">
          <div className="mb-2 px-3 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Management</div>
          <NavItem icon={Edit} label="Load Role" onClick={onLoadRole} color="text-blue-400" />
          <NavItem icon={RotateCcw} label="Reset session" onClick={onReset} color="text-red-500" />
          <NavItem icon={UserCircle} label="Player Roster" onClick={onFocusPlayerDetail} color="text-emerald-500" />
          <NavItem icon={Settings} label="Settings" onClick={onOpenSettings} color="text-slate-400" />
          
          <div className="mt-4 mb-2 px-3 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Data Backup</div>
          <NavItem icon={Database} label="Backup All Data" onClick={onSaveCSV} color="text-indigo-400" />
          <NavItem icon={RefreshCw} label="Restore From Folder" onClick={onLoadCSV} color="text-amber-400" />
        </div>

        {/* Lower Section */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <div className="mb-2 px-3 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Information</div>
          <NavItem icon={HelpCircle} label="How to use?" onClick={onShowHowToUse} color="text-indigo-400" />
          <NavItem icon={Info} label="About" onClick={onShowAbout} color="text-slate-400" />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;