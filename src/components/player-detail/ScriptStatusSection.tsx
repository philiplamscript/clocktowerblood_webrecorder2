"use client";

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
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

const MOVE_PX = 8;

type DropHover =
  | { kind: 'status'; status: CharStatus; index?: number }
  | { kind: 'role'; cat: CharCategory; index: number }
  | { kind: 'category'; cat: CharCategory }
  | { kind: 'notepad' };

type Gesture = {
  phase: 'idle' | 'pending' | 'drag';
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
  const roleNode = el?.closest('[data-script-drop="role"]') as HTMLElement | null;
  if (roleNode) {
    const cat = roleNode.dataset.cat;
    const index = Number(roleNode.dataset.index);
    if (isCharCategory(cat) && Number.isInteger(index)) return { kind: 'role', cat, index };
  }
  const node = el?.closest('[data-script-drop]') as HTMLElement | null;
  if (!node) return null;
  const drop = node.dataset.scriptDrop;
  if (drop === 'status') {
    const status = node.dataset.status;
    const index = Number(node.dataset.index);
    if (status === 'POSS' || status === 'CONF' || status === 'NOT') {
      return Number.isInteger(index) ? { kind: 'status', status, index } : { kind: 'status', status };
    }
  }
  if (drop === 'notepad') return { kind: 'notepad' };
  if (drop === 'category') {
    const cat = node.dataset.cat;
    if (isCharCategory(cat)) return { kind: 'category', cat };
  }
  return null;
}

function resolveHover(gesture: Gesture, raw: DropHover | null): DropHover | null {
  if (!raw || gesture.phase !== 'drag') return null;
  if (gesture.kind === 'role') {
    if (raw.kind === 'notepad') return raw;
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
  onInsertRole?: (name: string, x: number, y: number) => void;
}

const ScriptStatusSection: React.FC<ScriptStatusSectionProps> = ({
  chars, setChars, categoryOrder, setCategoryOrder, onInsertRole,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const tabCategories: CharCategory[] = ['Townsfolk', 'Outsider', 'Minion', 'Demon'];
  const [activeCategory, setActiveCategory] = useState<CharCategory>(tabCategories[0]);
  const [confCollapsed, setConfCollapsed] = useState(false);
  const [possCollapsed, setPossCollapsed] = useState(false);
  const [notCollapsed, setNotCollapsed] = useState(false);
  const [gesture, setGesture] = useState<Gesture>(IDLE);
  const gestureRef = useRef<Gesture>(IDLE);

  const setGestureBoth = (next: Gesture) => {
    gestureRef.current = next;
    setGesture(next);
  };

  const order = useMemo(() => normalizeScriptCategoryOrder(categoryOrder), [categoryOrder]);
  const hasAnyNamed = useMemo(
    () => tabCategories.some((cat) => (chars[cat] || []).some((c) => c.name.trim())),
    [chars]
  );

  const activeRoles = useMemo(() => {
    const roles = (chars[activeCategory] || []).map((c, index) => ({
      ...c,
      index,
      status: normalizeCharStatus(c.status),
    }));
    return roles.filter((r) => r.name.trim());
  }, [chars, activeCategory]);

  const confRoles = activeRoles.filter((r) => r.status === 'CONF');
  const possRoles = activeRoles.filter((r) => r.status === 'POSS');
  const notRoles = activeRoles.filter((r) => r.status === 'NOT');

  const assignStatus = useCallback((category: CharCategory, index: number, status: CharStatus) => {
    setChars((prev) => ({
      ...prev,
      [category]: applyCharStatusAutoPlace(prev[category], index, status),
    }));
  }, [setChars]);

  const assignStatusAtTarget = useCallback((
    category: CharCategory,
    fromIndex: number,
    status: CharStatus,
    toIndex?: number,
  ) => {
    setChars((prev) => {
      const list = prev[category];
      if (fromIndex < 0 || fromIndex >= list.length) return prev;
      let nextList = list.map((c, i) => (i === fromIndex ? { ...c, status } : c));
      if (toIndex != null && toIndex >= 0 && toIndex < nextList.length && toIndex !== fromIndex) {
        nextList = moveNamedRole(nextList, fromIndex, toIndex);
      } else {
        nextList = applyCharStatusAutoPlace(nextList, fromIndex, status);
      }
      return { ...prev, [category]: nextList };
    });
  }, [setChars]);

  const cycleStatus = useCallback((category: CharCategory, index: number) => {
    setChars((prev) => {
      const next = cycleCharStatus(prev[category][index]?.status);
      return { ...prev, [category]: applyCharStatusAutoPlace(prev[category], index, next) };
    });
  }, [setChars]);

  const finishGesture = useCallback(() => {
    const g = gestureRef.current;
    if (g.phase === 'pending' && g.kind === 'role' && g.cat != null && g.index >= 0) {
      cycleStatus(g.cat, g.index);
    } else if (g.phase === 'drag' && g.kind === 'role' && g.cat != null && g.index >= 0 && g.hover) {
      const hover = g.hover;
      const cat = g.cat;
      const fromIndex = g.index;
      if (hover.kind === 'notepad') {
        onInsertRole?.(g.name, g.x, g.y);
      } else if (hover.kind === 'status') {
        assignStatusAtTarget(cat, fromIndex, hover.status, hover.index);
      } else if (hover.kind === 'role' && hover.cat === cat) {
        const targetStatus = normalizeCharStatus(chars[cat]?.[hover.index]?.status);
        assignStatusAtTarget(cat, fromIndex, targetStatus, hover.index);
      }
    } else if (g.phase === 'drag' && g.kind === 'category' && g.cat && g.hover?.kind === 'category') {
      const from = order.indexOf(g.cat);
      const to = order.indexOf(g.hover.cat);
      if (from >= 0 && to >= 0) setCategoryOrder(reorderList(order, from, to));
    }
    setGestureBoth(IDLE);
  }, [assignStatusAtTarget, chars, order, cycleStatus, setCategoryOrder, onInsertRole]);

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
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const g = gestureRef.current;
    if (g.phase === 'idle' || g.pointerId !== e.pointerId) return;
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    if (g.phase === 'pending' && (dx * dx + dy * dy) < MOVE_PX * MOVE_PX) return;
    const dragging: Gesture = { ...g, phase: 'drag', x: e.clientX, y: e.clientY, hover: null };
    dragging.hover = resolveHover(dragging, readDrop(e.clientX, e.clientY));
    setGestureBoth(dragging);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const g = gestureRef.current;
    if (g.pointerId !== e.pointerId && g.phase !== 'idle') return;
    if (g.phase === 'idle') return;
    if (g.phase === 'drag') {
      const next: Gesture = {
        ...g,
        x: e.clientX,
        y: e.clientY,
        hover: resolveHover({ ...g, x: e.clientX, y: e.clientY }, readDrop(e.clientX, e.clientY)),
      };
      setGestureBoth(next);
    }
    finishGesture();
  };

  const abortGesture = (e: React.PointerEvent) => {
    const g = gestureRef.current;
    if (g.pointerId !== e.pointerId && g.phase !== 'idle') return;
    setGestureBoth(IDLE);
  };

  const isHoverStatus = (s: CharStatus) =>
    gesture.phase === 'drag' && gesture.hover?.kind === 'status' && gesture.hover.status === s;
  const isHoverRole = (cat: CharCategory, index: number) =>
    gesture.phase === 'drag' && gesture.hover?.kind === 'role' && gesture.hover.cat === cat && gesture.hover.index === index;
  const isSourceRole = (cat: CharCategory, index: number) =>
    gesture.kind === 'role' && gesture.cat === cat && gesture.index === index && gesture.phase !== 'idle';

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
            {tabCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`h-5 px-1.5 rounded text-[7px] font-black uppercase tracking-wider transition-colors ${
                  activeCategory === cat
                    ? 'bg-[var(--accent-color)] text-white'
                    : 'bg-black/5 text-[var(--muted-color)] hover:bg-black/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="p-2 max-h-[40vh] overflow-y-auto space-y-2">
          {!hasAnyNamed ? (
            <p className="text-[9px] text-[var(--muted-color)] px-1 py-2">
              No roles loaded — Full Ledger → ROLES / Insert Role List
            </p>
          ) : (
            <>
              <div className="space-y-2">
                <div className="rounded-lg border border-[var(--border-color)] p-1">
                  <button
                    type="button"
                    data-script-drop="status"
                    data-status="CONF"
                    data-index={confRoles[confRoles.length - 1]?.index}
                    onClick={() => setConfCollapsed((v) => !v)}
                    className={`touch-none w-full text-left text-[8px] font-black uppercase tracking-widest px-1 py-0.5 mb-1 rounded flex items-center gap-1 ${
                      isHoverStatus('CONF')
                        ? 'ring-2 ring-[var(--accent-color)] bg-[var(--accent-color)] text-white'
                        : 'text-[var(--muted-color)]'
                    }`}
                  >
                    CONFIRM
                    {confCollapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                  </button>

                  {!confCollapsed && (
                    <div
                      data-script-drop="status"
                      data-status="CONF"
                      data-index={confRoles[confRoles.length - 1]?.index}
                      className={`grid gap-1 min-h-8 rounded ${isHoverStatus('CONF') ? 'ring-2 ring-[var(--accent-color)]' : ''} ${
                        notCollapsed ? 'grid-cols-4' : 'grid-cols-3'
                      }`}
                    >
                      {confRoles.map((role) => (
                        <button
                          key={`CONF-${role.index}`}
                          type="button"
                          data-script-drop="role"
                          data-cat={activeCategory}
                          data-index={role.index}
                          onPointerDown={(e) => onRolePointerDown(e, activeCategory, role.index, role.name, role.status)}
                          onPointerMove={onPointerMove}
                          onPointerUp={onPointerUp}
                          onPointerCancel={abortGesture}
                          onContextMenu={(e) => e.preventDefault()}
                          className={`touch-none text-left px-1.5 py-1 rounded text-[10px] font-bold leading-tight truncate transition-colors ${charStatusCellClass(role.status)} ${
                            isHoverRole(activeCategory, role.index) ? 'ring-2 ring-[var(--accent-color)]' : ''
                          } ${isSourceRole(activeCategory, role.index) && gesture.phase === 'drag' ? 'opacity-40' : ''}`}
                          title={`${role.name} (${role.status}) · tap to cycle · drag to reorder/assign or drop onto Notepad to insert`}
                        >
                          {role.name}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    data-script-drop="status"
                    data-status="POSS"
                    data-index={possRoles[possRoles.length - 1]?.index}
                    onClick={() => setPossCollapsed((v) => !v)}
                    className={`touch-none w-full text-left text-[8px] font-black uppercase tracking-widest px-1 py-0.5 rounded flex items-center gap-1 ${
                      isHoverStatus('POSS')
                        ? 'ring-2 ring-[var(--accent-color)] bg-[var(--accent-color)] text-white'
                        : 'text-[var(--muted-color)]'
                    }`}
                  >
                    POSSIBLE
                    {possCollapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                  </button>

                  {!possCollapsed && (
                    <div
                      data-script-drop="status"
                      data-status="POSS"
                      data-index={possRoles[possRoles.length - 1]?.index}
                      className={`grid gap-1 min-h-8 rounded ${isHoverStatus('POSS') ? 'ring-2 ring-[var(--accent-color)]' : ''} ${
                        notCollapsed ? 'grid-cols-4' : 'grid-cols-3'
                      }`}
                    >
                      {possRoles.map((role) => (
                        <button
                          key={`POSS-${role.index}`}
                          type="button"
                          data-script-drop="role"
                          data-cat={activeCategory}
                          data-index={role.index}
                          onPointerDown={(e) => onRolePointerDown(e, activeCategory, role.index, role.name, role.status)}
                          onPointerMove={onPointerMove}
                          onPointerUp={onPointerUp}
                          onPointerCancel={abortGesture}
                          onContextMenu={(e) => e.preventDefault()}
                          className={`touch-none text-left px-1.5 py-1 rounded text-[10px] font-bold leading-tight truncate transition-colors ${charStatusCellClass(role.status)} ${
                            isHoverRole(activeCategory, role.index) ? 'ring-2 ring-[var(--accent-color)]' : ''
                          } ${isSourceRole(activeCategory, role.index) && gesture.phase === 'drag' ? 'opacity-40' : ''}`}
                          title={`${role.name} (${role.status}) · tap to cycle · drag to reorder/assign or drop onto Notepad to insert`}
                        >
                          {role.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-[var(--border-color)] p-1">
                  <button
                    type="button"
                    data-script-drop="status"
                    data-status="NOT"
                    data-index={notRoles[notRoles.length - 1]?.index}
                    onClick={() => setNotCollapsed((v) => !v)}
                    className={`touch-none w-full text-left text-[8px] font-black uppercase tracking-widest px-1 py-0.5 mb-1 rounded flex items-center gap-1 ${
                      isHoverStatus('NOT')
                        ? 'ring-2 ring-[var(--accent-color)] bg-[var(--accent-color)] text-white'
                        : 'text-[var(--muted-color)]'
                    }`}
                  >
                    IMPOSSIBLE
                    {notCollapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                  </button>

                  {!notCollapsed && (
                    <div
                      data-script-drop="status"
                      data-status="NOT"
                      data-index={notRoles[notRoles.length - 1]?.index}
                      className={`grid gap-1 grid-cols-3 min-h-8 rounded ${
                        isHoverStatus('NOT') ? 'ring-2 ring-[var(--accent-color)]' : ''
                      }`}
                    >
                      {notRoles.map((role) => (
                        <button
                          key={`NOT-${role.index}`}
                          type="button"
                          data-script-drop="role"
                          data-cat={activeCategory}
                          data-index={role.index}
                          onPointerDown={(e) => onRolePointerDown(e, activeCategory, role.index, role.name, role.status)}
                          onPointerMove={onPointerMove}
                          onPointerUp={onPointerUp}
                          onPointerCancel={abortGesture}
                          onContextMenu={(e) => e.preventDefault()}
                          className={`touch-none text-left px-1.5 py-1 rounded text-[10px] font-bold leading-tight truncate transition-colors ${charStatusCellClass(role.status)} ${
                            isHoverRole(activeCategory, role.index) ? 'ring-2 ring-[var(--accent-color)]' : ''
                          } ${isSourceRole(activeCategory, role.index) && gesture.phase === 'drag' ? 'opacity-40' : ''}`}
                          title={`${role.name} (${role.status}) · tap to cycle · drag to reorder/assign or drop onto Notepad to insert`}
                        >
                          {role.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
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
