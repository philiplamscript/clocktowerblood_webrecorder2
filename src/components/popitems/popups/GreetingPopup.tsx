"use client";

import React from 'react';
import { 
  X, 
  MousePointer2, 
  MoveRight, 
  Zap, 
  Skull, 
  Tag, 
  CheckCircle2,
  BookOpen,
  Edit3,
  Search,
  Users,
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
            <img src="/The_Minimalist_Wheel.svg" alt="logo" className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-white font-black text-xl uppercase tracking-tighter">{title}</h1>
            <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-widest font-black">Digital Grimoire Companion</p>
          </div>
        </div>
        
        {/* Content Scroll Area */}
        <div className="p-6 space-y-8 overflow-y-auto no-scrollbar">
          
          {/* Section: Note Recording */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <Users size={14} className="text-blue-500" />
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">1. Player Notes</h3>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex gap-4 items-center">
              <div className="w-10 h-10 shrink-0 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
                <img src="how2use/screen-1.jpg" alt="Logo" className="w-120 h-240" />
              </div>
              <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                Tap any player in the top <span className="text-slate-900 font-bold">Player Hub</span> to record social reads and role claims in their private notepad.
              </p>
            </div>
          </section>

          {/* Section: Nomination Flow */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <Zap size={14} className="text-yellow-500" />
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">2. The Nomination Flow</h3>
            </div>
            <div className="space-y-2">
              <div className="flex gap-3 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <img src="how2use/screen-2.0.jpg" alt="Logo" className="w-120 h-240" />
                <p className="text-[10px] text-slate-600 font-medium"><span className="font-bold text-slate-900">Link:</span> Slide from Nominee to Target on the clock.</p>
              </div>
              <div className="flex gap-3 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <img src="how2use/screen-2.1.jpg" alt="Logo" className="w-120 h-240" />
                <p className="text-[10px] text-slate-600 font-medium"><span className="font-bold text-slate-900">Verify:</span> Update info/notes on the pending badge before voting.</p>
              </div>
              <div className="flex gap-3 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <img src="how2use/screen-2.2.jpg" alt="Logo" className="w-120 h-240" />
                <p className="text-[10px] text-slate-600 font-medium"><span className="font-bold text-slate-900">Vote:</span> Enter Voting Mode (center ball) to toggle player votes.</p>
              </div>
            </div>
          </section>

          {/* Section: Clock Interaction */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <Skull size={14} className="text-red-500" />
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">3. Quick Assignment</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center gap-2">
                  <img src="how2use/screen-3.jpg" alt="Logo" className="w-120 h-240" />
                </div>
                <p className="text-[9px] text-slate-500 leading-snug">Toggle <span className="font-bold text-slate-900">Death/Prop</span> mode, then tap clock slices to execute or tag.</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                <MoveRight size={14} className="text-slate-600" />
                <p className="text-[9px] text-slate-500 leading-snug">Swipe <span className="font-bold text-slate-900">Left/Right</span> on the center sphere to travel through game days.</p>
              </div>
            </div>
          </section>

          {/* Section: Reviewing */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <Search size={14} className="text-indigo-500" />
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">4. Review & Ledgers</h3>
            </div>
            <div className="space-y-2">
              <div className="flex gap-3 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <img src="how2use/screen-4.jpg" alt="Logo" className="w-120 h-240" />
                <p className="text-[10px] text-slate-600 font-medium">Toggle <span className="font-bold text-slate-900">V/R/G</span> modes in Detail View to visualize patterns.</p>
              </div>
              <div className="flex gap-3 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <img src="how2use/screen-5.jpg" alt="Logo" className="w-120 h-240" />
                <img src="how2use/screen-5.1.jpg" alt="Logo" className="w-120 h-240" />
                <p className="text-[10px] text-slate-600 font-medium">Open <span className="font-bold text-slate-900">Full Ledger</span> for detailed Player/Vote/Role tables.</p>
              </div>
            </div>
          </section>

          {/* Section: Setup */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <Edit3 size={14} className="text-slate-400" />
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">5. Script Setup</h3>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex gap-4 items-center">
              <div className="w-10 h-10 shrink-0 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm">
                <img src="how2use/screen-6.jpg" alt="Logo" className="w-120 h-240" />
              </div>
              <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                Use <span className="text-slate-900 font-bold">Load Role</span> in the Sidebar to quickly paste and update your script character list.
              </p>
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