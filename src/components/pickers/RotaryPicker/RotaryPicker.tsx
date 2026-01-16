import React, { useRef, useEffect, useState } from 'react';

interface RotaryPickerProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
  color?: string;
}

const RotaryPicker: React.FC<RotaryPickerProps> = ({ value, min = 0, max = 20, onChange, color = "text-white" }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemHeight = 24; 
  const [isReady, setIsReady] = useState(false);

  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  // Initial scroll position
  useEffect(() => {
    if (scrollRef.current) {
      const index = value - min;
      scrollRef.current.scrollTop = index * itemHeight;
      // Small delay to prevent initial "jump" animation if any
      setTimeout(() => setIsReady(true), 50);
    }
  }, [min]); // Only re-run if range changes

  // Sync scroll when value changes externally
  useEffect(() => {
    if (scrollRef.current && isReady) {
      const index = value - min;
      const targetScroll = index * itemHeight;
      if (Math.abs(scrollRef.current.scrollTop - targetScroll) > 1) {
        scrollRef.current.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }
    }
  }, [value, min, isReady]);

  const handleScroll = () => {
    if (scrollRef.current && isReady) {
      const scrollTop = scrollRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      const newVal = numbers[index];
      if (newVal !== undefined && newVal !== value) {
        onChange(newVal);
      }
    }
  };

  return (
    <div className="relative h-[24px] w-full group">
      {/* Visual center indicator/fade */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
      
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-auto no-scrollbar snap-y snap-mandatory cursor-ns-resize"
        style={{ scrollbarWidth: 'none' }}
      >
        {numbers.map((num) => (
          <div 
            key={num} 
            className={`h-[24px] flex items-center justify-center snap-center text-[11px] font-black transition-all duration-200 ${
              num === value 
                ? `${color} opacity-100 scale-110` 
                : 'text-slate-500 opacity-20 scale-90'
            }`}
          >
            {num}
          </div>
        ))}
        {/* Buffer area to ensure the last item can always be centered perfectly */}
        <div className="h-[2px]" />
      </div>
    </div>
  );
};

export default RotaryPicker;