import { type ClockDayDirection, normalizeClockDayDirection } from '../../../type';

export const cx = 144;
export const cy = 144;
export const outerRadius = 140; 
export const innerRadius = 58;  // Data rings start here
export const sliceStartRadius = 42; // Interactive slices start closer to center
export const labelRadius = 48; // Where player numbers will sit
export const DEFAULT_CLOCK_DAY_DIRECTION: ClockDayDirection = 'out-in';

const dir = (direction?: ClockDayDirection): ClockDayDirection =>
  normalizeClockDayDirection(direction ?? DEFAULT_CLOCK_DAY_DIRECTION);

/** `rIdx` 0 is the innermost ring. */
export const innerRingIndexToDay = (rIdx: number, ringCount: number, direction?: ClockDayDirection) =>
  dir(direction) === 'in-out' ? rIdx + 1 : ringCount - rIdx;

export const dayRingMidRadius = (day: number, ringCount: number, ringWidth: number, direction?: ClockDayDirection) => {
  const rIdx = dir(direction) === 'in-out' ? day - 1 : ringCount - day;
  return innerRadius + (rIdx + 0.5) * ringWidth;
};

/** Degrees to rotate seats so `mePlayerNo` slice center sits at SVG south (+90°). Unset → 0. */
export const southRotationDeg = (mePlayerNo: number | null | undefined, playerCount: number) => {
  if (!mePlayerNo || mePlayerNo < 1 || playerCount < 1 || mePlayerNo > playerCount) return 0;
  const angleStep = 360 / playerCount;
  const meCenter = ((mePlayerNo - 1) * angleStep) - 90 + (angleStep / 2);
  return 90 - meCenter;
};

export const getPosition = (num: number, playerCount: number, radius: number) => {
  const angle = ((num - 1) * (360 / playerCount)) - 90 + (360 / (playerCount * 2));
  return {
    x: cx + radius * Math.cos(angle * Math.PI / 180),
    y: cy + radius * Math.sin(angle * Math.PI / 180)
  };
};

export const getSlicePath = (index: number, total: number, rInner: number, rOuter: number) => {
  const angleStep = 360 / total;
  const startAngle = (index * angleStep) - 90;
  const endAngle = ((index + 1) * angleStep) - 90;
  
  const pad = 0.5;
  const sA = startAngle + pad;
  const eA = endAngle - pad;

  const p1 = { x: cx + (rOuter * Math.cos(sA * Math.PI / 180)), y: cy + (rOuter * Math.sin(sA * Math.PI / 180)) };
  const p2 = { x: cx + (rOuter * Math.cos(eA * Math.PI / 180)), y: cy + (rOuter * Math.sin(eA * Math.PI / 180)) };
  const p3 = { x: cx + (rInner * Math.cos(eA * Math.PI / 180)), y: cy + (rInner * Math.sin(eA * Math.PI / 180)) };
  const p4 = { x: cx + (rInner * Math.cos(sA * Math.PI / 180)), y: cy + (rInner * Math.sin(sA * Math.PI / 180)) };
  
  return `M ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${angleStep > 180 ? 1 : 0} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rInner} ${rInner} 0 ${angleStep > 180 ? 1 : 0} 0 ${p4.x} ${p4.y} Z`;
};
