import { describe, it, expect } from 'vitest';
import {
  createInitialChars,
  REASON_CYCLE,
  STATUS_OPTIONS,
  normalizeCharStatus,
  cycleCharStatus,
  normalizeCharDict,
  getRoleDistForPlayerCount,
  normalizeClockDayDirection,
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
});
