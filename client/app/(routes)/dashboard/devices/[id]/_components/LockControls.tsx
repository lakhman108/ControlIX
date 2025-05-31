import React, { useState, useEffect } from "react";
import { ParsedTuyaLock, UnlockRecord } from "../types";
import { controlDevice } from "@/app/_lib/backendApi";
import {
  Lock,
  Unlock,
  ShieldAlert,
  Shield,
  BellRing,
  Bell,
  Clock,
  User,
  Fingerprint,
  KeyRound,
  AlertTriangle,
  Battery,
  BatteryMedium,
  BatteryLow,
  UserCheck,
  UserX,
} from "lucide-react";

interface LockControlsProps {
  deviceId: string;
  lockData: ParsedTuyaLock;
  onLockUpdate: (updates: Partial<ParsedTuyaLock>) => void;
  className?: string;
}

export const LockControls: React.FC<LockControlsProps> = ({
  deviceId,
  lockData,
  onLockUpdate,
  className = "",
}) => {
  const [localLockData, setLocalLockData] = useState<ParsedTuyaLock>(lockData);
  const [isLockingUnlocking, setIsLockingUnlocking] = useState(false);

  // Sync with parent data
  useEffect(() => {
    setLocalLockData(lockData);
  }, [lockData]);

  const updateLock = async (updates: Partial<ParsedTuyaLock>) => {
    const newData = { ...localLockData, ...updates };
    setLocalLockData(newData);
    onLockUpdate(updates);
  };

  // Handle lock/unlock action
  const toggleLock = async () => {
    setIsLockingUnlocking(true);
    try {
      // Mock API call - would use controlDevice in a real scenario
      console.log(`Mock control device: ${deviceId}`, {
        code: "switch_state",
        value: !localLockData.switch_state,
      });

      updateLock({ switch_state: !localLockData.switch_state });
    } catch (error) {
      console.error("Failed to toggle lock:", error);
    } finally {
      setIsLockingUnlocking(false);
    }
  };

  // Toggle child lock
  const toggleChildLock = async () => {
    try {
      console.log(`Mock control device: ${deviceId}`, {
        code: "child_lock",
        value: !localLockData.child_lock,
      });

      updateLock({ child_lock: !localLockData.child_lock });
    } catch (error) {
      console.error("Failed to toggle child lock:", error);
    }
  };

  // Toggle alarm
  const toggleAlarm = async () => {
    try {
      console.log(`Mock control device: ${deviceId}`, {
        code: "alarm_state",
        value: !localLockData.alarm_state,
      });

      updateLock({ alarm_state: !localLockData.alarm_state });
    } catch (error) {
      console.error("Failed to toggle alarm:", error);
    }
  };

  // Update auto-lock time
  const updateAutoLockTime = async (time: number) => {
    try {
      console.log(`Mock control device: ${deviceId}`, {
        code: "auto_lock_time",
        value: time,
      });

      updateLock({ auto_lock_time: time });
    } catch (error) {
      console.error("Failed to update auto-lock time:", error);
    }
  };

  // Reset wrong attempts counter
  const resetWrongAttempts = async () => {
    try {
      console.log(`Mock control device: ${deviceId}`, {
        code: "wrong_attempts",
        value: 0,
      });

      updateLock({ wrong_attempts: 0 });
    } catch (error) {
      console.error("Failed to reset wrong attempts:", error);
    }
  };

  // Format unlock record time
  const formatRecordTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get unlock method icon
  const getUnlockMethodIcon = (method: string) => {
    switch (method) {
      case "app":
        return <User size={16} />;
      case "fingerprint":
        return <Fingerprint size={16} />;
      case "code":
        return <KeyRound size={16} />;
      case "card":
        return <UserCheck size={16} />;
      default:
        return <KeyRound size={16} />;
    }
  };

  // Get battery status indicator
  const getBatteryIcon = () => {
    if (localLockData.battery_percentage > 70) {
      return <Battery className="text-green-500" size={18} />;
    } else if (localLockData.battery_percentage > 30) {
      return <BatteryMedium className="text-yellow-500" size={18} />;
    } else {
      return <BatteryLow className="text-red-500" size={18} />;
    }
  };

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Control Panel */}
        <div className="lg:col-span-2 space-y-8">
          {/* Lock/Unlock Control */}
          <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-base-content">
                Lock Control
              </h2>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  localLockData.switch_state
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                }`}
              >
                {localLockData.switch_state ? "Locked" : "Unlocked"}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-10">
              <div
                className={`mb-6 p-8 rounded-full ${
                  localLockData.switch_state
                    ? "bg-green-100 dark:bg-green-900/20"
                    : "bg-blue-100 dark:bg-blue-900/20"
                }`}
              >
                {localLockData.switch_state ? (
                  <Lock
                    size={64}
                    className="text-green-600 dark:text-green-400"
                  />
                ) : (
                  <Unlock
                    size={64}
                    className="text-blue-600 dark:text-blue-400"
                  />
                )}
              </div>
              <button
                onClick={toggleLock}
                disabled={isLockingUnlocking}
                className={`btn btn-lg ${
                  localLockData.switch_state
                    ? "btn-outline btn-primary"
                    : "btn-primary"
                } min-w-[200px]`}
              >
                {isLockingUnlocking ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : localLockData.switch_state ? (
                  "Unlock Door"
                ) : (
                  "Lock Door"
                )}
              </button>
            </div>
          </div>

          {/* Lock Settings */}
          <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6 text-base-content">
              Lock Settings
            </h2>
            <div className="space-y-6">
              {/* Child Lock */}
              <div className="flex items-center justify-between">
                <span className="text-base-content/70">Child Lock</span>
                <button
                  onClick={toggleChildLock}
                  className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                    localLockData.child_lock
                      ? "bg-gradient-to-r from-purple-500 to-pink-500"
                      : "bg-base-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-base-100 rounded-full shadow-lg transition-transform duration-300 ${
                      localLockData.child_lock
                        ? "translate-x-9"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Alarm */}
              <div className="flex items-center justify-between">
                <span className="text-base-content/70">Alarm System</span>
                <button
                  onClick={toggleAlarm}
                  className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                    localLockData.alarm_state
                      ? "bg-gradient-to-r from-red-500 to-orange-500"
                      : "bg-base-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-base-100 rounded-full shadow-lg transition-transform duration-300 ${
                      localLockData.alarm_state
                        ? "translate-x-9"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Auto Lock Time */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base-content/70">Auto Lock Time</span>
                  <span className="text-base-content font-semibold">
                    {localLockData.auto_lock_time > 0
                      ? `${localLockData.auto_lock_time} seconds`
                      : "Disabled"}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="5"
                    value={localLockData.auto_lock_time}
                    onChange={(e) => updateAutoLockTime(Number(e.target.value))}
                    className="w-full h-2 bg-base-300 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Wrong Attempts */}
              {localLockData.wrong_attempts > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle size={18} className="text-yellow-500" />
                    <span className="text-base-content/70">
                      Failed Unlock Attempts:{" "}
                      <span className="font-semibold">
                        {localLockData.wrong_attempts}
                      </span>
                    </span>
                  </div>
                  <button
                    onClick={resetWrongAttempts}
                    className="btn btn-xs btn-outline"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activities */}
          {localLockData.unlock_records.length > 0 && (
            <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6 text-base-content">
                Recent Activities
              </h2>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Method</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localLockData.unlock_records
                      .slice(0, 5)
                      .map((record, index) => (
                        <tr key={index} className="hover">
                          <td>{formatRecordTime(record.timestamp)}</td>
                          <td>
                            <div className="flex items-center space-x-2">
                              {getUnlockMethodIcon(record.method)}
                              <span className="capitalize">
                                {record.method}
                              </span>
                            </div>
                          </td>
                          <td>
                            {record.success ? (
                              <span className="badge badge-success badge-sm">
                                Success
                              </span>
                            ) : (
                              <span className="badge badge-error badge-sm">
                                Failed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Status Panel */}
          <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-base-content">
              Status
            </h2>
            <div className="space-y-4">
              {/* Battery Status */}
              <div className="flex justify-between items-center">
                <span className="text-base-content/70">Battery</span>
                <div className="flex items-center space-x-2">
                  {getBatteryIcon()}
                  <span
                    className={`font-semibold ${
                      localLockData.battery_percentage > 70
                        ? "text-green-500"
                        : localLockData.battery_percentage > 30
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}
                  >
                    {localLockData.battery_percentage}%
                  </span>
                </div>
              </div>

              {/* Door State */}
              {localLockData.door_state && (
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Door</span>
                  <span
                    className={`font-semibold ${
                      localLockData.door_state === "closed"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {localLockData.door_state === "closed" ? "Closed" : "Open"}
                  </span>
                </div>
              )}

              {/* Lock State */}
              <div className="flex justify-between items-center">
                <span className="text-base-content/70">Lock</span>
                <span
                  className={`font-semibold ${
                    localLockData.switch_state
                      ? "text-green-500"
                      : "text-blue-500"
                  }`}
                >
                  {localLockData.switch_state ? "Locked" : "Unlocked"}
                </span>
              </div>

              {/* Tamper Alert */}
              {localLockData.tamper_alert && (
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Security</span>
                  <div className="flex items-center space-x-2">
                    <ShieldAlert size={16} className="text-red-500" />
                    <span className="text-red-500 font-semibold">Tampered</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Device Info */}
          <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-base-content">
              Device Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-base-content/60">Model</span>
                <span className="text-base-content">UNYD Smart Lock</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Firmware</span>
                <span className="text-base-content">v3.2.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Connection</span>
                <span className="text-green-400">WiFi Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Battery</span>
                <div className="flex items-center space-x-2">
                  {getBatteryIcon()}
                  <span
                    className={
                      localLockData.battery_percentage > 70
                        ? "text-green-500"
                        : localLockData.battery_percentage > 30
                          ? "text-yellow-500"
                          : "text-red-500"
                    }
                  >
                    {localLockData.battery_percentage}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/60">Auto-Lock</span>
                <span className="text-base-content">
                  {localLockData.auto_lock_time > 0
                    ? `${localLockData.auto_lock_time}s`
                    : "Off"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-base-content">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                className="w-full btn btn-outline btn-primary"
                onClick={toggleLock}
                disabled={isLockingUnlocking}
              >
                {localLockData.switch_state ? (
                  <>
                    <Unlock size={16} className="mr-2" />
                    Unlock Door
                  </>
                ) : (
                  <>
                    <Lock size={16} className="mr-2" />
                    Lock Door
                  </>
                )}
              </button>

              <button className="w-full btn btn-outline" onClick={toggleAlarm}>
                {localLockData.alarm_state ? (
                  <>
                    <Bell size={16} className="mr-2" />
                    Disable Alarm
                  </>
                ) : (
                  <>
                    <BellRing size={16} className="mr-2" />
                    Enable Alarm
                  </>
                )}
              </button>
            </div>
          </div>
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
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
      `}</style>
    </div>
  );
};
