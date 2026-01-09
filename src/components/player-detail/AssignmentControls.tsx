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
    <div className="w-full flex items-center gap-3">
      <div className="flex-1 flex items-center bg-[#1a110b] rounded-lg h-9 overflow-hidden border border-[#4d3a2b] shadow-inner group">
        <button 
          onClick={() => setAssignmentMode(assignmentMode === 'death' ? null : 'death')} 
          className={`px-3 h-full text-[8px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center ${assignmentMode === 'death' ? 'bg-red-900/60 text-red-200 shadow-lg' : 'bg-transparent text-amber-900/60 hover:text-amber-700'}`}
        >
          DEATH
        </button>
        <button 
          onClick={() => {
            const nextIndex = (REASON_CYCLE.indexOf(selectedReason) + 1) % REASON_CYCLE.length;
            setSelectedReason(REASON_CYCLE[nextIndex]);
          }}
          className="flex-1 bg-[#2d1e16] text-amber-200/80 text-[11px] border-l border-[#4d3a2b] h-full px-2 hover:bg-[#3d2b1f] transition-colors font-bold"
        >
          {selectedReason}
        </button>
      </div>

      <div className="flex-1 flex items-center bg-[#1a110b] rounded-lg h-9 overflow-hidden border border-[#4d3a2b] shadow-inner group">
        <button 
          onClick={() => setAssignmentMode(assignmentMode === 'property' ? null : 'property')} 
          className={`px-3 h-full text-[8px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center ${assignmentMode === 'property' ? 'bg-amber-800/60 text-amber-200 shadow-lg' : 'bg-transparent text-amber-900/60 hover:text-amber-700'}`}
        >
          PROP
        </button>
        <input 
          type="text" 
          value={selectedProperty} 
          onChange={(e) => setSelectedProperty(e.target.value)} 
          placeholder="Tag info..." 
          className="flex-1 bg-[#2d1e16] text-amber-200/80 text-[10px] border-l border-[#4d3a2b] h-full px-3 w-full focus:ring-0 focus:bg-[#3d2b1f] placeholder:text-amber-900/40 transition-all font-medium"
        />
      </div>
    </div>
  );
};

export default AssignmentControls;