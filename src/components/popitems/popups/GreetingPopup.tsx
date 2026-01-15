"use client";

import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight,
  Zap, 
  Skull, 
  Edit3,
  Search,
  Users,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface GreetingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const GreetingPopup: React.FC<GreetingPopupProps> = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);

  if (!isOpen) return null;

  const pages = [
    {
      title: "Welcome to ClockTracker",
      icon: <Sparkles size={16} className="text-red-500" />,
      images: [],
      content: "A digital companion for Blood on the Clocktower. Track votes, manage roles, and solve the mystery with elegance and speed."
    },
    {
      title: "1. Player Notes",
      icon: <Users size={16} className="text-blue-500" />,
      images: ["/how2use/screen-1.jpg"],
      content: "Tap any player in the hub❶ to record social reads and role claims in their private notepad❷. This keeps your data organized per player."
    },
    {
      title: "2. Nomination Flow",
      icon: <Zap size={16} className="text-yellow-500" />,
      images: ["/how2use/screen-2.0.jpg", "/how2use/screen-2.1.jpg", "/how2use/screen-2.2.jpg"],
      content: `Slide from Nominee to Target on the clock to create a link❶. Before Voting still able review/edit player notes❷.Enter Voting Mode in the center to toggle voter status.`
    },
    {
      title: "3. Quick Assignment",
      icon: <Skull size={16} className="text-red-500" />,
      images: ["/how2use/screen-3.jpg"],
      content: "Toggle Death or Property mode❶, then tap clock slices to tag players. Swipe the center ball❷ to change the current game day."
    },
    {
      title: "4. Pattern Review",
      icon: <Search size={16} className="text-indigo-500" />,
      images: ["/how2use/screen-4.jpg"],
      content: "V/R/G modes help visualize patterns❶. See who voted for whom and global trends. Able/Disable layer❷. Use the ring filter❸ to focus on specific days."
    },
    {
      title: "5. Full Ledgers",
      icon: <BookOpen size={16} className="text-emerald-500" />,
      images: ["/how2use/screen-5.2.jpg", "/how2use/screen-5.3.jpg", "/how2use/screen-5.4.jpg"],
      content: "Access detailed tables for player records, all nominations, and the full role script for the session."
    },
    {
      title: "6. Script Setup",
      icon: <Edit3 size={16} className="text-slate-400" />,
      images: ["/how2use/screen-6.jpg"],
      content: "Use the sidebar to 'Load Role' scripts via AI prompt or manual entry. Reset sessions here to start fresh with the same roles."
    }
  ];

  const page = pages[currentPage];
  const isFirst = currentPage === 0;
  const isLast = currentPage === pages.length - 1;

  const handleNext = () => {
    if (isLast) onClose();
    else setCurrentPage(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl h-[85vh] max-h-[700px] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col relative">
        
        {/* Dynamic Page Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {isFirst ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900 text-white relative">
              <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-pulse">
                <img src="/The_Minimalist_Wheel.svg" alt="logo" className="w-14 h-14" />
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tighter italic">ClockTower</h1>
              <p className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 mt-2">Recorder v0.3</p>
            </div>
          ) : (
            <div className="flex-none h-[45%] bg-slate-100 flex items-center justify-center p-4 gap-2 border-b border-slate-200 overflow-hidden">
              {page.images.map((src, idx) => (
                <div key={idx} className="flex-1 h-full rounded-xl overflow-hidden shadow-md border border-white/50 bg-white">
                  <img src={src} alt="Instruction" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          )}

          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between bg-white overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-xl shrink-0">
                  {page.icon}
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">
                  {page.title}
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {page.content}
              </p>
            </div>

            <div className="flex items-center justify-between mt-8">
              <div className="flex gap-1.5">
                {pages.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 transition-all duration-300 rounded-full ${currentPage === idx ? 'w-6 bg-slate-900' : 'w-1.5 bg-slate-200'}`} 
                  />
                ))}
              </div>

              <div className="flex gap-2">
                {!isFirst && (
                  <button onClick={handleBack} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-all">
                    <ChevronLeft size={20} />
                  </button>
                )}
                <button 
                  onClick={handleNext}
                  className={`px-6 h-12 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-md ${
                    isLast ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'
                  }`}
                >
                  {isFirst ? "Get Started" : isLast ? "Let's Play" : "Next Step"}
                  {!isLast && <ChevronRight size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 text-slate-900 rounded-full transition-colors z-10">
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default GreetingPopup;