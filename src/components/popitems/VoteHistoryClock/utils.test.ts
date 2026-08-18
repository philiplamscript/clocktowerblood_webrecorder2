import { describe, it, expect } from 'vitest';
import { innerRadius, innerRingIndexToDay, dayRingMidRadius, southRotationDeg } from './utils';

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

describe('southRotationDeg', () => {
  const meCenter = (me: number, count: number) => {
    const step = 360 / count;
    return ((me - 1) * step) - 90 + (step / 2);
  };

  it('returns 0 when Me is unset or out of range', () => {
    expect(southRotationDeg(null, 15)).toBe(0);
    expect(southRotationDeg(undefined, 15)).toBe(0);
    expect(southRotationDeg(0, 15)).toBe(0);
    expect(southRotationDeg(16, 15)).toBe(0);
    expect(southRotationDeg(1, 0)).toBe(0);
  });

  it('rotates so Me slice center sits at SVG south (+90)', () => {
    for (const me of [1, 3, 8, 15]) {
      const rot = southRotationDeg(me, 15);
      const placed = ((meCenter(me, 15) + rot) % 360 + 360) % 360;
      expect(placed).toBeCloseTo(90, 8);
    }
  });
});
