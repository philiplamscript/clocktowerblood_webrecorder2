import { describe, it, expect } from 'vitest';
import { createInitialChars, REASON_CYCLE, STATUS_OPTIONS } from './type';

describe('Game Data Utilities', () => {
  it('should create initial character dictionary with correct structure', () => {
    const chars = createInitialChars();
    
    expect(chars).toHaveProperty('Townsfolk');
    expect(chars).toHaveProperty('Outsider');
    expect(chars).toHaveProperty('Minion');
    expect(chars).toHaveProperty('Demon');
    
    expect(chars.Townsfolk).toHaveLength(8);
    expect(chars.Townsfolk[0].status).toBe('—');
  });

  it('should have the expected death reasons in the cycle', () => {
    expect(REASON_CYCLE).toContain('⚔️');
    expect(REASON_CYCLE).toContain('🌑');
  });

  it('should have standard status options for character tracking', () => {
    expect(STATUS_OPTIONS).toContain('POSS');
    expect(STATUS_OPTIONS).toContain('CONF');
    expect(STATUS_OPTIONS).toContain('NOT');
  });
});