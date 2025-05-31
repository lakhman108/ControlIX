import React, { useState, useEffect } from 'react';
import { ParsedTuyaBulb, LightColor } from '../types';
import {
  Lightbulb,
  Power,
  Palette,
  Thermometer,
  Music,
  Moon,
  Clock,
  Settings,
  Wifi,
  Battery,
  Eye,
  Sparkles,
  Sun
} from 'lucide-react';
import { controlDevice } from '@/app/_lib/backendApi';

interface BulbControlsProps {
  deviceId:string,
  bulbData: ParsedTuyaBulb;
  onBulbUpdate: (updates: Partial<ParsedTuyaBulb>) => void;
  className?: string;
}

export const BulbControls: React.FC<BulbControlsProps> = ({
  deviceId,
  bulbData,
  onBulbUpdate,
  className = ""
}) => {
  const [localBulbData, setLocalBulbData] = useState<ParsedTuyaBulb>(bulbData);
  const [selectedMode, setSelectedMode] = useState(bulbData.work_mode);

  // Sync with parent data
  useEffect(() => {
    setLocalBulbData(bulbData);
    setSelectedMode(bulbData.work_mode);
  }, [bulbData]);

  const updateBulb = (updates: Partial<ParsedTuyaBulb>) => {
    const newData = { ...localBulbData, ...updates };
    setLocalBulbData(newData);
    onBulbUpdate(updates);
  };

  const togglePower =async () => {

   const rs=await controlDevice(deviceId,{ code: 'switch_led', value: !localBulbData.switch_led  });
   console.log(rs);
    updateBulb({ switch_led: !localBulbData.switch_led });

  };

  const updateBrightness = (value: number) => {
    updateBulb({ bright_value_v2: value });
  };

  const updateTemperature = (value: number) => {
    updateBulb({ temp_value_v2: value });
  };

  const updateColor = (h: number, s: number) => {
    updateBulb({
      colour_data_v2: { ...localBulbData.colour_data_v2, h, s }
    });
  };

  const setWorkMode = (mode: string) => {
    setSelectedMode(mode);
    updateBulb({ work_mode: mode });
  };

  const toggleDoNotDisturb = () => {
    updateBulb({ do_not_disturb: !localBulbData.do_not_disturb });
  };

  // Utility functions
  const brightnessPercent = Math.round((localBulbData.bright_value_v2 / 1000) * 100);
  const temperatureK = localBulbData.temp_value_v2;
  const hslColor = `hsl(${localBulbData.colour_data_v2.h}, ${Math.round((localBulbData.colour_data_v2.s / 1000) * 100)}%, 50%)`;

  const presetScenes = [
    { name: "Warm White", icon: Sun, temp: 3000, brightness: 800, color: "#FFD700" },
    { name: "Cool White", icon: Eye, temp: 6500, brightness: 700, color: "#E6F3FF" },
    { name: "Reading", icon: Settings, temp: 4000, brightness: 900, color: "#FFF8DC" },
    { name: "Relax", icon: Moon, temp: 2700, brightness: 400, color: "#FF6B35" },
  ];







  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Control Panel */}
        <div className="lg:col-span-2 space-y-8">
          {/* Power and Status */}
          <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-base-content">Device Control</h2>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                localBulbData.switch_led
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {localBulbData.switch_led ? 'Online' : 'Offline'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Power Toggle */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-base-content/70">Power</span>
                  <button
                    onClick={togglePower}
                    className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                      localBulbData.switch_led
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-base-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-base-100 rounded-full shadow-lg transition-transform duration-300 ${
                      localBulbData.switch_led ? 'translate-x-9' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-base-content/70">Do Not Disturb</span>
                  <button
                    onClick={toggleDoNotDisturb}
                    className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                      localBulbData.do_not_disturb
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                        : 'bg-base-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-base-100 rounded-full shadow-lg transition-transform duration-300 ${
                      localBulbData.do_not_disturb ? 'translate-x-9' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Status Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-base-content/70">Current Mode</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium capitalize">
                    {localBulbData.work_mode}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-base-content/70">Brightness</span>
                  <span className="text-base-content font-semibold">{brightnessPercent}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6 text-base-content">Light Modes</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { mode: 'white', icon: Sun, label: 'White', color: 'from-yellow-400 to-orange-500' },
                { mode: 'colour', icon: Palette, label: 'Color', color: 'from-purple-400 to-pink-500' },
                { mode: 'scene', icon: Sparkles, label: 'Scene', color: 'from-green-400 to-blue-500' },
                { mode: 'music', icon: Music, label: 'Music', color: 'from-red-400 to-purple-500' },
              ].map(({ mode, icon: Icon, label, color }) => (
                <button
                  key={mode}
                  onClick={() => setWorkMode(mode)}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    selectedMode === mode
                      ? `bg-gradient-to-r ${color} border-transparent text-white shadow-lg`
                      : 'bg-base-200 border-base-300 text-base-content/70 hover:bg-base-300 hover:border-base-400'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">{label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Controls based on mode */}
          {selectedMode === 'white' && (
            <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6 text-base-content">White Light Controls</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base-content/70">Brightness</span>
                    <span className="text-base-content font-semibold">{brightnessPercent}%</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={localBulbData.bright_value_v2}
                      onChange={(e) => updateBrightness(Number(e.target.value))}
                      className="w-full h-2 bg-base-300 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base-content/70">Color Temperature</span>
                    <span className="text-base-content font-semibold">{temperatureK}K</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="2700"
                      max="6500"
                      value={localBulbData.temp_value_v2}
                      onChange={(e) => updateTemperature(Number(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-orange-400 to-blue-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedMode === 'colour' && (
            <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6 text-base-content">Color Controls</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base-content/70">Brightness</span>
                    <span className="text-base-content font-semibold">{brightnessPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={localBulbData.bright_value_v2}
                    onChange={(e) => updateBrightness(Number(e.target.value))}
                    className="w-full h-2 bg-base-300 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base-content/70">Hue</span>
                    <div
                      className="w-6 h-6 rounded-full border-2 border-base-content shadow-lg"
                      style={{ backgroundColor: hslColor }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={localBulbData.colour_data_v2.h}
                    onChange={(e) => updateColor(Number(e.target.value), localBulbData.colour_data_v2.s)}
                    className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base-content/70">Saturation</span>
                    <span className="text-base-content font-semibold">{Math.round((localBulbData.colour_data_v2.s / 1000) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={localBulbData.colour_data_v2.s}
                    onChange={(e) => updateColor(localBulbData.colour_data_v2.h, Number(e.target.value))}
                    className="w-full h-2 bg-base-300 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMode === 'scene' && (
            <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6 text-base-content">Scene Controls</h2>
              <div className="space-y-4">
                <div className="text-base-content/70">
                  Scene Mode Active - Dynamic lighting effects
                </div>
                <div className="bg-base-200 rounded-lg p-4">
                  <div className="text-sm text-base-content/60">Active Scenes</div>
                  <div className="text-lg font-semibold text-base-content">
                    {localBulbData.scene_data_v2.scene_num} scene(s) loaded
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedMode === 'music' && (
            <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6 text-base-content">Music Sync</h2>
              <div className="space-y-4">
                <div className="text-base-content/70">
                  Music synchronization mode is active. The light will respond to audio input.
                </div>
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-500/30">
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm font-medium text-green-400">
                      Listening for music
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Quick Scenes */}
          <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-base-content">Quick Scenes</h2>
            <div className="space-y-3">
              {presetScenes.map((scene, index) => {
                const Icon = scene.icon;
                return (
                  <button
                    key={index}
                    className="w-full p-3 bg-base-200 hover:bg-base-300 border border-base-300 hover:border-base-400 rounded-xl transition-all duration-200 flex items-center space-x-3"
                    onClick={() => {
                      updateTemperature(scene.temp);
                      updateBrightness(scene.brightness);
                      setWorkMode('white');
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: scene.color + '30', border: `1px solid ${scene.color}60` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: scene.color }} />
                    </div>
                    <span className="text-base-content font-medium">{scene.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Device Info */}
          <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-base-content">Device Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-base-content/60">Model</span>
                <span className="text-base-content">UNYD Smart Bulb</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Firmware</span>
                <span className="text-base-content">v2.1.4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Connection</span>
                <span className="text-green-400">WiFi Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Power Usage</span>
                <span className="text-base-content">9.2W</span>
              </div>
              {localBulbData.countdown_1 > 0 && (
                <div className="flex justify-between">
                  <span className="text-base-content/60">Timer</span>
                  <span className="text-base-content">
                    {Math.floor(localBulbData.countdown_1 / 60)}m {localBulbData.countdown_1 % 60}s
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Scene Data Preview */}
          {localBulbData.scene_data_v2.scene_num > 0 && (
            <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-base-content">Active Scenes</h2>
              <div className="space-y-2">
                {localBulbData.scene_data_v2.scene_units.slice(0, 3).map((scene, index) => (
                  <div key={index} className="bg-base-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base-content/70 text-sm">Scene {index + 1}</span>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full border border-base-300"
                          style={{
                            backgroundColor: `hsl(${scene.h}, ${Math.round((scene.s / 1000) * 100)}%, 50%)`
                          }}
                        />
                        <span className="text-base-content/60 text-xs">{Math.round((scene.bright / 1000) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
      `}</style>
    </div>
  );
};
