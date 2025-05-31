import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Moon, Book } from 'lucide-react';
import { ControlCard } from '../common/ControlCard';
import { PowerButton } from '../common/PowerButton';
import { BrightnessSlider } from '../common/BrightnessSlider';
import { ModeSelector } from '../common/ModeSelector';
import { ChangeColor } from '../common/ChangeColor';
import { TemperatureSlider } from '../common/TemperatureSlider';
import { CountdownSelector } from '../common/CountdownSelector';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { SceneSelector } from '../common/SceneSelector';
import { LightDevice } from '@/app/_types/device';
import { updateLightDevice } from '@/app/_lib/slices/deviceSlice';

interface BulbControlsProps {
  device: LightDevice;
  onChange: (_device: LightDevice) => void;
  togglePower: () => void;
}

// Sample scene data
const SCENE_OPTIONS = [
  { id: '1', name: 'Reading', color: '#FFF5E0' },
  { id: '2', name: 'Relaxing', color: '#E0F5FF' },
  { id: '3', name: 'Working', color: '#F5FFE0' },
  { id: '4', name: 'Party', color: '#FFE0F5' },
  { id: '5', name: 'Romantic', color: '#FFE0E0' }
];

// Countdown options
const COUNTDOWN_OPTIONS = ['cancel', '1h', '2h', '3h', '4h'];

export const BulbControls: React.FC<BulbControlsProps> = ({
  device,
  onChange,
  togglePower
}) => {
  const dispatch = useDispatch();
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Update brightness with appropriate scaling based on the device spec
  const updateBrightness = (value: number[]) => {
    const updatedDevice = {
      ...device,
      brightness: value[0],
      // If we have a v2 brightness, scale it proportionally
      brightnessV2: value[0] * 4 // Scale to match the v2 range (10-1000)
    };
    onChange(updatedDevice);
    dispatch(updateLightDevice(updatedDevice));
  };

  // Update work mode
  const updateWorkMode = (mode: string) => {
    const updatedDevice = { ...device, workMode: mode as LightDevice['workMode'] };
    onChange(updatedDevice);
    dispatch(updateLightDevice(updatedDevice));
  };

  // Update color
  const updateColor = (color: string) => {
    const updatedDevice = { ...device, colorCode: color };
    onChange(updatedDevice);
    dispatch(updateLightDevice(updatedDevice));
  };

  // Update scene
  const updateScene = (sceneId: string) => {
    const updatedDevice = { ...device, sceneSelect: sceneId as LightDevice['sceneSelect'] };
    onChange(updatedDevice);
    dispatch(updateLightDevice(updatedDevice));
  };

  // Update countdown
  const updateCountdown = (value: string) => {
    const updatedDevice = {
      ...device,
      countdown: value === 'cancel' ? 0 : parseInt(value) * 3600 // Convert hours to seconds
    };
    onChange(updatedDevice);
    dispatch(updateLightDevice(updatedDevice));
  };

  // Update do not disturb setting
  const toggleDoNotDisturb = () => {
    const updatedDevice = { ...device, doNotDisturb: !device.doNotDisturb };
    onChange(updatedDevice);
    dispatch(updateLightDevice(updatedDevice));
  };

  // Update health read mode
  const toggleHealthRead = () => {
    const updatedDevice = { ...device, switchHealthRead: !device.switchHealthRead };
    onChange(updatedDevice);
    dispatch(updateLightDevice(updatedDevice));
  };

  // Update temperature (for white mode)
  const updateTemperature = (value: number[]) => {
    const updatedDevice = {
      ...device,
      temperature: value[0],
      // If we have a v2 temperature, scale it proportionally
      temperatureV2: value[0] * 4 // Scale to match the v2 range (0-1000)
    };
    onChange(updatedDevice);
    dispatch(updateLightDevice(updatedDevice));
  };

  // Format countdown option
  const formatCountdownOption = (option: string) => {
    if (option === 'cancel') return 'Off';
    return option;
  };

  const lightModes = ["white", "colour", "scene", "music"];

  return (
    <div className="space-y-6">
      <ControlCard title="Light Controls">
        <PowerButton isOn={device.isOn} onToggle={togglePower} />

        <BrightnessSlider
          value={device.brightness || 50}
          onChange={updateBrightness}
        />

        {device.workMode === 'white' && (
          <TemperatureSlider
            value={device.temperature || 127}
            onChange={updateTemperature}
            min={0}
            max={255}
            unit=""
            label="Warmth"
          />
        )}

        <ModeSelector
          label="Light Mode"
          options={lightModes}
          currentMode={device.workMode || lightModes[0]}
          onChange={updateWorkMode}
        />

        {/* Only show color picker in colour mode */}
        {(device.workMode === 'colour') && (
          <ChangeColor
            color={device.colorCode || "#FFFFFF"}
            onChange={updateColor}
          />
        )}

        {/* Show scene selector in scene mode */}
        {(device.workMode === 'scene' || device.workMode?.startsWith('scene_')) && (
          <SceneSelector
            scenes={SCENE_OPTIONS}
            currentScene={device.sceneSelect || '1'}
            onChange={updateScene}
          />
        )}

        <div className="flex justify-end">
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          >
            {showAdvancedSettings ? 'Hide Advanced' : 'Show Advanced'}
          </button>
        </div>
      </ControlCard>

      {showAdvancedSettings && (
        <ControlCard title="Advanced Settings">
          <CountdownSelector
            label="Auto Off Timer"
            options={COUNTDOWN_OPTIONS}
            currentValue={device.countdown ? `${Math.floor(device.countdown / 3600)}h` : 'cancel'}
            onChange={updateCountdown}
            formatOption={formatCountdownOption}
          />

          <ToggleSwitch
            label="Do Not Disturb"
            isChecked={device.doNotDisturb || false}
            onChange={toggleDoNotDisturb}
            icon={<Moon className="h-4 w-4" />}
            description="Disables indicator lights on the device"
          />

          <ToggleSwitch
            label="Reading Mode"
            isChecked={device.switchHealthRead || false}
            onChange={toggleHealthRead}
            icon={<Book className="h-4 w-4" />}
            description="Optimizes light for reading to reduce eye strain"
          />

          {device.switchHealthRead && (
            <>
              <div className="ml-7 space-y-3">
                <BrightnessSlider
                  value={device.readTime || 30}
                  onChange={(value) => {
                    const updatedDevice = { ...device, readTime: value[0] };
                    onChange(updatedDevice);
                    dispatch(updateLightDevice(updatedDevice));
                  }}
                  min={1}
                  max={60}
                  label="Reading Duration (min)"
                />

                <BrightnessSlider
                  value={device.restTime || 5}
                  onChange={(value) => {
                    const updatedDevice = { ...device, restTime: value[0] };
                    onChange(updatedDevice);
                    dispatch(updateLightDevice(updatedDevice));
                  }}
                  min={1}
                  max={60}
                  label="Rest Reminder (min)"
                />
              </div>
            </>
          )}
        </ControlCard>
      )}
    </div>
  );
};
