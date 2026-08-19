"use client";

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { FilePlus2, RotateCcw, Tag } from 'lucide-react';
import { type NotepadTemplate } from '../../type';
import KeywordPopup from '../popitems/popups/KeywordPopup';

interface NoteSectionProps {
  currentPlayer: any;
  playerNo: number;
  updatePlayerInfo: (no: number, text: string) => void;
  updatePlayerProperty: (no: number, text: string) => void;
  showKeywords: boolean;
  setShowKeywords: (v: boolean) => void;
  showTemplates: boolean;
  setShowTemplates: (v: boolean) => void;
  allRoles: { role: string; category: string }[];
  categoryBg: Record<string, string>;
  notepadTemplates: NotepadTemplate[];
  insertTemplate: (content: string) => void;
  isDead: boolean;
  togglePlayerAlive: (no: number) => void;
  death: { day?: number; reason?: string } | undefined;
  currentDay: number;
  updateDeathDay: (no: number, day: number) => void;
  cycleDeathReason: () => void;
}

export type NoteSectionHandle = {
  insertAtCaret: (text: string) => void;
  insertAtPoint: (text: string, x: number, y: number) => void;
};

const NoteSection = forwardRef<NoteSectionHandle, NoteSectionProps>(({
  currentPlayer, playerNo, updatePlayerInfo, updatePlayerProperty, showKeywords, setShowKeywords,
  showTemplates, setShowTemplates, allRoles, categoryBg, notepadTemplates, insertTemplate,
  isDead, togglePlayerAlive, death, currentDay, updateDeathDay, cycleDeathReason
}, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const caretRef = useRef({ start: 0, end: 0 });
  const inf = currentPlayer?.inf || '';
  const property = currentPlayer?.property || '';
  const deathDayOptions = useMemo(
    () => Array.from({ length: Math.max(currentDay, 1) }, (_, i) => i + 1),
    [currentDay]
  );

  const saveCaret = (el: HTMLTextAreaElement) => {
    caretRef.current = { start: el.selectionStart ?? 0, end: el.selectionEnd ?? 0 };
  };

  useEffect(() => {
    caretRef.current = { start: inf.length, end: inf.length };
  }, [playerNo]);

  const insertAtCaret = useCallback((text: string) => {
    const cur = inf;
    const start = Math.max(0, Math.min(caretRef.current.start, cur.length));
    const end = Math.max(start, Math.min(caretRef.current.end, cur.length));
    const next = cur.slice(0, start) + text + cur.slice(end);
    const caret = start + text.length;
    caretRef.current = { start: caret, end: caret };
    updatePlayerInfo(playerNo, next);
    // Focus immediately to trigger the on-screen keyboard during the drag/drop gesture.
    textareaRef.current?.focus();
    // Wait a tick for React to update `value`, then set caret position accurately.
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  }, [inf, playerNo, updatePlayerInfo]);

  const insertAtPoint = useCallback(
    (text: string, x: number, y: number) => {
      const el = textareaRef.current;
      if (el) {
        const doc = document as any;
        const offsetFromPoint = (() => {
          if (typeof doc?.caretPositionFromPoint === 'function') {
            const pos = doc.caretPositionFromPoint(x, y);
            if (pos && typeof pos.offset === 'number') return pos.offset as number;
          }
          if (typeof doc?.caretRangeFromPoint === 'function') {
            const range = doc.caretRangeFromPoint(x, y);
            if (range && typeof range.startOffset === 'number') return range.startOffset as number;
          }
          return null;
        })();

        if (typeof offsetFromPoint === 'number') {
          caretRef.current = { start: offsetFromPoint, end: offsetFromPoint };
        }
      }

      // Fallback: if we couldn't map (x,y) to an offset, use the current caret.
      insertAtCaret(text);
    },
    [insertAtCaret]
  );

  useImperativeHandle(ref, () => ({ insertAtCaret, insertAtPoint }), [insertAtCaret, insertAtPoint]);

  const handleSelectRole = (role: string) => {
    updatePlayerInfo(playerNo, inf + (inf ? '\n' : '') + role);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2">
        <KeywordPopup 
          isOpen={showKeywords}
          onClose={() => setShowKeywords(false)}
          playerNo={playerNo}
          allRoles={allRoles}
          categoryBg={categoryBg}
          onSelectRole={handleSelectRole}
        />

        {showTemplates && (
          <div className="bg-[var(--panel-color)] border border-[var(--border-color)] rounded-lg p-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <h4 className="text-[8px] font-black text-[var(--muted-color)] uppercase tracking-widest mb-2">Notepad Templates</h4>
            <div className="grid grid-cols-2 gap-2">
              {notepadTemplates.map(template => (
                <button 
                  key={template.id} 
                  onClick={() => insertTemplate(template.content)} 
                  className="bg-[var(--bg-color)] hover:bg-black/5 border border-[var(--border-color)] text-[var(text-on-bg)] px-3 py-2 rounded-lg text-[9px] font-black uppercase transition-all text-left flex flex-col group"
                >
                  <span className="group-hover:text-[var(--accent-color)] transition-colors">{template.label}</span>
                  <span className="text-[7px] font-normal text-[var(--muted-color)] normal-case line-clamp-1">{template.content}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
        
      <div className="flex gap-2 items-stretch">
        <div className="w-12 shrink-0 min-h-[120px] flex flex-col gap-2">
          {isDead ? (
            <div className="flex-1 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => togglePlayerAlive(playerNo)}
                className="flex-1 rounded-xl bg-red-600 text-white shadow-sm transition-all hover:bg-red-700 active:scale-95 flex flex-col items-center justify-center text-[8px] font-black uppercase leading-tight"
                title="Revert this player to alive"
              >
                <RotateCcw size={14} />
                <span>Revert</span>
              </button>
              <div
                className="flex-1 rounded-xl bg-[var(--panel-color)] border border-[var(--border-color)] shadow-sm flex items-center justify-center px-1"
                title="Day of death"
              >
                <select
                  value={death?.day || currentDay}
                  onChange={(e) => updateDeathDay(playerNo, parseInt(e.target.value, 10) || currentDay)}
                  className="w-full bg-transparent text-center text-[9px] font-black text-[var(--text-on-panel)] outline-none appearance-none"
                >
                  {deathDayOptions.map((day) => (
                    <option key={day} value={day}>
                      D{day}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={cycleDeathReason}
                className="flex-1 rounded-xl bg-[var(--panel-color)] border border-[var(--border-color)] text-[var(--text-on-panel)] shadow-sm transition-colors hover:bg-black/5 flex items-center justify-center text-sm font-black"
                title="Cycle death mark"
              >
                {death?.reason || '⚔️'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => togglePlayerAlive(playerNo)}
              className="flex-1 rounded-xl bg-red-600 text-white shadow-sm transition-all hover:bg-red-700 active:scale-95 flex flex-col items-center justify-center px-1 text-[8px] font-black uppercase leading-tight"
              title="Execute this player"
            >
              <span>Execute</span>
            </button>
          )}
        </div>
        <div
          className="flex-1 relative rounded-lg border border-[var(--border-color)] bg-[var(--panel-color)] overflow-hidden shadow-sm min-h-[120px] transition-colors duration-500"
          data-script-drop="notepad"
          title="Drag a role onto this Notepad to insert it (release to insert)."
        >
          <div className="absolute inset-0 pointer-events-none opacity-40 z-0" style={{ backgroundImage: 'var(--panel-pattern)' }} />
          <textarea 
            ref={textareaRef}
            className="w-full h-full min-h-[120px] bg-transparent text-[var(--text-on-panel)] p-4 text-xs focus:ring-2 focus:ring-[var(--accent-color)]/20 outline-none resize-none font-medium leading-relaxed relative z-10 placeholder:text-[var(--muted-color)]"
            placeholder="Type social reads, role claims..."
            value={inf}
            onChange={(e) => {
              saveCaret(e.currentTarget);
              updatePlayerInfo(playerNo, e.target.value);
            }}
            onSelect={(e) => saveCaret(e.currentTarget)}
            onKeyUp={(e) => saveCaret(e.currentTarget)}
            onClick={(e) => saveCaret(e.currentTarget)}
            onBlur={(e) => saveCaret(e.currentTarget)}
          />
        </div>
        <div className="w-12 shrink-0 min-h-[120px] flex flex-col gap-2">
          <button 
            onClick={() => { setShowTemplates(!showTemplates); setShowKeywords(false); }} 
            className={`h-10 w-full rounded-xl shadow-sm transition-all active:scale-90 flex items-center justify-center ${showTemplates ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-[var(--panel-color)] border border-[var(--border-color)] text-[var(--muted-color)] hover:text-emerald-600'}`}
            title="Insert Template"
          >
            <FilePlus2 size={16} />
          </button>
          <label
            className="flex-1 rounded-xl bg-[var(--panel-color)] border border-[var(--border-color)] shadow-sm px-1.5 py-1.5 flex flex-col items-center justify-center gap-1"
            title="Props"
          >
            <Tag size={12} className="text-[var(--muted-color)] shrink-0" />
            <input
              type="text"
              value={property}
              onChange={(e) => updatePlayerProperty(playerNo, e.target.value)}
              placeholder="Props"
              className="w-full min-w-0 bg-transparent border-none p-0 text-center text-[9px] font-bold focus:ring-0 outline-none text-[var(--text-on-panel)] placeholder:text-[var(--muted-color)]"
            />
          </label>
        </div>
      </div>
    </div>
  );
});

NoteSection.displayName = 'NoteSection';

export default NoteSection;
