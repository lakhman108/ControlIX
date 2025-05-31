import React from 'react';
import { Sparkles } from 'lucide-react';

interface SceneOption {
  id: string;
  name: string;
  color?: string;
}

interface SceneSelectorProps {
  scenes: SceneOption[];
  currentScene: string;
  onChange: (_sceneId: string) => void;
  label?: string;
}

export const SceneSelector: React.FC<SceneSelectorProps> = ({
  scenes,
  currentScene,
  onChange,
  label = 'Scenes'
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4" />
        <label className="text-sm opacity-70">{label}</label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {scenes.map(scene => (
          <button
            key={scene.id}
            className={`card bg-base-100 shadow-md hover:shadow-lg transition-all ${
              currentScene === scene.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onChange(scene.id)}
            aria-label={`Select ${scene.name} scene`}
          >
            <div className="card-body p-3 items-center">
              <div
                className="w-8 h-8 rounded-full mb-1"
                style={{ background: scene.color || 'var(--primary)' }}
              ></div>
              <span className="text-xs text-center">{scene.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
