import React from 'react';


interface ToggleSwitchProps {
  label: string;
  isChecked: boolean;
  onChange: () => void;
  icon?: React.ReactNode;
  description?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  isChecked,
  onChange,
  icon,
  description
}) => {
  return (
    <div className="space-y-1">
      <label className="cursor-pointer label justify-between">
        <div className="flex items-center gap-2">
          {icon && <span>{icon}</span>}
          <span className="label-text">{label}</span>
        </div>
        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={isChecked}
          onChange={onChange}
        />
      </label>
      {description && (
        <p className="text-xs opacity-70 ml-7">{description}</p>
      )}
    </div>
  );
};
