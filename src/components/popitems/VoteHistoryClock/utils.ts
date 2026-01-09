export const cx = 144;
export const cy = 144;
export const outerRadius = 140; // Slightly smaller for better padding
export const innerRadius = 58;  // Slightly larger center for better interaction

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
  
  // Adding a tiny gap between slices for elegance
  const pad = 0.5;
  const sA = startAngle + pad;
  const eA = endAngle - pad;

  const p1 = { x: cx + (rOuter * Math.cos(sA * Math.PI / 180)), y: cy + (rOuter * Math.sin(sA * Math.PI / 180)) };
  const p2 = { x: cx + (rOuter * Math.cos(eA * Math.PI / 180)), y: cy + (rOuter * Math.sin(eA * Math.PI / 180)) };
  const p3 = { x: cx + (rInner * Math.cos(eA * Math.PI / 180)), y: cy + (rInner * Math.sin(eA * Math.PI / 180)) };
  const p4 = { x: cx + (rInner * Math.cos(sA * Math.PI / 180)), y: cy + (rInner * Math.sin(sA * Math.PI / 180)) };
  
  return `M ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${angleStep > 180 ? 1 : 0} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rInner} ${rInner} 0 ${angleStep > 180 ? 1 : 0} 0 ${p4.x} ${p4.y} Z`;
};