"use client";

import React from 'react';
import { BookOpen } from 'lucide-react';

interface FABProps {
  setShowLedger: (show: boolean) => void;
}

const FAB: React.FC<FABProps> = ({ setShowLedger }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[10000]">
      <button 
        onClick={() => setShowLedger(true)} 
        className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-all active:scale-75 hover:bg-red-700"
        title="Open Full Ledger"
      >
        <BookOpen size={24} />
      </button>
    </div>
  );
};

export default FAB;