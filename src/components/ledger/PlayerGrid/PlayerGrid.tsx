import  { useState, useMemo, useRef, useEffect, useCallback } from 'react';

import { 
  Calendar,
  Zap,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Skull,
  Tag,
} from 'lucide-react';

import {type Player,
  type SortConfig,
  type IdentityMode
} from '../../../type'

export const PlayerGrid = ({ players, setPlayers, identityMode = 'number' }: { players: Player[], setPlayers: React.Dispatch<React.SetStateAction<Player[]>>, identityMode?: IdentityMode }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  const handleSort = (key: keyof Player) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPlayers = useMemo(() => {
    const items = [...players];
    if (sortConfig.key !== null) {
      items.sort((a, b) => {
        let valA: any = a[sortConfig.key!];
        let valB: any = b[sortConfig.key!];

        if (sortConfig.key === 'no' || sortConfig.key === 'day') {
          const numA = parseInt(valA) || 0;
          const numB = parseInt(valB) || 0;
          return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
        }

        valA = valA.toString().toLowerCase();
        valB = valB.toString().toLowerCase();
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const totalRows = 20;
    const paddedItems = [...items];
    for (let i = items.length; i < totalRows; i++) {
      paddedItems.push({ 
        no: i + 1, 
        name: '',
        inf: '', 
        day: '', 
        reason: '', 
        red: '', 
        property: '',
        isPlaceholder: true 
      } as any);
    }
    
    return paddedItems;
  }, [players, sortConfig]);

  const SortIcon = ({ column }: { column: keyof Player }) => {
    if (sortConfig.key !== column) return <ArrowUpDown size={8} className="ml-1 opacity-80 text-[var(--text-on-bg)]" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={8} className="ml-1 text-[var(--text-on-bg)]" /> : <ChevronDown size={8} className="ml-1 text-[var(--text-on-bg)]" />;
  };

  const updatePlayer = (no: number, field: keyof Player, value: string) => {
    if (no <= players.length) {
      setPlayers(prev => prev.map(p => p.no === no ? { ...p, [field]: value } : p));
    }
  };

  const adjustHeight = useCallback((textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'inherit';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  return (
    <div className="bg-[var(--panel-color)] rounded border border-[var(--border-color)] shadow-sm overflow-hidden transition-colors duration-500 relative">
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0" style={{ backgroundImage: 'var(--panel-pattern)' }} />
      <table className="w-full text-left border-collapse table-fixed relative z-10">
        <thead className="bg-[var(--bg-color)] border-b border-[var(--border-color)] text-[8px] uppercase font-black transition-colors duration-500">
          <tr>
            <th className="px-1 py-1.5 w-16 text-center cursor-pointer hover:bg-black/5 transition-colors" onClick={() => handleSort('no')}>
              <div className="flex items-center justify-center text-[var(--text-on-bg)]">{identityMode === 'name' ? 'NAME' : 'ID'} <SortIcon column="no" /></div>
            </th>
            <th className="px-1 py-1.5 w-8 text-center border-l border-[var(--border-color)] cursor-pointer hover:bg-black/5 transition-colors" onClick={() => handleSort('day')}>
              <div className="flex flex-col items-center text-[var(--text-on-bg)]"><Calendar size={10} /><SortIcon column="day" /></div>
            </th>
            <th className="px-1 py-1.5 w-8 text-center border-l border-[var(--border-color)] text-[var(--text-on-bg)]"><Zap size={10} className="mx-auto" /></th>
            <th className="px-3 py-1.5 border-l border-[var(--border-color)] cursor-pointer hover:bg-black/5 transition-colors" onClick={() => handleSort('inf')}>
              <div className="flex items-center text-[var(--text-on-bg)]">INFO <SortIcon column="inf" /></div>
            </th>
            <th className="px-1 py-1.5 w-8 text-center text-[var(--accent-color)] border-l border-[var(--border-color)] cursor-pointer hover:bg-black/5 transition-colors" onClick={() => handleSort('red')}>
              <div className="flex flex-col items-center text-[var(--text-on-bg)]"><Skull size={10} /><SortIcon column="red" /></div>
            </th>
            <th className="px-1 py-1.5 w-12 text-center border-l border-[var(--border-color)] cursor-pointer hover:bg-black/5 transition-colors" onClick={() => handleSort('property')}>
              <div className="flex flex-col items-center text-[var(--text-on-bg)]"><Tag size={10} /><SortIcon column="property" /></div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {sortedPlayers.map((p) => {
            const isPlaceholder = (p as any).isPlaceholder;
            const displayLabel = identityMode === 'name' && p.name ? p.name : p.no;

            return (
              <tr key={p.no} className={`align-top transition-colors ${isPlaceholder ? 'opacity-30 grayscale' : 'hover:bg-black/5'}`}>
                <td className="px-1 py-2 text-center text-[var(--muted-color)] font-black text-[9px] uppercase tracking-tighter truncate overflow-hidden whitespace-nowrap">
                  {displayLabel}
                </td>
                <td className="border-l border-[var(--border-color)]">
                  <input 
                    disabled={isPlaceholder}
                    className="w-full text-center bg-transparent border-none p-1 text-[11px] font-mono focus:ring-0 text-[var(--text-on-panel)] disabled:cursor-not-allowed" 
                    value={p.day} 
                    onChange={(e) => updatePlayer(p.no, 'day', e.target.value)} 
                  />
                </td>
                <td className="border-l border-[var(--border-color)]">
                  <input 
                    disabled={isPlaceholder}
                    className="w-full text-center bg-transparent border-none p-1 text-[11px] font-mono focus:ring-0 text-[var(--text-on-panel)] disabled:cursor-not-allowed" 
                    value={p.reason} 
                    onChange={(e) => updatePlayer(p.no, 'reason', e.target.value)} 
                  />
                </td>
                <td className="px-1 py-1 border-l border-[var(--border-color)]">
                  <AutoResizeTextarea 
                    value={p.inf} 
                    onChange={(value) => updatePlayer(p.no, 'inf', value)} 
                    adjustHeight={adjustHeight}
                    disabled={isPlaceholder}
                  />
                </td>
                <td className="border-l border-[var(--border-color)]">
                  <input 
                    disabled={isPlaceholder}
                    className="w-full text-center bg-transparent border-none p-1 text-[11px] font-black text-[var(--accent-color)] focus:ring-0 disabled:cursor-not-allowed" 
                    value={p.red} 
                    onChange={(e) => updatePlayer(p.no, 'red', e.target.value)} 
                  />
                </td>
                <td className="border-l border-[var(--border-color)]">
                  <input 
                    disabled={isPlaceholder}
                    className="w-full text-center bg-transparent border-none p-1 text-[10px] font-bold text-[var(--text-on-panel)] focus:ring-0 disabled:cursor-not-allowed" 
                    value={p.property} 
                    onChange={(e) => updatePlayer(p.no, 'property', e.target.value)} 
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const AutoResizeTextarea = ({ value, onChange, adjustHeight, disabled }: { value: string, onChange: (value: string) => void, adjustHeight: (textarea: HTMLTextAreaElement) => void, disabled?: boolean }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight(textareaRef.current);
    }
  }, [value, adjustHeight]);

  return (
    <textarea 
      ref={textareaRef}
      disabled={disabled}
      className="w-full bg-transparent border-none p-1 text-[11px] leading-tight resize-none min-h-[1.5rem] focus:ring-0 overflow-hidden text-[var(--text-on-panel)] placeholder:opacity-30 disabled:cursor-not-allowed" 
      rows={1} 
      value={value} 
      placeholder={disabled ? "" : "..."} 
      onChange={(e) => {
        onChange(e.target.value);
        adjustHeight(e.target);
      }}
      onFocus={(e) => adjustHeight(e.target)}
    />
  );
};

export default PlayerGrid;