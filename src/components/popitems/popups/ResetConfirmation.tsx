"use client";

import React from 'react';
import { AlertTriangle, Save } from 'lucide-react';

interface ResetConfirmationProps {
  showReset: boolean;
  setShowReset: (show: boolean) => void;
  reset: () => void;
}

const ResetConfirmation: React.FC<ResetConfirmationProps> = ({
  showReset,
  setShowReset,
  reset
}) => {
  if (!showReset) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded shadow-2xl p-6 max-w-xs text-center space-y-4">
        <AlertTriangle className="mx-auto text-red-600" size={32} />
        <h2 className="font-black uppercase tracking-tighter">Confirm Reset?</h2>
        <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex items-start gap-2 text-left">
          <Save size={14} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[9px] text-amber-800 font-bold leading-relaxed">
            Did you save your session? Go to Settings &gt; General to take a snapshot if you want to keep this game's data.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowReset(false)} className="flex-1 py-2 bg-slate-100 rounded text-[10px] font-bold uppercase">CANCEL</button>
          <button onClick={() => {reset();setShowReset(false);}} className="flex-1 py-2 bg-red-600 text-white rounded text-[10px] font-black tracking-widest">RESET ALL but Role name</button>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmation;