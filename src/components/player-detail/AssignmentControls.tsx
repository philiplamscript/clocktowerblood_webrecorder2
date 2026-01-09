"use client";

import React from 'react';
import { REASON_CYCLE } from '../../type';

interface AssignmentControlsProps {
  assignmentMode: 'death' | 'property' | null;
  setAssignmentMode: (mode: 'death' | 'property' | null) => void;
  selectedReason: string;
  setSelectedReason: (reason: string) => void;
  selectedProperty: string;
  setSelectedProperty: (prop: string) => void;
}

const AssignmentControls: React.FC<AssignmentControlsProps> = ({
  assignmentMode, setAssignmentMode, selectedReason, setSelectedReason, selectedProperty, setSelectedProperty
}) => {
  return (
    <div className="w-full flex items-center gap-2">
      <div className="flex items-center bg-slate-900 rounded-lg h-8 overflow-hidden border border-slate-700 shadow-lg">
        <button 
          onClick={() => setAssignmentMode(assignmentMode === 'death' ? null : 'death')} 
          className={`px-2 h-full text-[8px] font-black uppercase tracking-widest transition-colors ${assignmentMode === 'death' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          DEATH
        </button>
        <button 
          onClick={() => {
            const nextIndex = (REASON_CYCLE.indexOf(selectedReason) + 1) % REASON_CYCLE.length;
            setSelectedReason(REASON_CYCLE[nextIndex]);
          }}
          className="bg-slate-800 text-white text-[10px] border-none focus:ring-0 h-full px-2 hover:bg-slate-700 transition-colors"
        >
          {selectedReason}
        </button>
      </div>

      <div className="flex items-center bg-slate-900 rounded-lg h-8 overflow-hidden border border-slate-700 shadow-lg">
        <button 
          onClick={() => setAssignmentMode(assignmentMode === 'property' ? null : 'property')} 
          className={`px-2 h-full text-[8px] font-black uppercase tracking-widest transition-colors ${assignmentMode === 'property' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          PROP
        </button>
        <input 
          type="text" 
          value={selectedProperty} 
          onChange={(e) => setSelectedProperty(e.target.value)} 
          placeholder="Type property..." 
          className="bg-slate-800 text-white text-[10px] border-none focus:ring-0 h-full px-1 w-20"
        />
      </div>
    </div>
  );
};

export default AssignmentControls;