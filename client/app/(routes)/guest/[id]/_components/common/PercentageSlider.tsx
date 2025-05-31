import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { PercentIcon } from 'lucide-react';

interface PercentageSliderProps {
  value: number;
  onChange: (_value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

export const PercentageSlider: React.FC<PercentageSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label = 'Position'
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <PercentIcon className="h-4 w-4" />
        <label className="text-sm opacity-70">{label}</label>
      </div>
      <div className="flex items-center gap-4">
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
        <span className="text-sm min-w-[40px] text-right">{value}%</span>
      </div>
    </div>
  );
};
