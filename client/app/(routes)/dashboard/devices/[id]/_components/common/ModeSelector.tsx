import React from 'react';
import { Lightbulb, Palette, Sparkles, Music } from 'lucide-react';

type WorkMode = "white" | "colour" | "scene" | "music";

interface ModeSelectorProps {
  currentMode: WorkMode;
  onModeChange: (mode: WorkMode) => void;
  className?: string;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onModeChange,
  className = ""
}) => {
  const modes = [
    {
      key: "white" as WorkMode,
      label: "White",
      icon: Lightbulb,
      description: "Pure white light",
      gradient: "from-gray-100 to-gray-200"
    },
    {
      key: "colour" as WorkMode,
      label: "Color",
      icon: Palette,
      description: "RGB color control",
      gradient: "from-pink-500 to-violet-500"
    },
    {
      key: "scene" as WorkMode,
      label: "Scene",
      icon: Sparkles,
      description: "Preset scenes",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      key: "music" as WorkMode,
      label: "Music",
      icon: Music,
      description: "Music sync",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium text-base-content">Light Mode</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {modes.map((mode) => {
          const isSelected = currentMode === mode.key;
          const Icon = mode.icon;

          return (
            <button
              key={mode.key}
              onClick={() => onModeChange(mode.key)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300
                ${isSelected
                  ? 'border-primary bg-primary/10 shadow-lg'
                  : 'border-base-300 bg-base-100 hover:border-primary/50 hover:bg-base-200'
                }
              `}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`
                  p-3 rounded-lg bg-gradient-to-br ${mode.gradient}
                  ${isSelected ? 'shadow-md' : 'opacity-80'}
                  transition-all duration-300
                `}>
                  <Icon className="h-5 w-5 text-white" />
                </div>

                <div className="text-center">
                  <div className={`
                    text-sm font-medium
                    ${isSelected ? 'text-primary' : 'text-base-content'}
                  `}>
                    {mode.label}
                  </div>
                  <div className="text-xs text-base-content/60 mt-1">
                    {mode.description}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
