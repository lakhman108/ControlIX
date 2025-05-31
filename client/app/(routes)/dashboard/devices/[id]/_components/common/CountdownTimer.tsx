import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, Square } from 'lucide-react';

interface CountdownTimerProps {
  countdown: number; // seconds
  onCountdownChange: (seconds: number) => void;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  countdown,
  onCountdownChange,
  className = ""
}) => {
  const [timeInput, setTimeInput] = useState({
    hours: Math.floor(countdown / 3600),
    minutes: Math.floor((countdown % 3600) / 60)
  });
  const [isActive, setIsActive] = useState(countdown > 0);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const presetTimes = [
    { label: '15m', seconds: 15 * 60 },
    { label: '30m', seconds: 30 * 60 },
    { label: '1h', seconds: 60 * 60 },
    { label: '2h', seconds: 2 * 60 * 60 },
  ];

  const handleStart = () => {
    const totalSeconds = timeInput.hours * 3600 + timeInput.minutes * 60;
    if (totalSeconds > 0) {
      onCountdownChange(totalSeconds);
      setIsActive(true);
    }
  };

  const handleStop = () => {
    onCountdownChange(0);
    setIsActive(false);
  };

  const handlePresetClick = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    setTimeInput({ hours, minutes });
  };

  const handleInputChange = (field: 'hours' | 'minutes', value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    if (field === 'hours') {
      setTimeInput(prev => ({ ...prev, hours: Math.min(24, numValue) }));
    } else {
      setTimeInput(prev => ({ ...prev, minutes: Math.min(59, numValue) }));
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-base-content/70" />
        <span className="text-sm font-medium text-base-content">Timer</span>
      </div>

      {/* Current Countdown Display */}
      {countdown > 0 && (
        <div className="bg-primary/10 rounded-lg p-3 text-center">
          <div className="text-lg font-mono text-primary">
            {formatTime(countdown)}
          </div>
          <div className="text-xs text-base-content/60 mt-1">
            Remaining time
          </div>
        </div>
      )}

      {/* Time Input */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-xs text-base-content/70">Hours</label>
            <input
              type="number"
              min="0"
              max="24"
              value={timeInput.hours}
              onChange={(e) => handleInputChange('hours', e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-base-200 border border-base-300 rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-base-content/70">Minutes</label>
            <input
              type="number"
              min="0"
              max="59"
              value={timeInput.minutes}
              onChange={(e) => handleInputChange('minutes', e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-base-200 border border-base-300 rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleStart}
            disabled={timeInput.hours === 0 && timeInput.minutes === 0}
            className="flex-1 btn btn-primary btn-sm"
          >
            <Play className="h-3 w-3 mr-1" />
            Start
          </button>
          <button
            onClick={handleStop}
            disabled={countdown === 0}
            className="flex-1 btn btn-error btn-sm"
          >
            <Square className="h-3 w-3 mr-1" />
            Stop
          </button>
        </div>
      </div>

      {/* Preset Times */}
      <div className="space-y-2">
        <label className="text-xs text-base-content/70">Quick Set</label>
        <div className="grid grid-cols-2 gap-2">
          {presetTimes.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetClick(preset.seconds)}
              className="btn btn-outline btn-sm"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
