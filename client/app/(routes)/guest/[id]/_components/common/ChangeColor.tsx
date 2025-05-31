import React, { useEffect, useState } from 'react';
import { HexColorPicker } from "react-colorful";

interface ChangeColorProps {
  color: string;
  onChange: (_color: string) => void;
}

export const ChangeColor: React.FC<ChangeColorProps> = ({
  color,
  onChange
}) => {
  const [colorcode, setColor] = useState(color || "#FFFFFF");
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Update parent component when color changes
  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onChange(newColor);
  };

  // Update local state if prop changes
  useEffect(() => {
    if (color !== colorcode) {
      setColor(color);
    }
  }, [color]);

  return (
    <div className="space-y-3 w-full">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium opacity-70">Color</label>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-sm btn-circle"
            style={{ backgroundColor: colorcode, borderColor: 'rgba(0,0,0,0.2)' }}
            onClick={() => setIsPickerOpen(!isPickerOpen)}
            aria-label="Toggle color picker"
          />
          <span className="badge badge-neutral font-mono text-xs">{colorcode}</span>
        </div>
      </div>

      {isPickerOpen && (
        <div className="card bg-base-100 shadow-lg p-4 w-full max-w-xs mx-auto">
          <div className="card-body p-0">
            <HexColorPicker
              color={colorcode}
              onChange={handleColorChange}
              className="mx-auto"
              style={{ width: '100%', maxWidth: '220px' }}
            />

            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33F3", "#33FFF3"].map(presetColor => (
                <button
                  key={presetColor}
                  className="w-6 h-6 rounded-full border hover:scale-110 transition-transform"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => handleColorChange(presetColor)}
                  aria-label={`Select color ${presetColor}`}
                />
              ))}
            </div>

            <button
              className="btn btn-sm btn-ghost mt-3"
              onClick={() => setIsPickerOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
