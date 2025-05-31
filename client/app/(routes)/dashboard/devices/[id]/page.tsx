"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { BulbControls } from "./_components/BulbControls";
import { LockControls } from "./_components/LockControls";
import { ThermostatControls } from "./_components/ThermostatControls";
import {
  ArrowLeft,
  Lightbulb,
  Wifi,
  WifiOff,
  Lock,
  Thermometer,
} from "lucide-react";
import {
  setSelectedDevice,
  toggleDevicePower,
} from "@/app/_lib/slices/deviceSlice";
import { getTuyaDeviceState } from "@/app/_lib/backendApi";
import {
  ParsedTuyaBulb,
  TuyaBulbUtils,
  ParsedTuyaLock,
  TuyaLockUtils,
  ParsedTuyaThermostat,
  TuyaThermostatUtils,
} from "./types";

// Device type enum for better readability
enum DeviceType {
  BULB = "dj",
  LOCK = "mc",
  THERMOSTAT = "wk",
}

// Union type for all device types
type DeviceData = ParsedTuyaBulb | ParsedTuyaLock | ParsedTuyaThermostat;

// Mock data generators
const generateMockLockData = (deviceId: string): ParsedTuyaLock => {
  return {
    switch_state: true, // Locked
    alarm_state: false,
    battery_percentage: 85,
    child_lock: false,
    tamper_alert: false,
    auto_lock_time: 30,
    wrong_attempts: 0,
    low_power: false,
    door_state: "closed",
    unlock_records: [
      {
        timestamp: Date.now() - 3600000, // 1 hour ago
        method: "app",
        user_id: "user123",
        success: true,
      },
      {
        timestamp: Date.now() - 86400000, // 1 day ago
        method: "fingerprint",
        success: true,
      },
      {
        timestamp: Date.now() - 90000000, // ~1 day ago
        method: "code",
        success: false,
      },
    ],
  };
};

const generateMockThermostatData = (deviceId: string): ParsedTuyaThermostat => {
  return {
    power_state: true,
    current_temp: 22.5,
    target_temp: 23,
    temp_unit: "c",
    mode: "heat",
    preset: "home",
    humidity: 45,
    fan_speed: "auto",
    lock_status: false,
    window_detection: true,
    eco_temp: 18,
    away_temp: 16,
    schedule: [
      {
        day: 0, // Monday
        periods: [
          {
            start_time: "06:00",
            temp: 22,
            mode: "heat",
          },
          {
            start_time: "08:00",
            temp: 18,
            mode: "eco",
          },
          {
            start_time: "18:00",
            temp: 22,
            mode: "heat",
          },
        ],
      },
      {
        day: 1, // Tuesday
        periods: [
          {
            start_time: "06:00",
            temp: 22,
            mode: "heat",
          },
          {
            start_time: "08:00",
            temp: 18,
            mode: "eco",
          },
          {
            start_time: "18:00",
            temp: 22,
            mode: "heat",
          },
        ],
      },
    ],
  };
};

export default function DeviceControlPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const deviceId = params.id as string;
  const deviceCode = searchParams.get("code") || "dj"; // Default to bulb if no code provided

  // Local state to manage device data and type
  const [device, setDevice] = useState<DeviceData | null>(null);
  const [deviceType, setDeviceType] = useState<DeviceType>(
    deviceCode as DeviceType,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set device type based on code parameter
    setDeviceType(deviceCode as DeviceType);

    // Fetch device data based on type
    const fetchDeviceData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // For bulbs, fetch real data from Tuya API
        if (deviceCode === DeviceType.BULB) {
          const result = await getTuyaDeviceState(deviceId);
          const bulb = TuyaBulbUtils.fromTuyaResponse(result.devices);
          const parsedBulb = TuyaBulbUtils.parseBulb(bulb);

          setDevice(parsedBulb);
          dispatch(setSelectedDevice(parsedBulb as any));
        }
        // For locks, use mock data
        else if (deviceCode === DeviceType.LOCK) {
          const mockLockData = generateMockLockData(deviceId);
          setDevice(mockLockData);
          dispatch(setSelectedDevice(mockLockData as any));
        }
        // For thermostats, use mock data
        else if (deviceCode === DeviceType.THERMOSTAT) {
          const mockThermostatData = generateMockThermostatData(deviceId);
          setDevice(mockThermostatData);
          dispatch(setSelectedDevice(mockThermostatData as any));
        }
        // Handle unknown device type
        else {
          setError("Unknown device type");
        }
      } catch (error) {
        console.error("Error fetching device:", error);
        setError("Failed to load device data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeviceData();
  }, [deviceId, deviceCode, dispatch]);

  // Generic handler for device updates based on device type
  const handleDeviceUpdate = (updates: Partial<DeviceData>) => {
    if (device) {
      const updatedDevice = { ...device, ...updates };
      setDevice(updatedDevice);

      // Here you would call your API to update the device state
      // Only for real device calls (bulbs)
      // if (deviceType === DeviceType.BULB) {
      //   await updateTuyaDeviceStatus(deviceId, updates);
      // }
    }
  };

  // Helper functions for display based on device type
  const getDeviceName = () => {
    switch (deviceType) {
      case DeviceType.BULB:
        return `Smart Bulb ${deviceId.slice(-4).toUpperCase()}`;
      case DeviceType.LOCK:
        return `Smart Lock ${deviceId.slice(-4).toUpperCase()}`;
      case DeviceType.THERMOSTAT:
        return `Smart Thermostat ${deviceId.slice(-4).toUpperCase()}`;
      default:
        return `Device ${deviceId.slice(-4).toUpperCase()}`;
    }
  };

  const getDeviceIcon = () => {
    switch (deviceType) {
      case DeviceType.BULB:
        return <Lightbulb className="h-6 w-6 text-white" />;
      case DeviceType.LOCK:
        return <Lock className="h-6 w-6 text-white" />;
      case DeviceType.THERMOSTAT:
        return <Thermometer className="h-6 w-6 text-white" />;
      default:
        return <Lightbulb className="h-6 w-6 text-white" />;
    }
  };

  // Get status label based on device type
  const getDeviceStatusLabel = () => {
    if (!device) return "";

    switch (deviceType) {
      case DeviceType.BULB:
        const bulbDevice = device as ParsedTuyaBulb;
        return `${bulbDevice.work_mode.charAt(0).toUpperCase() + bulbDevice.work_mode.slice(1)} Mode`;
      case DeviceType.LOCK:
        const lockDevice = device as ParsedTuyaLock;
        return lockDevice.switch_state ? "Locked" : "Unlocked";
      case DeviceType.THERMOSTAT:
        const thermostatDevice = device as ParsedTuyaThermostat;
        return `${thermostatDevice.mode.charAt(0).toUpperCase() + thermostatDevice.mode.slice(1)} Mode`;
      default:
        return "";
    }
  };

  // Get metrics based on device type
  const getDeviceMetrics = () => {
    if (!device) return [];

    switch (deviceType) {
      case DeviceType.BULB:
        const bulbDevice = device as ParsedTuyaBulb;
        return [
          {
            label: "Brightness",
            value: `${Math.round((bulbDevice.bright_value_v2 / 1000) * 100)}%`,
          },
        ];
      case DeviceType.LOCK:
        const lockDevice = device as ParsedTuyaLock;
        return [
          {
            label: "Battery",
            value: `${lockDevice.battery_percentage}%`,
          },
        ];
      case DeviceType.THERMOSTAT:
        const thermostatDevice = device as ParsedTuyaThermostat;
        return [
          {
            label: "Temperature",
            value: `${thermostatDevice.current_temp}°${thermostatDevice.temp_unit.toUpperCase()}`,
          },
        ];
      default:
        return [];
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
        <div className="text-center space-y-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <div className="text-base-content/70">Loading device data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-2xl max-w-md w-full">
          <div className="card-body text-center">
            <WifiOff className="h-16 w-16 text-error mx-auto mb-4" />
            <h2 className="card-title justify-center text-error">
              Connection Error
            </h2>
            <p className="text-base-content/70">{error}</p>
            <div className="card-actions justify-center mt-6">
              <Link href="/dashboard/devices">
                <button className="btn btn-primary">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Devices
                </button>
              </Link>
              <button
                className="btn btn-outline"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-2xl max-w-md w-full">
          <div className="card-body text-center">
            {getDeviceIcon()}
            <h2 className="card-title justify-center">Device Not Found</h2>
            <p className="text-base-content/70">
              The requested device could not be located or is unavailable.
            </p>
            <div className="card-actions justify-center mt-6">
              <Link href="/dashboard/devices">
                <button className="btn btn-primary">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Devices
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      {/* Header Section */}
      <div className="border-b border-base-300 backdrop-blur-xl bg-base-100/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/devices">
              <button className="btn btn-ghost btn-circle text-base-content/70 hover:text-base-content">
                <ArrowLeft className="h-5 w-5" />
              </button>
            </Link>

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  {getDeviceIcon()}
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-base-content">
                    {getDeviceName()}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Wifi className="h-4 w-4 text-green-400" />
                      <span className="text-xs text-green-400 font-medium">
                        Connected
                      </span>
                    </div>
                    {getDeviceStatusLabel() && (
                      <>
                        <div className="text-base-content/60">•</div>
                        <span className="text-sm text-base-content/60">
                          {getDeviceStatusLabel()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {getDeviceMetrics().map((metric, index) => (
                <div
                  key={index}
                  className="bg-base-100/50 backdrop-blur-xl border border-base-300 rounded-xl p-3"
                >
                  <div className="text-xs text-base-content/60">
                    {metric.label}
                  </div>
                  <div className="text-lg font-semibold text-base-content">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Render appropriate control component based on device type */}
      <div className="container mx-auto p-4 space-y-6">
        {deviceType === DeviceType.BULB && (
          <BulbControls
            deviceId={deviceId}
            bulbData={device as ParsedTuyaBulb}
            onBulbUpdate={
              handleDeviceUpdate as (updates: Partial<ParsedTuyaBulb>) => void
            }
          />
        )}

        {deviceType === DeviceType.LOCK && (
          <LockControls
            deviceId={deviceId}
            lockData={device as ParsedTuyaLock}
            onLockUpdate={
              handleDeviceUpdate as (updates: Partial<ParsedTuyaLock>) => void
            }
          />
        )}

        {deviceType === DeviceType.THERMOSTAT && (
          <ThermostatControls
            deviceId={deviceId}
            thermostatData={device as ParsedTuyaThermostat}
            onThermostatUpdate={
              handleDeviceUpdate as (
                updates: Partial<ParsedTuyaThermostat>,
              ) => void
            }
          />
        )}
      </div>
    </div>
  );
}
