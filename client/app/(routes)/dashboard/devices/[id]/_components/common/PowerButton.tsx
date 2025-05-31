import React from 'react';
import { Power } from 'lucide-react';

interface PowerButtonProps {
  isOn: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PowerButton: React.FC<PowerButtonProps> = ({
  isOn,
  onToggle,
  size = 'lg',
  className = ""
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-lg font-medium text-base-content">Power</span>
      <button
        onClick={onToggle}
        className={`
          btn btn-circle transition-all duration-300
          ${isOn
            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-transparent text-white shadow-lg'
            : 'bg-base-300 hover:bg-base-400 border-base-400 text-base-content'
          }
          ${sizeClasses[size]} ${className}
        `}
      >
        <Power className={iconSizes[size]} />
      </button>
    </div>
  );
};
