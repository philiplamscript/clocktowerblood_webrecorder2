const drawArrow = (from: number, to: number, day: number, type: 'to' | 'from' | 'self', width = 2) => {
    const color = type === 'to' ? '#ef4444' : type === 'from' ? '#22c55e' : '#a855f7';
    const radius = innerRadius + (day - 0.5) * ringWidth;

    if (type === 'self') {
      const pos = getPosition(from, radius);
      const dx = pos.x - cx;
      const dy = pos.y - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      
      // Arrow from center to player
      const startX = cx;
      const startY = cy;
      const endX = pos.x - (15 * Math.cos(angle)); // Stop short of the slice edge
      const endY = pos.y - (15 * Math.sin(angle));
      
      // Arrowhead at the player end
      const headLength = 8;
      const headX = endX;
      const headY = endY;
      const leftX = headX - headLength * Math.cos(angle - Math.PI / 6);
      const leftY = headY - headLength * Math.sin(angle - Math.PI / 6);
      const rightX = headX - headLength * Math.cos(angle + Math.PI / 6);
      const rightY = headY - headLength * Math.sin(angle + Math.PI / 6);

      return (
        <g key={`self-${from}-${day}`}>
          <line x1={startX} y1={startY} x2={endX} y2={endY} stroke={color} strokeWidth={width} strokeLinecap="round" opacity="0.6" />
          <polygon points={`${headX},${headY} ${leftX},${leftY} ${rightX},${rightY}`} fill={color} opacity="0.6" />
        </g>
      );
    }

    const fromPos = getPosition(from, radius);
    const toPos = getPosition(to, radius);
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 5) return null;

    const angle = Math.atan2(dy, dx);
    const headLength = 8;
    const headX = toPos.x - 4 * Math.cos(angle);
    const headY = toPos.y - 4 * Math.sin(angle);
    
    const leftX = headX - headLength * Math.cos(angle - Math.PI / 6);
    const leftY = headY - headLength * Math.sin(angle - Math.PI / 6);
    const rightX = headX - headLength * Math.cos(angle + Math.PI / 6);
    const rightY = headY - headLength * Math.sin(angle + Math.PI / 6);

    return (
      <g key={`${from}-${to}-${day}-${type}`}>
        <line x1={fromPos.x} y1={fromPos.y} x2={headX} y2={headY} stroke={color} strokeWidth={width} strokeLinecap="round" opacity="0.6" />
        <polygon points={`${headX},${headY} ${leftX},${leftY} ${rightX},${rightY}`} fill={color} opacity="0.6" />
      </g>
    );
  };