"use client";

/**
 * Calculates the SVG coordinate for a player number at a given radius.
 */
export const getPosition = (
  num: number, 
  playerCount: number, 
  radius: number, 
  cx: number = 144, 
  cy: number = 144
) => {
  const angle = ((num - 1) * (360 / playerCount)) - 90 + (360 / (playerCount * 2));
  return {
    x: cx + radius * Math.cos(angle * Math.PI / 180),
    y: cy + radius * Math.sin(angle * Math.PI / 180)
  };
};

/**
 * Generates the SVG path for a circular slice segment.
 */
export const getSlicePath = (
  index: number, 
  total: number, 
  rInner: number, 
  rOuter: number, 
  cx: number = 144, 
  cy: number = 144
) => {
  const angleStep = 360 / total;
  const startAngle = (index * angleStep) - 90;
  const endAngle = ((index + 1) * angleStep) - 90;
  
  const p1 = { x: cx + (rOuter * Math.cos(startAngle * Math.PI / 180)), y: cy + (rOuter * Math.sin(startAngle * Math.PI / 180)) };
  const p2 = { x: cx + (rOuter * Math.cos(endAngle * Math.PI / 180)), y: cy + (rOuter * Math.sin(endAngle * Math.PI / 180)) };
  const p3 = { x: cx + (rInner * Math.cos(endAngle * Math.PI / 180)), y: cy + (rInner * Math.sin(endAngle * Math.PI / 180)) };
  const p4 = { x: cx + (rInner * Math.cos(startAngle * Math.PI / 180)), y: cy + (rInner * Math.sin(startAngle * Math.PI / 180)) };
  
  const largeArcFlag = angleStep > 180 ? 1 : 0;
  
  return `M ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${p4.x} ${p4.y} Z`;
};