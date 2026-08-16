"use client";

import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  SCRIPT_STATUS_CATEGORIES,
  STATUS_OPTIONS,
  cycleCharStatus,
  charStatusCellClass,
  normalizeCharStatus,
  type CharDict,
  type CharStatus,
  type Character,
} from '../../type';

type StatusFilter = 'ALL' | CharStatus;

interface ScriptStatusSectionProps {
  chars: CharDict;
  setChars: React.Dispatch<React.SetStateAction<CharDict>>;
}

const ScriptStatusSection: React.FC<ScriptStatusSectionProps> = ({ chars, setChars }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [filter, setFilter] = useState<StatusFilter>('ALL');

  const namedByCategory = useMemo(() => {
    return SCRIPT_STATUS_CATEGORIES.map((cat) => {
      const roles = (chars[cat] || [])
        .map((c, index) => ({ ...c, index, status: normalizeCharStatus(c.status) }))
        .filter((c) => c.name.trim())
        .filter((c) => filter === 'ALL' || c.status === filter);
      return { cat, roles };
    }).filter((block) => block.roles.length > 0);
  }, [chars, filter]);

  const hasAnyNamed = useMemo(
    () => SCRIPT_STATUS_CATEGORIES.some((cat) => (chars[cat] || []).some((c) => c.name.trim())),
    [chars]
  );

  const toggleStatus = (category: keyof CharDict, index: number) => {
    setChars((prev) => ({
      ...prev,
      [category]: prev[category].map((item: Character, idx: number) =>
        idx === index ? { ...item, status: cycleCharStatus(item.status) } : item
      ),
    }));
  };

  return (
    <div className="bg-[var(--panel-color)] rounded-xl border border-[var(--border-color)] shadow-sm overflow-hidden transition-colors duration-500">
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
            {(['ALL', ...STATUS_OPTIONS] as StatusFilter[]).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFilter(opt)}
                className={`h-5 px-1.5 rounded text-[7px] font-black uppercase tracking-wider transition-colors ${
                  filter === opt
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
          ) : namedByCategory.length === 0 ? (
            <p className="text-[9px] text-[var(--muted-color)] px-1 py-2">No roles match this filter.</p>
          ) : (
            namedByCategory.map((block, blockIdx) => (
              <div key={block.cat}>
                {blockIdx > 0 && <div className="my-1.5 border-t border-[var(--border-color)] opacity-60" />}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
                  {block.roles.map((role) => (
                    <button
                      key={`${block.cat}-${role.index}`}
                      type="button"
                      onClick={() => toggleStatus(block.cat, role.index)}
                      className={`text-left px-1.5 py-1 rounded text-[10px] font-bold leading-tight truncate transition-colors active:scale-[0.98] ${charStatusCellClass(role.status)}`}
                      title={`${role.name} (${role.status})`}
                    >
                      {role.name}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ScriptStatusSection;
