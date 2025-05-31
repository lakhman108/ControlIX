import React from 'react';
import { Palette } from 'lucide-react';

interface LightColor {
  h: number; // Hue (0-360)
  s: number; // Saturation (0-1000)
  v: number; // Value/Brightness (0-1000)
}

interface ColorPickerProps {
  color: LightColor;
  onChange: (color: LightColor) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  className = ""
}) => {
  const hslColor = `hsl(${color.h}, ${(color.s / 1000) * 100}%, ${(color.v / 1000) * 50 + 25}%)`;

  const presetColors = [
    { h: 0, s: 1000, v: 750, name: 'Red' },
    { h: 30, s: 1000, v: 750, name: 'Orange' },
    { h: 60, s: 1000, v: 750, name: 'Yellow' },
    { h: 120, s: 1000, v: 750, name: 'Green' },
    { h: 180, s: 1000, v: 750, name: 'Cyan' },
    { h: 240, s: 1000, v: 750, name: 'Blue' },
    { h: 270, s: 1000, v: 750, name: 'Purple' },
    { h: 300, s: 1000, v: 750, name: 'Magenta' },
  ];

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...color, h: parseInt(e.target.value) });
  };

  const handleSaturationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...color, s: parseInt(e.target.value) });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...color, v: parseInt(e.target.value) });
  };

  const handlePresetClick = (presetColor: LightColor) => {
    onChange(presetColor);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Palette className="h-4 w-4 text-base-content/70" />
        <span className="text-sm font-medium text-base-content">Color</span>
      </div>

      {/* Current Color Display */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-lg border-2 border-base-300 shadow-inner"
          style={{ backgroundColor: hslColor }}
        />
        <div className="flex-1 space-y-1">
          <div className="text-xs text-base-content/60">
            H: {color.h}° S: {Math.round((color.s / 1000) * 100)}% V: {Math.round((color.v / 1000) * 100)}%
          </div>
        </div>
      </div>

      {/* Hue Slider */}
      <div className="space-y-2">
        <label className="text-xs text-base-content/70">Hue</label>
        <input
          type="range"
          min="0"
          max="360"
          value={color.h}
          onChange={handleHueChange}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
          }}
        />
      </div>

      {/* Saturation Slider */}
      <div className="space-y-2">
        <label className="text-xs text-base-content/70">Saturation</label>
        <input
          type="range"
          min="0"
          max="1000"
          value={color.s}
          onChange={handleSaturationChange}
          className="w-full h-2 bg-base-300 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Value/Brightness Slider */}
      <div className="space-y-2">
        <label className="text-xs text-base-content/70">Brightness</label>
        <input
          type="range"
          min="0"
          max="1000"
          value={color.v}
          onChange={handleValueChange}
          className="w-full h-2 bg-base-300 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Preset Colors */}
      <div className="space-y-2">
        <label className="text-xs text-base-content/70">Presets</label>
        <div className="grid grid-cols-4 gap-2">
          {presetColors.map((preset, index) => (
            <button
              key={index}
              onClick={() => handlePresetClick(preset)}
              className="w-8 h-8 rounded-lg border-2 border-base-300 hover:border-primary transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: `hsl(${preset.h}, ${(preset.s / 1000) * 100}%, ${(preset.v / 1000) * 50 + 25}%)`
              }}
              title={preset.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
