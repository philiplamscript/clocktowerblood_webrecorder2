"use client";

import React from 'react';
import { ShieldAlert, X } from 'lucide-react';

interface GreetingPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const GreetingPopup: React.FC<GreetingPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-slate-900 p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-900/20">
            <ShieldAlert size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-black text-xl uppercase tracking-tighter">Welcome to BOTCT-ClockTracker</h1>
            <p className="text-slate-400 text-xs mt-1">Blood on the Clocktower - Tracker Tool</p>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {/* <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-none w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px]">1</div>
              <p className="text-[11px] text-slate-600 leading-relaxed">Use the **Player Hub** at the top to quickly assign death reasons or properties.</p>
            </div>
            <div className="flex gap-3">
              <div className="flex-none w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px]">2</div>
              <p className="text-[11px] text-slate-600 leading-relaxed">Slide from one player to another on the **Voting Clock** to record a nomination.</p>
            </div>
            <div className="flex gap-3">
              <div className="flex-none w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px]">3</div>
              <p className="text-[11px] text-slate-600 leading-relaxed">The **Global View** (split screen) helps you track the overall state of the game.</p>
            </div>
          </div> */}
          
          <button 
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg"
          >
            Start Your Tracking
          </button>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default GreetingPopup;