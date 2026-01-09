"use client";

import React from 'react';
import { ShieldAlert, BookOpen, Split, Eye, Menu } from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  splitView: boolean;
  setSplitView: (split: boolean) => void;
  showHub: boolean;
  setShowHub: (show: boolean) => void;
  setShowLedger: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  setSidebarOpen, splitView, setSplitView, showHub, setShowHub, setShowLedger 
}) => {
  return (
    <header className="flex-none bg-slate-900 text-white px-3 py-2 flex justify-between items-center shadow-md z-50">
      <div className="flex items-center gap-2">
        <button onClick={() => setSidebarOpen(true)} className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400">
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-1.5 ml-1">
          <ShieldAlert className="text-red-500" size={14} />
          <h1 className="font-black text-xs uppercase italic tracking-tighter">BOTCT-ClockTracker v0.3</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setSplitView(!splitView)} className={`p-1 rounded transition-colors ${splitView ? 'text-blue-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'}`}>
          <Split size={14} />
        </button>
        <button onClick={() => setShowLedger(true)} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all shadow-sm">
          <BookOpen size={12} /> Full Ledger
        </button>
        <div className="h-4 w-px bg-slate-700 mx-1" />
        <button onClick={() => setShowHub(!showHub)} className={`p-1 rounded transition-colors ${showHub ? 'text-blue-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'}`}>
          <Eye size={14} />
        </button>
      </div>
    </header>
  );
};

export default Header;