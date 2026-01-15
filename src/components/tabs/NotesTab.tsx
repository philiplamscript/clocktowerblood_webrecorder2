"use client";

import React from 'react';

interface NotesTabProps {
  note: string;
  setNote: React.Dispatch<React.SetStateAction<string>>;
}

const NotesTab: React.FC<NotesTabProps> = ({ note, setNote }) => {
  return (
    <div className="bg-[var(--panel-color)] rounded border border-[var(--border-color)] p-4 shadow-sm min-h-[400px] transition-colors duration-500">
      <textarea 
        className="w-full h-full border-none focus:ring-0 text-xs font-mono italic leading-relaxed min-h-[400px] bg-transparent text-[var(--text-color)] placeholder:opacity-30" 
        placeholder="Type general game notes or social reads here..." 
        value={note} 
        onChange={(e) => setNote(e.target.value)} 
      />
    </div>
  );
};

export default NotesTab;