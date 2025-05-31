import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ShieldCheck, Wind } from 'lucide-react';
import { ControlCard } from '../common/ControlCard';
import { PowerButton } from '../common/PowerButton';
import { TemperatureSlider } from '../common/TemperatureSlider';
import { ModeSelector } from '../common/ModeSelector';
import { CountdownSelector } from '../common/CountdownSelector';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { ACDevice } from '@/app/_types/device';
import { updateACDevice } from '@/app/_lib/slices/deviceSlice';

interface ACControlsProps {
  device: ACDevice;
  onChange: (_device: ACDevice) => void;
  togglePower: () => void;
}

export const ACControls: React.FC<ACControlsProps> = ({
  device,
  onChange,
  togglePower
}) => {
  const dispatch = useDispatch();
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const updateTemperature = (value: number[]) => {
    const updatedDevice = { ...device, temperature: value[0] };
    onChange(updatedDevice);
    dispatch(updateACDevice(updatedDevice));
  };

  const updateMode = (mode: string) => {
    const updatedDevice = { ...device, mode: mode as ACDevice['mode'] };
    onChange(updatedDevice);
    dispatch(updateACDevice(updatedDevice));
  };

  const updateFanSpeed = (speed: string) => {
    const updatedDevice = { ...device, fanSpeed: speed as ACDevice['fanSpeed'] };
    onChange(updatedDevice);
    dispatch(updateACDevice(updatedDevice));
  };

  const updateWindSpeed = (speed: string) => {
    const updatedDevice = { ...device, windspeed: speed as ACDevice['windspeed'] };
    onChange(updatedDevice);
    dispatch(updateACDevice(updatedDevice));
  };

  const toggleChildLock = () => {
    const updatedDevice = { ...device, childLock: !device.childLock };
    onChange(updatedDevice);
    dispatch(updateACDevice(updatedDevice));
  };

  const updateCountdown = (value: string) => {
    const updatedDevice = { ...device, countdownSet: value };
    onChange(updatedDevice);
    dispatch(updateACDevice(updatedDevice));
  };

  const formatCountdownOption = (option: string) => {
    if (option === 'cancel') return 'Off';
    // Replace underscores with dots for better display
    return option.replace('_', '.');
  };

  const acModes = ["hot", "cold", "wet", "wind"];
  const fanSpeeds = ["level_1", "level_2", "level_3", "level_4"];
  const windSpeeds = ["1", "2", "3", "4", "5", "6"];
  const countdownOptions = [
    "cancel", "0_5h", "1h", "1_5h", "2h", "2_5h", "3h", "3_5h", "4h",
    "4_5h", "5h", "5_5h", "6h"
  ];

  const formatFanSpeed = (speed: string) => {
    return speed.replace("level_", "Speed ");
  };

  const formatWindSpeed = (speed: string) => {
    return `Level ${speed}`;
  };

  return (
    <div className="space-y-6">
      <ControlCard title="AC Controls">
        <PowerButton isOn={device.isOn} onToggle={togglePower} />

        <TemperatureSlider
          value={device.temperature}
          onChange={updateTemperature}
          min={0}
          max={40}
          unit="°C"
        />

        <ModeSelector
          label="Mode"
          options={acModes}
          currentMode={device.mode || acModes[0]}
          onChange={updateMode}
        />

        <ModeSelector
          label="Fan Speed"
          options={fanSpeeds}
          currentMode={device.fanSpeed || fanSpeeds[0]}
          onChange={updateFanSpeed}
          formatOption={formatFanSpeed}
        />

        {device.mode === 'wind' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4" />
              <label className="text-sm opacity-70">Wind Intensity</label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {windSpeeds.map(speed => (
                <button
                  key={speed}
                  className={`btn btn-sm ${device.windspeed === speed ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => updateWindSpeed(speed)}
                >
                  {formatWindSpeed(speed)}
                </button>
              ))}
            </div>
          </div>
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
            label="Timer"
            options={countdownOptions.slice(0, 8)} // Limit displayed options
            currentValue={device.countdownSet || 'cancel'}
            onChange={updateCountdown}
            formatOption={formatCountdownOption}
          />

          <ToggleSwitch
            label="Child Lock"
            isChecked={device.childLock || false}
            onChange={toggleChildLock}
            icon={<ShieldCheck className="h-4 w-4" />}
            description="Prevents accidental changes to settings"
          />

          {device.currentTemperature !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-70">Current Temperature</span>
              <span className="badge badge-primary">{device.currentTemperature}°C</span>
            </div>
          )}

          {device.countdownLeft !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-70">Time Remaining</span>
              <span className="badge badge-secondary">
                {Math.floor(device.countdownLeft / 60)}:{(device.countdownLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </ControlCard>
      )}
    </div>
  );
};
