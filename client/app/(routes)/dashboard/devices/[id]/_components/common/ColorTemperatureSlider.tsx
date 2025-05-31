import React from 'react';
import { Thermometer } from 'lucide-react';

interface ColorTemperatureSliderProps {
  value: number; // 0-1000 (color temperature)
  onChange: (value: number) => void;
  className?: string;
}

export const ColorTemperatureSlider: React.FC<ColorTemperatureSliderProps> = ({
  value,
  onChange,
  className = ""
}) => {
  const percentage = (value / 1000) * 100;

  // Convert to Kelvin for display (rough approximation)
  const kelvin = Math.round(2700 + (value / 1000) * (6500 - 2700));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    onChange(newValue);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-base-content/70" />
          <span className="text-sm font-medium text-base-content">Color Temperature</span>
        </div>
        <span className="text-sm text-base-content/70">{kelvin}K</span>
      </div>

      <div className="relative">
        <input
          type="range"
          min="0"
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
              #ff9500 0%,
              #ffb946 25%,
              #fff0d6 50%,
              #e6f3ff 75%,
              #87ceeb 100%)`
          }}
        />
        <div
          className="absolute top-0 h-2 bg-primary/20 rounded-lg pointer-events-none"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
