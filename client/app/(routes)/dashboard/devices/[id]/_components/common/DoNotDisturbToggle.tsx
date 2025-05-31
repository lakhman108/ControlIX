import React from 'react';
import { Moon, Eye } from 'lucide-react';

interface DoNotDisturbToggleProps {
  isEnabled: boolean;
  onToggle: () => void;
  className?: string;
}

export const DoNotDisturbToggle: React.FC<DoNotDisturbToggleProps> = ({
  isEnabled,
  onToggle,
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl bg-base-100 border border-base-300 ${className}`}>
      <div className="flex items-center gap-3">
        <div className={`
          p-2 rounded-lg transition-all duration-300
          ${isEnabled
            ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
            : 'bg-base-200 text-base-content/60'
          }
        `}>
          {isEnabled ? <Moon className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </div>

        <div>
          <div className="text-sm font-medium text-base-content">
            Do Not Disturb
          </div>
          <div className="text-xs text-base-content/60">
            {isEnabled ? 'Light notifications disabled' : 'Normal operation'}
          </div>
        </div>
      </div>

      <button
        onClick={onToggle}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300
          ${isEnabled ? 'bg-primary' : 'bg-base-300'}
        `}
      >
        <span className="sr-only">Enable do not disturb</span>
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300
            ${isEnabled ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};
