import React from 'react';
import { Sun } from 'lucide-react';

interface BrightnessSliderProps {
  value: number; // 10-1000
  onChange: (value: number) => void;
  className?: string;
}

export const BrightnessSlider: React.FC<BrightnessSliderProps> = ({
  value,
  onChange,
  className = ""
}) => {
  const percentage = ((value - 10) / (1000 - 10)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    onChange(newValue);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4 text-base-content/70" />
          <span className="text-sm font-medium text-base-content">Brightness</span>
        </div>
        <span className="text-sm text-base-content/70">{Math.round(percentage)}%</span>
      </div>

      <div className="relative">
        <input
          type="range"
          min="10"
          max="1000"
          value={value}
          onChange={handleChange}
          className="
            w-full h-2 bg-base-300 rounded-lg appearance-none cursor-pointer
            slider-thumb:appearance-none slider-thumb:h-4 slider-thumb:w-4
            slider-thumb:rounded-full slider-thumb:bg-primary slider-thumb:cursor-pointer
            slider-thumb:shadow-lg slider-thumb:transition-all slider-thumb:duration-200
            hover:slider-thumb:scale-110
          "
          style={{
            background: `linear-gradient(to right,
              rgb(var(--p)) 0%,
              rgb(var(--p)) ${percentage}%,
              rgb(var(--b3)) ${percentage}%,
              rgb(var(--b3)) 100%)`
          }}
        />
      </div>
    </div>
  );
};
