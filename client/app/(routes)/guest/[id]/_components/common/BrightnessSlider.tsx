import React from 'react';
import * as Slider from '@radix-ui/react-slider';

interface BrightnessSliderProps {
  value: number;
  onChange: (_value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

export const BrightnessSlider: React.FC<BrightnessSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label = 'Brightness'
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm opacity-70">{label}</label>
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
      <div className="text-right text-sm">{value}%</div>
    </div>
  );
};
