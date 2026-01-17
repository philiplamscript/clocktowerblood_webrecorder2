"use client";

import React, { useState } from 'react';
import { X, Copy, Check, Sparkles } from 'lucide-react';
import { ROLE_PARSING_PROMPT } from '../../../type';
import { toast } from 'react-hot-toast';

interface RoleUpdatePopupProps {
  showRoleUpdate: boolean;
  setShowRoleUpdate: (show: boolean) => void;
  roleUpdateText: string;
  setRoleUpdateText: (text: string) => void;
  parseRoleUpdate: () => void;
}

const RoleUpdatePopup: React.FC<RoleUpdatePopupProps> = ({
  showRoleUpdate,
  setShowRoleUpdate,
  roleUpdateText,
  setRoleUpdateText,
  parseRoleUpdate
}) => {
  const [copied, setCopied] = useState(false);

  if (!showRoleUpdate) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(ROLE_PARSING_PROMPT);
    setCopied(true);
    toast.success('AI Prompt copied! Paste it in ChatGPT/Claude with your script image.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[10010] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-[2px]" onClick={() => setShowRoleUpdate(false)}>
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-[500px] max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-3 py-2 bg-blue-600 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-blue-200" />
            <span className="text-white font-black text-[10px] uppercase">Role Update & AI Script Loader</span>
          </div>
          <button onClick={() => setShowRoleUpdate(false)} className="text-white/50 hover:text-white"><X size={14} /></button>
        </div>
        
        <div className="flex-1 p-3 space-y-3 overflow-y-auto">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-2">
            <h4 className="text-[10px] font-black text-blue-800 uppercase flex items-center gap-2">
              <Sparkles size={12} /> Fast Load with AI
            </h4>
            <p className="text-[9px] text-blue-600 leading-relaxed italic">
              Take a photo of your script or character list, copy this prompt, and paste both into any AI (ChatGPT, Claude, etc.). Then paste the result here.
            </p>
            <button 
              onClick={handleCopyPrompt}
              className="w-full flex items-center justify-center gap-2 bg-white border border-blue-200 hover:border-blue-400 text-blue-700 py-2 rounded-lg text-[10px] font-black uppercase transition-all active:scale-95 shadow-sm"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              {copied ? 'Prompt Copied!' : 'Copy AI Parsing Prompt'}
            </button>
          </div>

          <div className="h-px bg-slate-100 mx-2" />

          <textarea 
            className="w-full min-h-[250px] border border-slate-200 rounded p-3 text-[11px] font-mono resize-none focus:ring-2 focus:ring-blue-500/20 outline-none"
            placeholder={`Townfolk:
Character Name
....

Outsider:
Character Name
...

Minion:
Character Name
...

Demon:
Character Name
...`}
            value={roleUpdateText}
            onChange={(e) => setRoleUpdateText(e.target.value)}
          />
          
          <button 
            onClick={parseRoleUpdate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-[10px] font-black uppercase transition-all shadow-md active:scale-95"
          >
            Update Roles Table
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleUpdatePopup;