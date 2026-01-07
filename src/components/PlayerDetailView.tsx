"use client";

import React, { useState } from 'react';
import { Tag, Skull, Key, X } from 'lucide-react';
import { REASON_CYCLE } from '../type';
import PlayerVotingSection from './player-detail/PlayerVotingSection';

const PlayerDetailView = (props: any) => {
  const [pendingNom, setPendingNom] = useState<any>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [showKeywords, setShowKeywords] = useState(false);
  
  const p = props.players.find((x: any) => x.no === props.playerNo);
  const d = props.deaths.find((x: any) => x.playerNo === props.playerNo.toString());
  const allRoles = ['Townsfolk', 'Outsider', 'Minion', 'Demon'].flatMap(c => props.chars[c].map((x: any) => ({ role: x.name, category: c })).filter((x: any) => x.role));

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <PlayerVotingSection {...props} pendingNom={pendingNom} setPendingNom={setPendingNom} isVoting={isVoting} setIsVoting={setIsVoting} />
      
      {showKeywords && (
        <div className="bg-white border rounded-lg p-3 grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-2">
          {['Townsfolk', 'Outsider', 'Minion'].map(cat => (
            <div key={cat} className="space-y-1">
              <h4 className="text-[8px] font-black text-slate-400 uppercase">{cat}</h4>
              {allRoles.filter(r => r.category === (cat === 'Minion' ? 'Minion' || 'Demon' : cat)).map((r, i) => (
                <button key={i} onClick={() => props.updatePlayerInfo(props.playerNo, (p?.inf || '') + (p?.inf ? '\n' : '') + r.role)} className="bg-slate-50 text-[9px] font-bold p-1 rounded w-full text-left">{r.role}</button>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <textarea className="flex-1 min-h-[120px] border border-slate-200 rounded-lg p-3 text-xs outline-none shadow-sm" placeholder="Notes..." value={p?.inf || ''} onChange={(e) => props.updatePlayerInfo(props.playerNo, e.target.value)} />
        <button onClick={() => setShowKeywords(!showKeywords)} className="bg-blue-600 text-white p-2 rounded-full h-10 w-10 flex items-center justify-center"><Key size={14} /></button>
      </div>

      <div className="flex gap-2">
        {props.deadPlayers.includes(props.playerNo) ? (
          <div className="flex-[8] flex gap-1 h-10">
            <button onClick={() => props.togglePlayerAlive(props.playerNo)} className="flex-1 bg-red-600 text-white rounded-lg"><Skull size={14} className="mx-auto" /></button>
            <input type="number" value={d?.day || props.currentDay} onChange={(e) => props.setDeaths(props.deaths.map((x: any) => x.playerNo === props.playerNo.toString() ? { ...x, day: parseInt(e.target.value) } : x))} className="flex-1 border rounded-lg text-center text-[10px] font-black" />
            <button onClick={() => props.setDeaths(props.deaths.map((x: any) => x.playerNo === props.playerNo.toString() ? { ...x, reason: REASON_CYCLE[(REASON_CYCLE.indexOf(x.reason) + 1) % REASON_CYCLE.length] } : x))} className="flex-[2] border rounded-lg text-xs font-black">{d?.reason || '⚔️'}</button>
          </div>
        ) : (
          <button onClick={() => props.togglePlayerAlive(props.playerNo)} className="flex-[8] bg-emerald-600 text-white rounded-lg font-black text-[10px]">ALIVE</button>
        )}
        <div className="flex-[4] border rounded-lg px-2 flex items-center gap-1">
          <Tag size={12} className="text-slate-400" />
          <input type="text" value={p?.property || ''} onChange={(e) => props.updatePlayerProperty(props.playerNo, e.target.value)} placeholder="Props" className="text-[10px] font-bold outline-none w-full" />
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailView;