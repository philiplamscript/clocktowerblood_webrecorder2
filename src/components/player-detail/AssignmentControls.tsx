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
    <div className="w-full flex items-center gap-2 z-10">
      <div className="flex items-center bg-[#1a1412] rounded-lg h-8 overflow-hidden border border-[#4a3a32] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
        <button 
          onClick={() => setAssignmentMode(assignmentMode === 'death' ? null : 'death')} 
          className={`px-3 h-full text-[8px] font-black uppercase tracking-widest transition-all ${assignmentMode === 'death' ? 'bg-red-800 text-stone-100 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]' : 'text-stone-500 hover:text-stone-300'}`}
        >
          DEATH
        </button>
        <button 
          onClick={() => {
            const nextIndex = (REASON_CYCLE.indexOf(selectedReason) + 1) % REASON_CYCLE.length;
            setSelectedReason(REASON_CYCLE[nextIndex]);
          }}
          className="bg-[#2d241f] text-amber-500 text-[10px] border-l border-[#4a3a32] focus:ring-0 h-full px-2 hover:bg-[#3d2f28] transition-colors font-bold"
        >
          {selectedReason}
        </button>
      </div>

      <div className="flex-1 flex items-center bg-[#1a1412] rounded-lg h-8 overflow-hidden border border-[#4a3a32] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
        <button 
          onClick={() => setAssignmentMode(assignmentMode === 'property' ? null : 'property')} 
          className={`px-3 h-full text-[8px] font-black uppercase tracking-widest transition-all ${assignmentMode === 'property' ? 'bg-amber-700 text-stone-100 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]' : 'text-stone-500 hover:text-stone-300'}`}
        >
          PROP
        </button>
        <input 
          type="text" 
          value={selectedProperty} 
          onChange={(e) => setSelectedProperty(e.target.value)} 
          placeholder="Assign property..." 
          className="bg-transparent text-amber-400 placeholder:text-stone-700 text-[10px] border-none focus:ring-0 h-full px-2 w-full font-bold"
        />
      </div>
    </div>
  );
};

export default AssignmentControls;