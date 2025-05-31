import React from 'react';
import { Power } from 'lucide-react';

interface PowerButtonProps {
  isOn: boolean;
  onToggle: () => void;
  className?: string;
}

export const PowerButton: React.FC<PowerButtonProps> = ({
  isOn,
  onToggle,
  className = ''
}) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-lg">Power</span>
      <button
        className={`btn ${!isOn ? "btn-error" : "btn-success"} btn-circle ${className}`}
        onClick={onToggle}
      >
        <Power className="h-5 w-5" />
      </button>
    </div>
  );
};
