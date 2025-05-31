import React from 'react';
import { Clock } from 'lucide-react';

interface CountdownSelectorProps {
  label?: string;
  options: string[];
  currentValue: string;
  onChange: (_value: string) => void;
  formatOption?: (_option: string) => string;
}

export const CountdownSelector: React.FC<CountdownSelectorProps> = ({
  label = 'Timer',
  options,
  currentValue,
  onChange,
  formatOption = (option) => option
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <label className="text-sm opacity-70">{label}</label>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {options.map(option => (
          <button
            key={option}
            className={`btn btn-sm ${currentValue === option ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onChange(option)}
          >
            {formatOption(option)}
          </button>
        ))}
      </div>
    </div>
  );
};
