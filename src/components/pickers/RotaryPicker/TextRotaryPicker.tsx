import React, { useRef, useEffect, useState } from 'react';

interface TextRotaryPickerProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  color?: string;
}

const TextRotaryPicker: React.FC<TextRotaryPickerProps> = ({ value, options, onChange, color = "text-slate-900" }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemHeight = 24;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      const index = options.indexOf(value);
      if (index !== -1) {
        scrollRef.current.scrollTop = index * itemHeight;
      }
      setTimeout(() => setIsReady(true), 50);
    }
  }, [options]);

  useEffect(() => {
    if (scrollRef.current && isReady) {
      const index = options.indexOf(value);
      if (index !== -1) {
        const targetScroll = index * itemHeight;
        if (Math.abs(scrollRef.current.scrollTop - targetScroll) > 1) {
          scrollRef.current.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [value, options, isReady]);

  const handleScroll = () => {
    if (scrollRef.current && isReady) {
      const scrollTop = scrollRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      const newVal = options[index];
      if (newVal !== undefined && newVal !== value) {
        onChange(newVal);
      }
    }
  };

  const getStatusColor = (val: string) => {
    if (val === "POSS" || val.includes("V")) return "text-blue-400";
    if (val === "CONF" || val.includes("G")) return "text-emerald-400";
    if (val === "NOT" || val.includes("R")) return "text-red-400";
    if (val.includes("ALL")) return "text-amber-400";
    return color;
  };

  return (
    <div className="relative h-[24px] w-full">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-auto no-scrollbar snap-y snap-mandatory cursor-ns-resize"
        style={{ scrollbarWidth: 'none' }}
      >
        {options.map((opt) => (
          <div 
            key={opt} 
            className={`h-[24px] flex items-center justify-center snap-center text-[8px] font-black transition-all duration-200 ${
              opt === value 
                ? `${getStatusColor(opt)} opacity-100 scale-110` 
                : 'text-slate-400 opacity-20 scale-90'
            }`}
          >
            {opt}
          </div>
        ))}
        <div className="h-[2px]" />
      </div>
    </div>
  );
};

export default TextRotaryPicker;