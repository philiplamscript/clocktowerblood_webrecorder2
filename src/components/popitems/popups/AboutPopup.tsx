"use client";

import React from 'react';
import { X, Heart, Apple, Play, Github, Coffee } from 'lucide-react';

interface AboutPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutPopup: React.FC<AboutPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10009] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <header className="flex-none bg-slate-900 text-white px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/The_Minimalist_Wheel.svg" alt="Logo" className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">About BOTCT-ClockTracker</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </header>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Introduction */}
          <section className="space-y-2">
            <h2 className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tighter italic">Precision Tracking for the Ultimate Game.</h2>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              BOTCT-ClockTracker was born from a passion for Blood on the Clocktower. 
              </p>
            
            <p className="text-[11px] text-slate-600 leading-relaxed">
              As I lazy on game memorizing, I was trying to make note as most of you did. 
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Orginally all did in Tables in note app, then python steamlit (but fail). Webpage is an accident as I put my code into AI to see the protial webpage.
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Result on the webpage is gradual to create a clock like app to make it easier to keep track of the game.
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              This is a non-official Pure Frontend app built by fan (me), for fans (with me as well).
            </p>
            
          </section>

          {/* Special Thanks */}
          <section className="space-y-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Special Thanks</h3>
            <ul className="space-y-1 text-[11px] text-slate-700 font-medium">
              <li className="flex items-center gap-2">• <span className="text-emerald-500">Dyad</span> Make idea simple and come true</li>
              <li className="flex items-center gap-2">• <span className="text-emerald-500">Blood of the ClockTower Community</span> for Great Passion Community</li>
              <li className="flex items-center gap-2">• <span className="text-emerald-500">Amazing Patrons</span> for Supporting</li>
            </ul>
          </section>

          {/* Platforms */}
          <section className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Get the Mobile App</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 transition-all active:scale-90 shadow-md">
                <Apple size={16} />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[7px] uppercase font-bold text-slate-400">Download on</span>
                  <span className="text-[10px] font-black">App Store</span>
                </div>
              </button>
              <button className="flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 transition-all active:scale-90 shadow-md">
                <Play size={16} />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[7px] uppercase font-bold text-slate-400">Get it on</span>
                  <span className="text-[10px] font-black">Google Play</span>
                </div>
              </button>
            </div>
          </section>

          {/* Support */}
          <section className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="text-slate-400 hover:text-slate-900 transition-colors" title="Source Code">
                <Github size={18} />
              </button>
              <button className="text-slate-400 hover:text-pink-500 transition-colors" title="Discord Community">
                <Heart size={18} />
              </button>
            </div>
            <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all shadow-md active:scale-95">
              <Coffee size={14} /> Buy me a coffee
            </button>
          </section>
        </div>
        
        <footer className="bg-slate-50 px-6 py-3 border-t border-slate-200">
          <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest">
            BOTCT-ClockTracker © 2024 • MIT License
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AboutPopup;