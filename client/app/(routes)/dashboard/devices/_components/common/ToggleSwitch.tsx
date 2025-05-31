import React from "react";

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  activeColor?: string;
  label: string;
  disabled?: boolean;
}

export const ToggleSwitch = ({
  isOn,
  onToggle,
  activeColor = "bg-gradient-to-r from-green-500 to-emerald-500",
  label,
  disabled = false,
}: ToggleSwitchProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-base-content/70">{label}</span>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
          isOn ? activeColor : "bg-base-300"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div
          className={`absolute top-1 w-6 h-6 bg-base-100 rounded-full shadow-lg transition-transform duration-300 ${
            isOn ? "translate-x-9" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};
