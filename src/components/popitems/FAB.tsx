"use client";

import React from 'react';
import { BookOpen, X } from 'lucide-react';

interface FABProps {
  showLedger: boolean;
  setShowLedger: (show: boolean) => void;
}

const FAB: React.FC<FABProps> = ({ showLedger, setShowLedger }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[20000]">
      <button 
        onClick={() => setShowLedger(!showLedger)} 
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-all active:scale-75 ${showLedger ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-red-600 text-white hover:bg-red-700'}`}
        title={showLedger ? "Close Ledger" : "Open Full Ledger"}
      >
        {showLedger ? <X size={24} /> : <BookOpen size={24} />}
      </button>
    </div>
  );
};

export default FAB;