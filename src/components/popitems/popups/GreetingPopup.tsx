"use client";

import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight,
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
  const [currentPage, setCurrentPage] = useState(0);

  if (!isOpen) return null;

  const pages = [
    {
      title: "1. Player Notes",
      icon: <Users size={16} className="text-blue-500" />,
      images: ["/how2use/screen-1.jpg"],
      content: "Tap any player in the top Player Hub to record social reads and role claims in their private notepad. This keeps your data organized per player."
    },
    {
      title: "2. The Nomination Flow",
      icon: <Zap size={16} className="text-yellow-500" />,
      images: ["/how2use/screen-2.0.jpg", "/how2use/screen-2.1.jpg", "/how2use/screen-2.2.jpg"],
      content: "Slide from Nominee to Target on the clock to create a link. Verify the details on the pending badge, then enter Voting Mode (center ball) to toggle voter status."
    },
    {
      title: "3. Quick Assignment",
      icon: <Skull size={16} className="text-red-500" />,
      images: ["/how2use/screen-3.jpg"],
      content: "Toggle Death or Property mode in the controls, then tap clock slices to execute or tag players. Swipe the center sphere left or right to change the current game day."
    },
    {
      title: "4. Review & Ledgers",
      icon: <Search size={16} className="text-indigo-500" />,
      images: ["/how2use/screen-4.jpg", "/how2use/screen-5.jpg", "/how2use/screen-5.1.jpg"],
      content: "Use V/R/G modes to visualize voting patterns. Open the Full Ledger for detailed tables tracking every player action and vote history throughout the game."
    },
    {
      title: "5. Script Setup",
      icon: <Edit3 size={16} className="text-slate-400" />,
      images: ["/how2use/screen-6.jpg"],
      content: "Found in the Sidebar: Use 'Load Role' to quickly paste your character list. This populates the role keyword selector for easy note-taking during the game."
    }
  ];

  const page = pages[currentPage];
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
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl aspect-[4/5] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col relative">
        
        {/* Top 60%: Images Container */}
        <div className="h-[60%] bg-slate-100 flex items-center justify-center p-4 gap-2 overflow-hidden border-b border-slate-200">
          {page.images.map((src, idx) => (
            <div key={idx} className="flex-1 h-full max-h-[90%] rounded-xl overflow-hidden shadow-lg border border-white/50 bg-white">
              <img src={src} alt={`Step ${idx + 1}`} className="w-full h-full object-contain" />
            </div>
          ))}
        </div>

        {/* Bottom 40%: Content Area */}
        <div className="h-[40%] p-8 flex flex-col justify-between bg-white">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-xl">
                {page.icon}
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">
                {page.title}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md">
              {page.content}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {pages.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 transition-all duration-300 rounded-full ${currentPage === idx ? 'w-6 bg-slate-900' : 'w-1.5 bg-slate-200'}`} 
                />
              ))}
            </div>

            <div className="flex gap-2">
              {currentPage > 0 && (
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
                {isLast ? "Let's Play" : "Next Step"}
                {!isLast && <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-slate-900 rounded-full transition-colors border border-white/20"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default GreetingPopup;