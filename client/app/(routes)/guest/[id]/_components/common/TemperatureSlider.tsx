import React from 'react';
import { Thermometer } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';

interface TemperatureSliderProps {
  value: number;
  onChange: (_value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export const TemperatureSlider: React.FC<TemperatureSliderProps> = ({
  value,
  onChange,
  min = 16,
  max = 30,
  step = 1,
  unit = '°C'
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm opacity-70">Temperature</label>
      <div className="flex items-center gap-4">
        <Thermometer className="h-5 w-5" />
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={onChange}
        >
          <Slider.Track className="bg-base-300 relative grow rounded-full h-2">
            <Slider.Range className="absolute bg-primary rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-5 h-5 bg-primary rounded-full focus:outline-none" />
        </Slider.Root>
        <span className="text-sm">{value}{unit}</span>
      </div>
    </div>
  );
};
