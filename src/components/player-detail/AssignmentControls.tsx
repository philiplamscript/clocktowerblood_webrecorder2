"use client";

import React from 'react';
import { Skull, Tag } from 'lucide-react';
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
    <div className="flex items-center gap-1.5">
      <div className={`flex items-center rounded-lg h-7 overflow-hidden border transition-all ${assignmentMode === 'death' ? 'bg-red-600 border-red-700 shadow-lg' : 'bg-white border-slate-200 shadow-sm'}`}>
        <button 
          onClick={() => setAssignmentMode(assignmentMode === 'death' ? null : 'death')} 
          className={`px-2 h-full flex items-center justify-center transition-colors ${assignmentMode === 'death' ? 'text-white' : 'text-slate-400 hover:text-red-500'}`}
          title="Death Mode"
        >
          <Skull size={12} />
        </button>
        {assignmentMode === 'death' && (
          <button 
            onClick={() => {
              const nextIndex = (REASON_CYCLE.indexOf(selectedReason) + 1) % REASON_CYCLE.length;
              setSelectedReason(REASON_CYCLE[nextIndex]);
            }}
            className="bg-red-700 text-white text-[10px] border-none focus:ring-0 h-full px-2 hover:bg-red-800 transition-colors font-black"
          >
            {selectedReason}
          </button>
        )}
      </div>

      <div className={`flex items-center rounded-lg h-7 overflow-hidden border transition-all ${assignmentMode === 'property' ? 'bg-blue-600 border-blue-700 shadow-lg' : 'bg-white border-slate-200 shadow-sm'}`}>
        <button 
          onClick={() => setAssignmentMode(assignmentMode === 'property' ? null : 'property')} 
          className={`px-2 h-full flex items-center justify-center transition-colors ${assignmentMode === 'property' ? 'text-white' : 'text-slate-400 hover:text-blue-500'}`}
          title="Property Mode"
        >
          <Tag size={12} />
        </button>
        <input 
          type="text" 
          value={selectedProperty} 
          onChange={(e) => setSelectedProperty(e.target.value)} 
          placeholder="Prop..." 
          className={`text-[10px] border-none focus:ring-0 h-full px-1.5 w-16 transition-colors ${assignmentMode === 'property' ? 'bg-blue-700 text-white placeholder:text-blue-300' : 'bg-transparent text-slate-700'}`}
          onFocus={() => setAssignmentMode('property')}
        />
      </div>
    </div>
  );
};

export default AssignmentControls;