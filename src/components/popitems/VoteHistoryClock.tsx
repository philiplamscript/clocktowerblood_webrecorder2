{Array.from({ length: ringCount }).map((_, i) => {
            const day = i + 1;
            const radius = innerRadius + (i + 0.5) * ringWidth;
            const x = cx + radius * Math.cos(Math.PI); // Left position
            const y = cy + radius * Math.sin(Math.PI);
            return (
              <text key={`day-${day}`} x={x} y={y} textAnchor="middle" alignmentBaseline="middle" className="text-[8px] font-black fill-slate-500">
                D{day}
              </text>
            );
          })}