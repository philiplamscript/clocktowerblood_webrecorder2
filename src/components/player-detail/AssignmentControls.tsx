"use client";

import React from 'react';
import { Skull, Tag } from 'lucide-react';
import { REASON_CYCLE, type PropTemplate } from '../../type';

interface AssignmentControlsProps {
  assignmentMode: 'death' | 'property' | null;
  setAssignmentMode: (mode: 'death' | 'property' | null) => void;
  selectedReason: string;
  setSelectedReason: (reason: string) => void;
  selectedProperty: string;
  setSelectedProperty: (prop: string) => void;
  propTemplates?: PropTemplate[];
}

const AssignmentControls: React.FC<AssignmentControlsProps> = ({
  assignmentMode, setAssignmentMode, selectedReason, setSelectedReason, 
  selectedProperty, setSelectedProperty, propTemplates = []
}) => {
  return (
    <div className="flex flex-col gap-1.5 items-start">
      <div className="flex items-center gap-1.5">
        <div className={`flex items-center rounded-lg h-7 overflow-hidden border transition-all ${assignmentMode === 'death' ? 'bg-red-600 border-red-700 shadow-lg' : 'bg-[var(--panel-color)] border-[var(--border-color)] shadow-sm'}`}>
          <button 
            onClick={() => setAssignmentMode(assignmentMode === 'death' ? null : 'death')} 
            className={`px-2 h-full flex items-center justify-center transition-colors ${assignmentMode === 'death' ? 'text-white' : 'text-[var(--muted-color)] hover:text-red-500'}`}
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

        <div className={`flex items-center rounded-lg h-7 overflow-hidden border transition-all ${assignmentMode === 'property' ? 'bg-blue-600 border-blue-700 shadow-lg' : 'bg-[var(--panel-color)] border-[var(--border-color)] shadow-sm'}`}>
          <button 
            onClick={() => setAssignmentMode(assignmentMode === 'property' ? null : 'property')} 
            className={`px-2 h-full flex items-center justify-center transition-colors ${assignmentMode === 'property' ? 'text-white' : 'text-[var(--muted-color)] hover:text-blue-500'}`}
            title="Property Mode"
          >
            <Tag size={12} />
          </button>
          <input 
            type="text" 
            value={selectedProperty} 
            onChange={(e) => setSelectedProperty(e.target.value)} 
            placeholder="Prop..." 
            className={`text-[10px] border-none focus:ring-0 h-full px-1.5 w-16 transition-colors ${assignmentMode === 'property' ? 'bg-blue-700 text-white placeholder:text-blue-300' : 'bg-transparent text-[var(--text-color)] placeholder:text-[var(--muted-color)]/50'}`}
            onFocus={() => setAssignmentMode('property')}
          />
        </div>
      </div>

      {assignmentMode === 'property' && propTemplates.length > 0 && (
        <div className="flex flex-wrap gap-1 max-w-[120px] animate-in fade-in slide-in-from-left-2 duration-200">
          {propTemplates.map(template => (
            <button
              key={template.id}
              onClick={() => setSelectedProperty(template.value)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-all ${
                selectedProperty === template.value 
                  ? 'bg-blue-600 border-blue-700 text-white shadow-sm' 
                  : 'bg-[var(--panel-color)] border-[var(--border-color)] text-[var(--text-color)] hover:border-blue-300'
              }`}
              title={template.label}
            >
              {template.value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentControls;