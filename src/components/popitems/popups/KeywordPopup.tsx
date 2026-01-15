"use client";

import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface KeywordPopupProps {
  isOpen: boolean;
  onClose: () => void;
  playerNo: number;
  allRoles: { role: string; category: string }[];
  categoryBg: Record<string, string>;
  onSelectRole: (role: string) => void;
}

const KeywordPopup: React.FC<KeywordPopupProps> = ({
  isOpen, onClose, playerNo, allRoles, categoryBg, onSelectRole
}) => {
  if (!isOpen) return null;

  const categories = ['Townsfolk', 'Outsider', 'Minion', 'Demon'];

  return (
    <div className="fixed inset-0 z-[10010] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-150" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150" 
        onClick={e => e.stopPropagation()}
      >
        <header className="flex-none bg-slate-900 text-white px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Role Keywords (Player {playerNo})</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full transition-colors">
            <X size={18} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-6">
          {allRoles.length > 0 ? (
            <div className="grid grid-cols-2 gap-6">
              {categories.map(cat => {
                const roles = allRoles.filter(r => r.category === cat);
                if (roles.length === 0) return null;
                
                return (
                  <div key={cat} className="space-y-2">
                    <h4 className={`text-[9px] font-black uppercase tracking-widest px-1 ${
                      cat === 'Townsfolk' ? 'text-blue-600' : 
                      cat === 'Outsider' ? 'text-indigo-400' : 
                      cat === 'Minion' ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {cat}s
                    </h4>
                    <div className="flex flex-col gap-1">
                      {roles.map((item, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => {
                            onSelectRole(item.role);
                            onClose();
                          }} 
                          className={`${categoryBg[item.category]} text-slate-900 px-3 py-2 rounded-lg text-[10px] font-bold transition-all hover:scale-[1.02] active:scale-95 text-left border border-black/5 shadow-sm`}
                        >
                          {item.role}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
              <Sparkles size={24} className="opacity-20" />
              <p className="text-xs italic">No roles defined in script yet.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default KeywordPopup;