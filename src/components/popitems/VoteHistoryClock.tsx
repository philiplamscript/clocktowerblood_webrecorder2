{showAxis && <g className="pointer-events-none opacity-40">
          {Array.from({ length: ringCount + 1 }).map((_, i) => <circle key={i} cx={cx} cy={cy} r={innerRadius + i * ringWidth} fill="none" stroke="#cbd5e1" strokeWidth="0.75" strokeDasharray="2,2" />)}
          {Array.from({ length: playerCount }).map((_, i) => {
            const angle = (i * (360 / playerCount)) - 90;
            const x2 = cx + outerRadius * Math.cos(angle * Math.PI / 180);
            const y2 = cy + outerRadius * Math.sin(angle * Math.PI / 180);
            return <line key={`radial-${i}`} x1={cx} y1={cy} x2={x2} y2={y2} stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="1,1" />;
          })}
        </g>}