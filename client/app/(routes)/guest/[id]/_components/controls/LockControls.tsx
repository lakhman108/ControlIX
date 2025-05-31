import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Lock, Unlock, Shield, Battery, Lightbulb, Bell } from 'lucide-react';
import { ControlCard } from '../common/ControlCard';
import { PowerButton } from '../common/PowerButton';
import { ModeSelector } from '../common/ModeSelector';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { CountdownSelector } from '../common/CountdownSelector';
import { PercentageSlider } from '../common/PercentageSlider';
import { LockDevice } from '@/app/_types/device';
import { updateLockDevice } from '@/app/_lib/slices/deviceSlice';

interface LockControlsProps {
  device: LockDevice;
  onChange: (_device: LockDevice) => void;
  togglePower: () => void;
}

export const LockControls: React.FC<LockControlsProps> = ({
  device,
  onChange,
  togglePower
}) => {
  const dispatch = useDispatch();
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const toggleLock = (action: string) => {
    const updatedDevice = {
      ...device,
      lockStatus: action as LockDevice['lockStatus'],
      // Also update lockState appropriately
      lockState: action === 'open' ? 'opened' : action === 'close' ? 'closed' : device.lockState
    };
    onChange(updatedDevice);
    dispatch(updateLockDevice(updatedDevice));
  };

  const toggleAntiTheft = () => {
    const updatedDevice = { ...device, antiTheft: !device.antiTheft };
    onChange(updatedDevice);
    dispatch(updateLockDevice(updatedDevice));
  };

  const setMode = (mode: string) => {
    const updatedDevice = { ...device, mode: mode as LockDevice['mode'] };
    onChange(updatedDevice);
    dispatch(updateLockDevice(updatedDevice));
  };

  const updatePercentControl = (value: number[]) => {
    const updatedDevice = { ...device, percentControl: value[0] };
    onChange(updatedDevice);
    dispatch(updateLockDevice(updatedDevice));
  };

  const toggleAutoPower = () => {
    const updatedDevice = { ...device, autoPower: !device.autoPower };
    onChange(updatedDevice);
    dispatch(updateLockDevice(updatedDevice));
  };

  const toggleChargeSwitch = () => {
    const updatedDevice = { ...device, chargeSwitch: !device.chargeSwitch };
    onChange(updatedDevice);
    dispatch(updateLockDevice(updatedDevice));
  };

  const toggleCloseReminder = () => {
    const updatedDevice = { ...device, closeReminder: !device.closeReminder };
    onChange(updatedDevice);
    dispatch(updateLockDevice(updatedDevice));
  };

  const updateCountdownSet = (value: string) => {
    const updatedDevice = { ...device, countdownSet: value as LockDevice['countdownSet'] };
    onChange(updatedDevice);
    dispatch(updateLockDevice(updatedDevice));
  };

  const updateCountdown = (value: string) => {
    const updatedDevice = { ...device, countdown: value as LockDevice['countdown'] };
    onChange(updatedDevice);
    dispatch(updateLockDevice(updatedDevice));
  };

  const lockModes = ["morning", "night"];
  const countdownSetOptions = ["cancel", "1h", "2h", "3h", "4h"];
  const countdownOptions = ["cancel", "1", "2", "3", "4", "5", "6"];

  const formatCountdownValue = (value: string) => {
    if (value === 'cancel') return 'Off';
    return `${value}`;
  };

  return (
    <div className="space-y-6">
      <ControlCard title="Lock Controls">
        <PowerButton isOn={device.isOn} onToggle={togglePower} />

        <div className="space-y-2">
          <label className="text-sm opacity-70">Lock Control</label>
          <div className="flex flex-wrap justify-between gap-2">
            <button
              className={`btn ${device.lockStatus === 'open' ? 'btn-primary' : 'btn-outline'} flex-1`}
              onClick={() => toggleLock("open")}
            >
              <Unlock className="h-5 w-5 mr-2" />
              Open
            </button>
            <button
              className={`btn ${device.lockStatus === 'stop' ? 'btn-primary' : 'btn-outline'} flex-1`}
              onClick={() => toggleLock("stop")}
            >
              Stop
            </button>
            <button
              className={`btn ${device.lockStatus === 'close' ? 'btn-primary' : 'btn-outline'} flex-1`}
              onClick={() => toggleLock("close")}
            >
              <Lock className="h-5 w-5 mr-2" />
              Close
            </button>
          </div>
        </div>

        <PercentageSlider
          value={device.percentControl || 0}
          onChange={updatePercentControl}
          label="Position Control"
        />

        <ToggleSwitch
          label="Anti-theft Mode"
          isChecked={device.antiTheft || false}
          onChange={toggleAntiTheft}
          icon={<Shield className="h-4 w-4" />}
          description="Extra security for your lock"
        />

        <ModeSelector
          label="Mode"
          options={lockModes}
          currentMode={device.mode || lockModes[0]}
          onChange={setMode}
          formatOption={(mode) => `${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`}
        />

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
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-70">Current Status</span>
            <div className={`badge ${device.lockState === 'opened' ? 'badge-success' : 'badge-error'}`}>
              {device.lockState === 'opened' ? 'Opened' : 'Closed'}
            </div>
          </div>

          {device.percentState !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-70">Current Position</span>
              <span className="badge badge-primary">{device.percentState}%</span>
            </div>
          )}

          {device.residualElectricity !== undefined && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4" />
                <span className="text-sm opacity-70">Battery</span>
              </div>
              <span className={`badge ${
                device.residualElectricity > 20 ? 'badge-success' : 'badge-error'
              }`}>
                {device.residualElectricity}%
              </span>
            </div>
          )}

          <ToggleSwitch
            label="Auto Power"
            isChecked={device.autoPower || false}
            onChange={toggleAutoPower}
            icon={<Lightbulb className="h-4 w-4" />}
            description="Automatically power on/off based on schedule"
          />

          <ToggleSwitch
            label="Charging Mode"
            isChecked={device.chargeSwitch || false}
            onChange={toggleChargeSwitch}
            icon={<Battery className="h-4 w-4" />}
            description="Enable charging for battery-powered locks"
          />

          <ToggleSwitch
            label="Close Reminder"
            isChecked={device.closeReminder || false}
            onChange={toggleCloseReminder}
            icon={<Bell className="h-4 w-4" />}
            description="Get notified if the lock remains open for too long"
          />

          <CountdownSelector
            label="Auto-Lock Timer"
            options={countdownSetOptions}
            currentValue={device.countdownSet || 'cancel'}
            onChange={updateCountdownSet}
            formatOption={formatCountdownValue}
          />

          <CountdownSelector
            label="Reminder Countdown"
            options={countdownOptions}
            currentValue={device.countdown || 'cancel'}
            onChange={updateCountdown}
            formatOption={formatCountdownValue}
          />

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
