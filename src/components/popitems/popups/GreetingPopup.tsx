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
      content: "A digital companion for Blood on the Clocktower. Track votes, manage roles, and solve the mystery with elegance and speed. Let's take a quick look at how it works."
    },
    {
      title: "1. Player Notes",
      icon: <Users size={16} className="text-blue-500" />,
      images: ["/how2use/screen-1.jpg"],
      content: "Tap any player in the top Player Hub❶ to record social reads and role claims in their private notepad❷. This keeps your data organized per player."
    },
    {
      title: "2. The Nomination Flow",
      icon: <Zap size={16} className="text-yellow-500" />,
      images: ["/how2use/screen-2.0.jpg", "/how2use/screen-2.1.jpg", "/how2use/screen-2.2.jpg"],
      content: "Slide from Nominee to Target on the clock to create a link❶. Verify the details on the pending badge❷, then enter Voting Mode (center ball) to toggle voter status."
    },
    {
      title: "3. Quick Assignment",
      icon: <Skull size={16} className="text-red-500" />,
      images: ["/how2use/screen-3.jpg"],
      content: "Toggle Death or Property mode in the controls❶, then tap clock slices to execute or tag players. Swipe the center sphere left or right to change the current game day❷."
    },
    {
      title: "4. Pattern Review",
      icon: <Search size={16} className="text-indigo-500" />,
      images: ["/how2use/screen-4.jpg"],
      content: `V/R/G modes on the clock to visualize voting patterns. See who voted for whom, who receives the most heat, and global trends at a glance❶.
      Able/disable layers❷.
      Rotate to filter day❸.`    },
    {
      title: "5. Full Ledgers",
      icon: <BookOpen size={16} className="text-emerald-500" />,
      images: ["/how2use/screen-5.2.jpg", "/how2use/screen-5.3.jpg", "/how2use/screen-5.4.jpg"],
      content: "Open the Full Ledger for tables tracking player recorded from notepad, every nomination and Role table (set player number here)."
    },
    {
      title: "6. Script Setup",
      icon: <Edit3 size={16} className="text-slate-400" />,
      images: ["/how2use/screen-6.jpg"],
      content: `Found in the Sidebar: 
      'Load Role': to quickly paste your character list. This populates the role keyword selector for easy note-taking during the game.
      'Reset Session': Reset the game record.
      'Setting': Game UI settings.`
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
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col relative">
        
        {/* Top 55%: Images Container (Hidden on first page) */}
        {!isFirst && (
          <div className="flex-none h-[50%] bg-slate-100 flex items-center justify-center p-4 gap-2 overflow-hidden border-b border-slate-200">
            {page.images.map((src, idx) => (
              <div key={idx} className="flex-1 h-full max-h-[95%] rounded-xl overflow-hidden shadow-lg border border-white/50 bg-white">
                <img src={src} alt={`Step ${idx + 1}`} className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
        )}

        {/* Welcome Hero - Only on First Page */}
        {isFirst && (
          <div className="flex-none h-[50%] flex flex-col items-center justify-center p-8 text-center bg-slate-900 text-white relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-600 to-transparent"></div>
             </div>
             <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-pulse">
                <img src="/The_Minimalist_Wheel.svg" alt="logo" className="w-14 h-14" />
             </div>
             <h1 className="text-2xl font-black uppercase tracking-tighter italic">ClockTower</h1>
             <p className="text-[9px] uppercase tracking-[0.4em] font-black text-slate-400 mt-2">Recorder v0.3</p>
          </div>
        )}

        {/* Bottom Area: Content Section */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between bg-white relative overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-xl shrink-0">
                {page.icon}
              </div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tighter italic">
                  {page.title}
                </h2>
                {isFirst && (
                  <img src="/The_Minimalist_Wheel.svg" alt="logo" className="w-5 h-5 animate-spin-slow" />
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md">
              {page.content}
            </p>
          </div>

          <div className="flex items-center justify-between mt-6">
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
                <button 
                  onClick={handleBack}
                  className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-all active:scale-90"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <button 
                onClick={handleNext}
                className={`px-6 h-12 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-md ${
                  isLast ? 'bg-red-600 text-white shadow-red-200' : 'bg-slate-900 text-white shadow-slate-200'
                }`}
              >
                {isFirst ? "Get Started" : isLast ? "Let's Play" : "Next Step"}
                {!isLast && <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 text-slate-900 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default GreetingPopup;