import React from 'react';

interface ModeSelectorProps {
  label: string;
  options: string[];
  currentMode: string;
  onChange: (_mode: string) => void;
  formatOption?: (_option: string) => string;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  label,
  options,
  currentMode,
  onChange,
  formatOption = (option) => option.charAt(0).toUpperCase() + option.slice(1)
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm opacity-70">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option}
            className={`btn btn-sm ${currentMode === option ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onChange(option)}
          >
            {formatOption(option)}
          </button>
        ))}
      </div>
    </div>
  );
};
