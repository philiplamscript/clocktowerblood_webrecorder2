import React, { useState, type ReactNode } from 'react';
import { Copy, Sparkles } from 'lucide-react';

type GeminiMode = 'api' | 'copy';

interface GeminiModeTabsProps {
  apiPanel: ReactNode;
  copyPanel: ReactNode;
  /** Rendered between mode tabs and the active panel (e.g. shared style controls). */
  middle?: ReactNode;
}

const GeminiModeTabs: React.FC<GeminiModeTabsProps> = ({ apiPanel, copyPanel, middle }) => {
  const [mode, setMode] = useState<GeminiMode>('api');

  return (
    <div className="space-y-3">
      <div className="flex bg-white border border-slate-200 rounded-xl p-0.5">
        <button
          type="button"
          onClick={() => setMode('api')}
          className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase flex items-center justify-center gap-1.5 transition-all ${
            mode === 'api' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-50'
          }`}
        >
          <Sparkles size={12} /> LLM
        </button>
        <button
          type="button"
          onClick={() => setMode('copy')}
          className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase flex items-center justify-center gap-1.5 transition-all ${
            mode === 'copy' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-50'
          }`}
        >
          <Copy size={12} /> Copy
        </button>
      </div>
      {middle}
      {mode === 'api' ? apiPanel : copyPanel}
    </div>
  );
};

export default GeminiModeTabs;
