"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  STATUS_OPTIONS,
  cycleCharStatus,
  charStatusCellClass,
  normalizeCharStatus,
  normalizeScriptCategoryOrder,
  moveNamedRole,
  applyCharStatusAutoPlace,
  reorderList,
  type CharDict,
  type CharStatus,
  type CharCategory,
} from '../../type';

const HOLD_MS = 300;
const MOVE_PX = 8;

type VisibleMap = Record<CharStatus, boolean>;
const ALL_VISIBLE: VisibleMap = { POSS: true, CONF: true, NOT: true };
const NONE_VISIBLE: VisibleMap = { POSS: false, CONF: false, NOT: false };

type DropHover =
  | { kind: 'status'; status: CharStatus }
  | { kind: 'role'; cat: CharCategory; index: number }
  | { kind: 'category'; cat: CharCategory };

type Gesture = {
  phase: 'idle' | 'pending' | 'drag' | 'inserted';
  kind: 'role' | 'category' | null;
  pointerId: number | null;
  startX: number;
  startY: number;
  x: number;
  y: number;
  cat: CharCategory | null;
  index: number;
  name: string;
  status: CharStatus | null;
  hover: DropHover | null;
};

const IDLE: Gesture = {
  phase: 'idle',
  kind: null,
  pointerId: null,
  startX: 0,
  startY: 0,
  x: 0,
  y: 0,
  cat: null,
  index: -1,
  name: '',
  status: null,
  hover: null,
};

const isCharCategory = (value: string | undefined): value is CharCategory =>
  value === 'Townsfolk' || value === 'Outsider' || value === 'Minion' || value === 'Demon';

function readDrop(x: number, y: number): DropHover | null {
  const el = document.elementFromPoint(x, y) as HTMLElement | null;
  const node = el?.closest('[data-script-drop]') as HTMLElement | null;
  if (!node) return null;
  const drop = node.dataset.scriptDrop;
  if (drop === 'status') {
    const status = node.dataset.status;
    if (status === 'POSS' || status === 'CONF' || status === 'NOT') return { kind: 'status', status };
  }
  if (drop === 'role') {
    const cat = node.dataset.cat;
    const index = Number(node.dataset.index);
    if (isCharCategory(cat) && Number.isInteger(index)) return { kind: 'role', cat, index };
  }
  if (drop === 'category') {
    const cat = node.dataset.cat;
    if (isCharCategory(cat)) return { kind: 'category', cat };
  }
  return null;
}

function resolveHover(gesture: Gesture, raw: DropHover | null): DropHover | null {
  if (!raw || gesture.phase !== 'drag') return null;
  if (gesture.kind === 'role') {
    if (raw.kind === 'status') return raw;
    if (raw.kind === 'role' && raw.cat === gesture.cat && raw.index !== gesture.index) return raw;
    return null;
  }
  if (gesture.kind === 'category') {
    if (raw.kind === 'category' && raw.cat !== gesture.cat) return raw;
    if (raw.kind === 'role' && raw.cat !== gesture.cat) return { kind: 'category', cat: raw.cat };
  }
  return null;
}

interface ScriptStatusSectionProps {
  chars: CharDict;
  setChars: React.Dispatch<React.SetStateAction<CharDict>>;
  categoryOrder: CharCategory[];
  setCategoryOrder: (order: CharCategory[]) => void;
  onInsertRole?: (name: string) => void;
}

const ScriptStatusSection: React.FC<ScriptStatusSectionProps> = ({
  chars, setChars, categoryOrder, setCategoryOrder, onInsertRole,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState<VisibleMap>(ALL_VISIBLE);
  const [gesture, setGesture] = useState<Gesture>(IDLE);
  const gestureRef = useRef<Gesture>(IDLE);
  const holdTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (holdTimerRef.current != null) window.clearTimeout(holdTimerRef.current);
  }, []);

  const setGestureBoth = (next: Gesture) => {
    gestureRef.current = next;
    setGesture(next);
  };

  const clearHold = () => {
    if (holdTimerRef.current != null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const order = useMemo(() => normalizeScriptCategoryOrder(categoryOrder), [categoryOrder]);
  const allOn = STATUS_OPTIONS.every((s) => visible[s]);

  const namedByCategory = useMemo(() => {
    return order.map((cat) => {
      const roles = (chars[cat] || [])
        .map((c, index) => ({ ...c, index, status: normalizeCharStatus(c.status) }))
        .filter((c) => c.name.trim())
        .filter((c) => visible[c.status]);
      return { cat, roles };
    }).filter((block) => (chars[block.cat] || []).some((c) => c.name.trim()));
  }, [chars, order, visible]);

  const hasAnyNamed = useMemo(
    () => order.some((cat) => (chars[cat] || []).some((c) => c.name.trim())),
    [chars, order]
  );

  const visibleRoleCount = namedByCategory.reduce((n, b) => n + b.roles.length, 0);

  const assignStatus = useCallback((category: CharCategory, index: number, status: CharStatus) => {
    setChars((prev) => ({
      ...prev,
      [category]: applyCharStatusAutoPlace(prev[category], index, status),
    }));
  }, [setChars]);

  const cycleStatus = useCallback((category: CharCategory, index: number) => {
    setChars((prev) => {
      const next = cycleCharStatus(prev[category][index]?.status);
      return { ...prev, [category]: applyCharStatusAutoPlace(prev[category], index, next) };
    });
  }, [setChars]);

  const finishGesture = useCallback(() => {
    clearHold();
    const g = gestureRef.current;
    if (g.phase === 'pending' && g.kind === 'role' && g.cat != null && g.index >= 0) {
      cycleStatus(g.cat, g.index);
    } else if (g.phase === 'drag' && g.kind === 'role' && g.cat != null && g.index >= 0 && g.hover) {
      const hover = g.hover;
      const cat = g.cat;
      const fromIndex = g.index;
      if (hover.kind === 'status') assignStatus(cat, fromIndex, hover.status);
      else if (hover.kind === 'role' && hover.cat === cat) {
        setChars((prev) => ({
          ...prev,
          [cat]: moveNamedRole(prev[cat], fromIndex, hover.index),
        }));
      }
    } else if (g.phase === 'drag' && g.kind === 'category' && g.cat && g.hover?.kind === 'category') {
      const from = order.indexOf(g.cat);
      const to = order.indexOf(g.hover.cat);
      if (from >= 0 && to >= 0) setCategoryOrder(reorderList(order, from, to));
    }
    setGestureBoth(IDLE);
  }, [assignStatus, order, cycleStatus, setCategoryOrder, setChars]);

  const startHoldTimer = (name: string) => {
    clearHold();
    holdTimerRef.current = window.setTimeout(() => {
      const g = gestureRef.current;
      if (g.phase !== 'pending' || g.kind !== 'role') return;
      onInsertRole?.(name);
      setGestureBoth({ ...g, phase: 'inserted' });
    }, HOLD_MS);
  };

  const onRolePointerDown = (
    e: React.PointerEvent,
    cat: CharCategory,
    index: number,
    name: string,
    status: CharStatus,
  ) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const next: Gesture = {
      phase: 'pending',
      kind: 'role',
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      cat,
      index,
      name,
      status,
      hover: null,
    };
    setGestureBoth(next);
    startHoldTimer(name);
  };

  const onCategoryPointerDown = (e: React.PointerEvent, cat: CharCategory) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setGestureBoth({
      phase: 'pending',
      kind: 'category',
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      cat,
      index: -1,
      name: cat,
      status: null,
      hover: null,
    });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const g = gestureRef.current;
    if (g.phase === 'idle' || g.pointerId !== e.pointerId) return;
    if (g.phase === 'inserted') return;
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    if (g.phase === 'pending' && (dx * dx + dy * dy) < MOVE_PX * MOVE_PX) return;
    clearHold();
    const dragging: Gesture = { ...g, phase: 'drag', x: e.clientX, y: e.clientY, hover: null };
    dragging.hover = resolveHover(dragging, readDrop(e.clientX, e.clientY));
    setGestureBoth(dragging);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const g = gestureRef.current;
    if (g.pointerId !== e.pointerId && g.phase !== 'idle') return;
    if (g.phase === 'idle') return;
    finishGesture();
  };

  const abortGesture = (e: React.PointerEvent) => {
    const g = gestureRef.current;
    if (g.pointerId !== e.pointerId && g.phase !== 'idle') return;
    clearHold();
    setGestureBoth(IDLE);
  };

  const toggleAll = () => setVisible(allOn ? NONE_VISIBLE : ALL_VISIBLE);
  const toggleStatusFilter = (opt: CharStatus) => {
    setVisible((prev) => ({ ...prev, [opt]: !prev[opt] }));
  };

  const isHoverStatus = (s: CharStatus) =>
    gesture.phase === 'drag' && gesture.hover?.kind === 'status' && gesture.hover.status === s;
  const isHoverRole = (cat: CharCategory, index: number) =>
    gesture.phase === 'drag' && gesture.hover?.kind === 'role' && gesture.hover.cat === cat && gesture.hover.index === index;
  const isHoverCat = (cat: CharCategory) =>
    gesture.phase === 'drag' && gesture.hover?.kind === 'category' && gesture.hover.cat === cat;
  const isSourceRole = (cat: CharCategory, index: number) =>
    gesture.kind === 'role' && gesture.cat === cat && gesture.index === index && gesture.phase !== 'idle';
  const isSourceCat = (cat: CharCategory) =>
    gesture.kind === 'category' && gesture.cat === cat && gesture.phase !== 'idle';

  return (
    <div className="bg-[var(--panel-color)] rounded-xl border border-[var(--border-color)] shadow-sm overflow-hidden transition-colors duration-500 select-none">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border-color)]">
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[var(--text-on-panel)]"
        >
          Script
          {collapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </button>
        {!collapsed && (
          <div className="flex flex-wrap gap-1 ml-auto">
            <button
              type="button"
              onClick={toggleAll}
              className={`h-5 px-1.5 rounded text-[7px] font-black uppercase tracking-wider transition-colors ${
                allOn
                  ? 'bg-[var(--accent-color)] text-white'
                  : 'bg-black/5 text-[var(--muted-color)] hover:bg-black/10'
              }`}
            >
              ALL
            </button>
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                data-script-drop="status"
                data-status={opt}
                onClick={() => toggleStatusFilter(opt)}
                className={`h-5 px-1.5 rounded text-[7px] font-black uppercase tracking-wider transition-colors ${
                  isHoverStatus(opt)
                    ? 'ring-2 ring-[var(--accent-color)] bg-[var(--accent-color)] text-white'
                    : visible[opt]
                      ? 'bg-[var(--accent-color)] text-white'
                      : 'bg-black/5 text-[var(--muted-color)] hover:bg-black/10'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="p-2 max-h-[40vh] overflow-y-auto">
          {!hasAnyNamed ? (
            <p className="text-[9px] text-[var(--muted-color)] px-1 py-2">
              No roles loaded — Full Ledger → ROLES / Insert Role List
            </p>
          ) : visibleRoleCount === 0 ? (
            <p className="text-[9px] text-[var(--muted-color)] px-1 py-2">No roles match this filter.</p>
          ) : (
            namedByCategory.map((block, blockIdx) => (
              <div
                key={block.cat}
                data-script-drop="category"
                data-cat={block.cat}
                className={`rounded ${isHoverCat(block.cat) ? 'ring-2 ring-[var(--accent-color)]/70' : ''} ${isSourceCat(block.cat) && gesture.phase === 'drag' ? 'opacity-50' : ''}`}
              >
                {blockIdx > 0 && <div className="my-1.5 border-t border-[var(--border-color)] opacity-60" />}
                <button
                  type="button"
                  className="touch-none text-[8px] font-black uppercase tracking-widest text-[var(--muted-color)] px-1 py-0.5 mb-0.5"
                  onPointerDown={(e) => onCategoryPointerDown(e, block.cat)}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={abortGesture}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {block.cat}
                </button>
                {block.roles.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
                    {block.roles.map((role) => (
                      <button
                        key={`${block.cat}-${role.index}`}
                        type="button"
                        data-script-drop="role"
                        data-cat={block.cat}
                        data-index={role.index}
                        onPointerDown={(e) => onRolePointerDown(e, block.cat, role.index, role.name, role.status)}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerCancel={abortGesture}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`touch-none text-left px-1.5 py-1 rounded text-[10px] font-bold leading-tight truncate transition-colors ${charStatusCellClass(role.status)} ${
                          isHoverRole(block.cat, role.index) ? 'ring-2 ring-[var(--accent-color)]' : ''
                        } ${isSourceRole(block.cat, role.index) && gesture.phase === 'drag' ? 'opacity-40' : ''} ${
                          gesture.phase === 'inserted' && isSourceRole(block.cat, role.index) ? 'ring-1 ring-[var(--accent-color)]' : ''
                        }`}
                        title={`${role.name} (${role.status}) · hold to insert · drag to reorder or assign`}
                      >
                        {role.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {gesture.phase === 'drag' && (
        <div
          className={`fixed z-[80] pointer-events-none px-1.5 py-1 rounded text-[10px] font-bold shadow-lg ${
            gesture.kind === 'role' ? charStatusCellClass(gesture.status) : 'bg-[var(--panel-color)] text-[var(--text-on-panel)]'
          } border border-[var(--border-color)]`}
          style={{ left: gesture.x, top: gesture.y, transform: 'translate(-50%, -110%)' }}
        >
          {gesture.name}
        </div>
      )}
    </div>
  );
};

export default ScriptStatusSection;
