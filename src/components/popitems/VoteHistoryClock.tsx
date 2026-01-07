<g className="pointer-events-auto">
          <circle 
            cx={cx} cy={cy} r="25" 
            fill={isVoting ? "#ef4444" : pendingNom ? "#a855f7" : assignmentMode === 'death' ? '#ef4444' : assignmentMode === 'property' ? '#3b82f6' : "#2563eb"} 
            className="transition-colors duration-200"
            onClick={(e) => { e.stopPropagation(); onToggleVotingPhase(); }}
          />
          
          {pendingNom ? (
            <text 
              x={cx} y={cy} textAnchor="middle" alignmentBaseline="middle" 
              className="text-white text-[14px] font-black pointer-events-none"
            >
              {isVoting ? 'SAVE' : 'V'}
            </text>
          ) : assignmentMode ? (
            <text 
              x={cx} y={cy} textAnchor="middle" alignmentBaseline="middle" 
              className="text-white text-[8px] font-black uppercase pointer-events-none"
            >
              {assignmentMode === 'death' ? selectedReason : 'PROP'}
            </text>
          ) : (
            <g>
              <text x={cx} y={cy - 8} textAnchor="middle" className="text-white text-[10px] font-black pointer-events-none">{playerNo}</text>
              <g className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setCurrentDay?.(Math.max(1, currentDay - 1)); }}>
                <path d="M 125 144 L 132 140 L 132 148 Z" fill="white" opacity="0.5" className="hover:opacity-100" />
              </g>
              <text x={cx} y={cy + 4} textAnchor="middle" className="text-white text-[8px] font-black pointer-events-none">D{currentDay}</text>
              <g className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setCurrentDay?.(currentDay + 1); }}>
                <path d="M 163 144 L 156 140 L 156 148 Z" fill="white" opacity="0.5" className="hover:opacity-100" />
              </g>
              <text x={cx} y={cy + 14} textAnchor="middle" className="text-white text-[5px] font-black uppercase pointer-events-none text-center">
                {mode === 'vote' ? 'VOTE' : mode === 'beVoted' ? 'RECV' : 'ALL'}
              </text>
            </g>
          )}
        </g>