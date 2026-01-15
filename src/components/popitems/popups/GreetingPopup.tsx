"use client";

import React from 'react';
import { 
  X, 
  MousePointer2, 
  MoveRight, 
  Calendar, 
  Zap, 
  Skull, 
  Tag, 
  CheckCircle2,
  Info
} from 'lucide-react';

interface GreetingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const GreetingPopup: React.FC<GreetingPopupProps> = ({ isOpen, onClose, title = "Welcome to BOTCT-ClockTracker" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-center space-y-4 shrink-0">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-900/20">
            <img src="/The_Minimalist_Wheel.svg" alt="Logo" className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-white font-black text-xl uppercase tracking-tighter">{title}</h1>
            <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-widest font-black">Digital Grimoire Companion</p>
          </div>
        </div>
        
        {/* Content Scroll Area */}
        <div className="p-6 space-y-6 overflow-y-auto no-scrollbar">
          
          {/* Section: Nominations */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <Zap size={14} className="text-yellow-500" />
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Nominations & Voting</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex gap-4 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="w-10 h-10 shrink-0 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-blue-500 shadow-sm">
                  <MousePointer2 size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">Slide to Nominate</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Click a player slice and <span className="text-blue-600 font-bold">Slide Across</span> the clock to the target to create a nomination link.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="w-10 h-10 shrink-0 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-red-500 shadow-sm">
                  <CheckCircle2 size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">Record Votes</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Tap the center ball to enter <span className="text-red-600 font-bold">Voting Mode</span>, then tap players to toggle their votes.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Game Flow */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <Calendar size={14} className="text-blue-500" />
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Game Flow Control</h3>
            </div>
            <div className="flex gap-4 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="w-10 h-10 shrink-0 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm">
                <div className="flex items-center gap-0.5">
                  <MoveRight size={16} className="animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">Swipe Day Change</p>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Swipe <span className="text-slate-900 font-bold">Left/Right</span> on the center sphere to quickly advance or regress the current game day.</p>
              </div>
            </div>
          </section>

          {/* Section: Quick Assignment */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <Info size={14} className="text-emerald-500" />
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Quick Tags & Death</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                <Skull size={16} className="text-red-500" />
                <p className="text-[9px] font-black text-slate-800 uppercase tracking-tighter leading-tight">Death Mode</p>
                <p className="text-[9px] text-slate-500 leading-snug">Toggle Death Mode, then tap players to execute.</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                <Tag size={16} className="text-blue-500" />
                <p className="text-[9px] font-black text-slate-800 uppercase tracking-tighter leading-tight">Prop Mode</p>
                <p className="text-[9px] text-slate-500 leading-snug">Toggle Prop Mode to assign status effects (Drunk, etc).</p>
              </div>
            </div>
          </section>

          <button 
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shrink-0 mt-4"
          >
            Got it, Let's Play
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