import { describe, it, expect } from 'vitest';
import { innerRadius, innerRingIndexToDay, dayRingMidRadius } from './utils';

describe('clock day ring direction', () => {
  it('maps inner ring to D1 when in-out', () => {
    expect(innerRingIndexToDay(0, 4, 'in-out')).toBe(1);
    expect(innerRingIndexToDay(3, 4, 'in-out')).toBe(4);
  });

  it('maps outer ring to D1 when out-in', () => {
    expect(innerRingIndexToDay(0, 4, 'out-in')).toBe(4);
    expect(innerRingIndexToDay(3, 4, 'out-in')).toBe(1);
  });

  it('places D1 near the inner edge for in-out', () => {
    const mid = dayRingMidRadius(1, 4, 10, 'in-out');
    expect(mid).toBe(innerRadius + 5);
  });

  it('places D1 near the outer edge for out-in', () => {
    const mid = dayRingMidRadius(1, 4, 10, 'out-in');
    expect(mid).toBe(innerRadius + 35);
  });
});
