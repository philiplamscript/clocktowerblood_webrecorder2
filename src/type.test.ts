import { describe, it, expect } from 'vitest';
import {
  createInitialChars,
  REASON_CYCLE,
  STATUS_OPTIONS,
  SCRIPT_STATUS_CATEGORIES,
  normalizeCharStatus,
  cycleCharStatus,
  normalizeCharDict,
  normalizeScriptCategoryOrder,
  reorderList,
  moveNamedRole,
  applyCharStatusAutoPlace,
  getRoleDistForPlayerCount,
  normalizeClockDayDirection,
  normalizeMePlayerNo,
  remapMeAfterReorder,
  remapMeAfterRemove,
  parseRoleScript,
  parsePlayerNames,
  buildThemePrompt,
  type Character,
} from './type';

describe('Game Data Utilities', () => {
  it('should create initial character dictionary with correct structure', () => {
    const chars = createInitialChars();
    
    expect(chars).toHaveProperty('Townsfolk');
    expect(chars).toHaveProperty('Outsider');
    expect(chars).toHaveProperty('Minion');
    expect(chars).toHaveProperty('Demon');
    
    expect(chars.Townsfolk).toHaveLength(8);
    expect(chars.Townsfolk[0].status).toBe('POSS');
  });

  it('should have the expected death reasons in the cycle', () => {
    expect(REASON_CYCLE).toContain('⚔️');
    expect(REASON_CYCLE).toContain('🌑');
  });

  it('should have standard status options for character tracking', () => {
    expect(STATUS_OPTIONS).toEqual(['POSS', 'CONF', 'NOT']);
    expect(STATUS_OPTIONS).not.toContain('—');
  });

  it('should migrate legacy dash status to POSS', () => {
    expect(normalizeCharStatus('—')).toBe('POSS');
    expect(normalizeCharStatus(undefined)).toBe('POSS');
    const migrated = normalizeCharDict({
      Townsfolk: [{ name: 'Chef', status: '—', note: '' }],
      Outsider: [],
      Minion: [],
      Demon: [{ name: 'Imp', status: 'CONF', note: '' }],
    });
    expect(migrated.Townsfolk[0].status).toBe('POSS');
    expect(migrated.Demon[0].status).toBe('CONF');
  });

  it('should cycle POSS → CONF → NOT → POSS', () => {
    expect(cycleCharStatus('POSS')).toBe('CONF');
    expect(cycleCharStatus('CONF')).toBe('NOT');
    expect(cycleCharStatus('NOT')).toBe('POSS');
    expect(cycleCharStatus('—')).toBe('CONF');
  });

  it('should map player count to standard role distribution', () => {
    expect(getRoleDistForPlayerCount(7)).toEqual({ townsfolk: 5, outsiders: 0, minions: 1, demons: 1 });
    expect(getRoleDistForPlayerCount(10)).toEqual({ townsfolk: 7, outsiders: 0, minions: 2, demons: 1 });
    expect(getRoleDistForPlayerCount(15)).toEqual({ townsfolk: 9, outsiders: 2, minions: 3, demons: 1 });
  });

  it('should default unknown clock day direction to out-in', () => {
    expect(normalizeClockDayDirection('in-out')).toBe('in-out');
    expect(normalizeClockDayDirection('out-in')).toBe('out-in');
    expect(normalizeClockDayDirection('nope')).toBe('out-in');
    expect(normalizeClockDayDirection(undefined)).toBe('out-in');
  });

  it('normalizes Me seat numbers', () => {
    expect(normalizeMePlayerNo(7)).toBe(7);
    expect(normalizeMePlayerNo('3')).toBe(3);
    expect(normalizeMePlayerNo(0)).toBe(null);
    expect(normalizeMePlayerNo(null)).toBe(null);
    expect(normalizeMePlayerNo(1.5)).toBe(null);
  });

  it('remaps Me after splice reorder that rewrites seat numbers', () => {
    expect(remapMeAfterReorder(null, 1, 3)).toBe(null);
    expect(remapMeAfterReorder(2, 1, 3)).toBe(4);
    expect(remapMeAfterReorder(3, 1, 3)).toBe(2);
    expect(remapMeAfterReorder(1, 1, 3)).toBe(1);
    expect(remapMeAfterReorder(5, 1, 3)).toBe(5);
    expect(remapMeAfterReorder(4, 3, 1)).toBe(2);
    expect(remapMeAfterReorder(2, 3, 1)).toBe(3);
  });

  it('remaps Me after removing a seat', () => {
    expect(remapMeAfterRemove(null, 2)).toBe(null);
    expect(remapMeAfterRemove(2, 2)).toBe(null);
    expect(remapMeAfterRemove(5, 2)).toBe(4);
    expect(remapMeAfterRemove(1, 2)).toBe(1);
  });

  it('normalizes script category order and fills missing cats', () => {
    expect(normalizeScriptCategoryOrder(undefined)).toEqual([...SCRIPT_STATUS_CATEGORIES]);
    expect(normalizeScriptCategoryOrder(['Townsfolk', 'Demon'])).toEqual([
      'Townsfolk', 'Demon', 'Minion', 'Outsider',
    ]);
    expect(normalizeScriptCategoryOrder(['nope', 'Minion', 'Minion', 'Townsfolk'])).toEqual([
      'Minion', 'Townsfolk', 'Demon', 'Outsider',
    ]);
  });

  it('reorders a list in place by splice', () => {
    expect(reorderList(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
    expect(reorderList(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b']);
    const same = ['a', 'b'];
    expect(reorderList(same, 1, 1)).toBe(same);
  });

  const roles = (names: [string, string][]): Character[] =>
    names.map(([name, status]) => ({ name, status, note: '' }));

  it('moves named roles and keeps empty slots at the end', () => {
    const list = roles([
      ['Chef', 'POSS'],
      ['Empath', 'POSS'],
      ['', 'POSS'],
      ['Washerwoman', 'POSS'],
      ['', 'POSS'],
    ]);
    const moved = moveNamedRole(list, 3, 0);
    expect(moved.map((c) => c.name)).toEqual(['Washerwoman', 'Chef', 'Empath', '', '']);
    expect(moveNamedRole(list, 0, 0)).toBe(list);
  });

  it('auto-places CONF first and NOT last among named roles', () => {
    const list = roles([
      ['Chef', 'POSS'],
      ['Empath', 'POSS'],
      ['Washerwoman', 'POSS'],
      ['', 'POSS'],
    ]);
    const conf = applyCharStatusAutoPlace(list, 2, 'CONF');
    expect(conf.map((c) => `${c.name}:${c.status}`)).toEqual([
      'Washerwoman:CONF', 'Chef:POSS', 'Empath:POSS', ':POSS',
    ]);
    const not = applyCharStatusAutoPlace(list, 0, 'NOT');
    expect(not.map((c) => `${c.name}:${c.status}`)).toEqual([
      'Empath:POSS', 'Washerwoman:POSS', 'Chef:NOT', ':POSS',
    ]);
    const poss = applyCharStatusAutoPlace(list, 2, 'POSS');
    expect(poss.map((c) => c.name)).toEqual(['Chef', 'Empath', 'Washerwoman', '']);
    expect(poss[2].status).toBe('POSS');
  });
});

describe('AI script and name parsers', () => {
  it('parses fenced Gemini role output into categories', () => {
    const raw = `\`\`\`bash
Townsfolk:
[👨‍🍳][Chef]
Washerwoman
Outsider:
[🍷][Drunk]
Minion:
Poisoner
Demon:
Imp
\`\`\``;
    const chars = parseRoleScript(raw);
    expect(chars.Townsfolk[0].name).toBe('[👨‍🍳][Chef]');
    expect(chars.Townsfolk[1].name).toBe('Washerwoman');
    expect(chars.Outsider[0].name).toBe('[🍷][Drunk]');
    expect(chars.Minion[0].name).toBe('Poisoner');
    expect(chars.Demon[0].name).toBe('Imp');
    expect(chars.Townsfolk).toHaveLength(8);
  });

  it('parses JSON name lists and numbered fallbacks', () => {
    expect(parsePlayerNames('```json\n{"names":["Ada","Bob"," "]}\n```', 5)).toEqual(['Ada', 'Bob', '']);
    expect(parsePlayerNames('Here you go {"names":["Cara","Dan"]}', 2)).toEqual(['Cara', 'Dan']);
    expect(parsePlayerNames('1. Eli\n2. Fay\n3. Gus', 2)).toEqual(['Eli', 'Fay']);
  });

  it('builds a theme prompt that includes style and pattern mode', () => {
    const prompt = buildThemePrompt('Neon City', 'decorative');
    expect(prompt).toContain('Neon City');
    expect(prompt).toContain('"patterns"');
    expect(buildThemePrompt('', 'none')).not.toContain('"patterns"');
  });
});
