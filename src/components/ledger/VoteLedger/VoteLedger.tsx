import React from 'react';
import { 
  Trash2, 
  Megaphone,
  Target,
  Hand,
} from 'lucide-react';


import {
  type Nomination,
} from '../../../type'

const VoteLedger = ({ 
  nominations, 
  setNominations,
  isDragging,
  setIsDragging,
  dragAction,
  setDragAction,
  lastDraggedPlayer,
  setLastDraggedPlayer,
  deadPlayers,
  playerCount = 15
}: any) => {
  const toggleVoter = (nominationId: string, playerNo: number, forceAction?: 'add' | 'remove') => {
    setNominations(nominations.map((n: Nomination) => {
      if (n.id !== nominationId) return n;
      const playerStr = playerNo.toString();
      let voters = n.voters.split(',').filter(v => v !== "");
      const hasVote = voters.includes(playerStr);
      if (forceAction === 'remove' || (!forceAction && hasVote)) voters = voters.filter(v => v !== playerStr);
      else if (forceAction === 'add' || (!forceAction && !hasVote)) voters = [...new Set([...voters, playerStr])].sort((a, b) => parseInt(a) - parseInt(b));
      return { ...n, voters: voters.join(',') };
    }));
  };

  return (
    <div className="bg-[var(--panel-color)] rounded border border-[var(--border-color)] shadow-sm overflow-x-auto transition-colors duration-500">
      <table className="w-full border-collapse table-fixed min-w-[900px]">
        <thead>
          <tr className="bg-[var(--bg-color)] border-b border-[var(--border-color)] text-[8px] uppercase text-[var(--muted-color)] font-black transition-colors duration-500">
            <th className="w-6 py-2 text-center border-r border-[var(--border-color)]">
              <Trash2 size={10} className="mx-auto opacity-20 text-[var(--text-on-bg)]" />
            </th>
            <th className="w-6 py-2 border-r border-[var(--border-color)] text-center text-[var(--text-on-bg)]">D</th>
            <th className="w-8 py-2 border-r border-[var(--border-color)] text-center text-[var(--text-on-bg)]"><Megaphone size={12} className="mx-auto" /></th>
            <th className="w-8 py-2 border-r border-[var(--border-color)] text-center text-[var(--text-on-bg)]"><Target size={12} className="mx-auto" /></th>
            <th className="w-10 py-2 border-r border-[var(--border-color)] text-center text-[var(--text-on-bg)]"><Hand size={12} className="mx-auto" /></th>
            <th className="w-8 py-2 border-r border-[var(--border-color)] text-center text-[var(--text-on-bg)]">VCT</th>
            <th className="p-0">
              <div className="flex h-full">
                {Array.from({ length: playerCount }, (_, i) => i + 1).map(num => (
                  <div key={num} className="flex-1 border-r border-[var(--border-color)] text-[7px] text-center py-2 text-[var(--text-on-bg)]">{num}</div>
                ))}
              </div>
            </th>
            <th className="w-24 py-2 px-2 text-[var(--text-on-bg)]">NOTES</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)] font-mono text-[var(--text-on-panel)]">
          {nominations.map((n: Nomination) => (
            <tr key={n.id} className="h-10 hover:bg-black/5 transition-colors">
              <td className="p-0 text-center border-r border-[var(--border-color)]">
                <button 
                  onClick={() => setNominations(nominations.filter((nom: any) => nom.id !== n.id))} 
                  className="text-[var(--muted-color)] opacity-20 hover:text-[var(--accent-color)] hover:opacity-100 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </td>
              <td className="p-0 border-r border-[var(--border-color)]"><input type="number" className="w-full text-center border-none bg-transparent focus:ring-0 text-[10px] p-0 font-bold text-[var(--text-on-panel)]" value={n.day} onChange={(e) => setNominations(nominations.map((item: any) => item.id === n.id ? { ...item, day: parseInt(e.target.value) || 1 } : item))} /></td>
              
              <td className="p-0 border-r border-[var(--border-color)]"><input type="text" className="w-full text-center border-none bg-transparent focus:ring-0 text-[10px] p-0 font-bold text-[var(--text-on-panel)]" value={n.f} onChange={(e) => setNominations(nominations.map((item: any) => item.id === n.id ? { ...item, f: e.target.value } : item))} /></td>
              
              <td className="p-0 border-r border-[var(--border-color)]"><input type="text" className="w-full text-center border-none bg-transparent focus:ring-0 text-[10px] p-0 font-bold text-[var(--text-on-panel)]" value={n.t} onChange={(e) => setNominations(nominations.map((item: any) => item.id === n.id ? { ...item, t: e.target.value } : item))} /></td>
              
              <td className="p-0 border-r border-[var(--border-color)]"><input type="text" className="w-full text-center border-none bg-transparent focus:ring-0 text-[10px] p-0 font-bold text-[var(--text-on-panel)]" value={n.voters} onChange={(e) => setNominations(nominations.map((item: any) => item.id === n.id ? { ...item, voters: e.target.value } : item))} /></td>
              
              <td className="p-0 border-r border-[var(--border-color)] text-center text-[10px] font-black">{n.voters.split(',').filter(v => v !== "").length}</td>
              <td className="p-0">
                <div className="flex h-10">
                  {Array.from({ length: playerCount }, (_, i) => i + 1).map((num) => {
                    const isActive = n.voters.split(',').includes(num.toString());
                    const isFor = n.f === num.toString();
                    const isTarget = n.t === num.toString();
                    const isDead = deadPlayers.includes(num);

                    return (
                      <div 
                        key={num} 
                        onMouseDown={() => { setIsDragging(true); setDragAction(isActive ? 'remove' : 'add'); setLastDraggedPlayer(num); toggleVoter(n.id, num); }}
                        onMouseEnter={() => { if (isDragging && num !== lastDraggedPlayer) { setLastDraggedPlayer(num); toggleVoter(n.id, num, dragAction!); } }}
                        className={`flex-1 border-r border-[var(--border-color)] h-full flex items-center justify-center text-[9px] font-black cursor-crosshair transition-all ${
                          isActive 
                            ? 'bg-[var(--accent-color)] text-white shadow-inner' 
                            : isFor 
                              ? 'bg-blue-500/10 text-blue-500' 
                              : isTarget 
                                ? 'bg-emerald-500/10 text-emerald-500' 
                                : isDead
                                  ? 'bg-[var(--bg-color)] text-[var(--muted-color)] opacity-40'
                                  : 'bg-transparent text-transparent hover:bg-black/5'
                        }`}
                      >
                        {isActive ? 'V' : isFor ? 'F' : isTarget ? 'T' : isDead ? 'X' : ''}
                      </div>
                    );
                  })}
                </div>
              </td>
              <td className="p-0 px-2 font-sans"><input placeholder="..." className="w-full border-none bg-transparent focus:ring-0 text-[9px] px-2 h-10 font-sans text-[var(--text-on-panel)]" value={n.note} onChange={(e) => setNominations(nominations.map((item: any) => item.id === n.id ? { ...item, note: e.target.value } : item))} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VoteLedger;