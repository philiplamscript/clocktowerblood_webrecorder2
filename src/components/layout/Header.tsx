"use client";

import React from 'react';
import { ShieldAlert, Split, BookOpen, Eye, EyeOff } from 'lucide-react';

interface HeaderProps {
  splitView: boolean;
  setSplitView: (v: boolean) => void;
  showHub: boolean;
  setShowHub: (v: boolean) => void;
  setShowLedger: (v: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ splitView, setSplitView, showHub, setShowHub, setShowLedger }) => {
  return (
    <header className="flex-none bg-slate-900 text-white px-3 py-2 flex justify-between items-center shadow-md z-50">
      <div className="flex items-center gap-1.5">
        <ShieldAlert className="text-red-500" size={14} />
        <h1 className="font-black text-xs uppercase italic tracking-tighter">LEDGER PRO v3.8</h1>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setSplitView(!splitView)} 
          className={`p-1 rounded transition-colors ${splitView ? 'text-blue-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'}`}
        >
          <Split size={14} />
        </button>
        <button 
          onClick={() => setShowLedger(true)} 
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all shadow-sm"
        >
          <BookOpen size={12} /> Full Ledger
        </button>
        <div className="h-4 w-px bg-slate-700 mx-1" />
        <button 
          onClick={() => setShowHub(!showHub)} 
          className={`p-1 rounded transition-colors ${showHub ? 'text-blue-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'}`}
        >
          {showHub ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </div>
    </header>
  );
};

export default Header;