import React, { useState, useEffect } from "react";
import { ParsedTuyaThermostat } from "../types";
import { controlDevice } from "@/app/_lib/backendApi";
import { DeviceInfoPanel } from "../../_components/common/DeviceInfoPanel";
import { ToggleSwitch } from "../../_components/common/ToggleSwitch";
import {
  Thermometer,
  Power,
  Fan,
  Snowflake,
  Flame,
  Home,
  Wind,
  ToggleLeft,
  Moon,
  ChevronUp,
  ChevronDown,
  Droplets,
  LayoutGrid,
  Clock,
  CalendarDays,
  ToggleRight,
} from "lucide-react";

interface ThermostatControlsProps {
  deviceId: string;
  thermostatData: ParsedTuyaThermostat;
  onThermostatUpdate: (updates: Partial<ParsedTuyaThermostat>) => void;
  className?: string;
}

export const ThermostatControls: React.FC<ThermostatControlsProps> = ({
  deviceId,
  thermostatData,
  onThermostatUpdate,
  className = "",
}) => {
  const [localThermostatData, setLocalThermostatData] =
    useState<ParsedTuyaThermostat>(thermostatData);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync with parent data
  useEffect(() => {
    setLocalThermostatData(thermostatData);
  }, [thermostatData]);

  // Update thermostat state
  const updateThermostat = async (updates: Partial<ParsedTuyaThermostat>) => {
    const newData = { ...localThermostatData, ...updates };
    setLocalThermostatData(newData);
    onThermostatUpdate(updates);
  };

  // Toggle power
  const togglePower = async () => {
    setIsUpdating(true);
    try {
      await controlDevice(deviceId, {
        code: "power_state",
        value: !localThermostatData.power_state,
      });

      updateThermostat({ power_state: !localThermostatData.power_state });
    } catch (error) {
      console.error("Failed to toggle power:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Change temperature
  const changeTemperature = async (delta: number) => {
    const newTemp = Math.min(
      Math.max(localThermostatData.target_temp + delta, 5), // Min 5°C (or 41°F)
      35, // Max 35°C (or 95°F)
    );

    try {
      await controlDevice(deviceId, {
        code: "target_temp",
        value: newTemp,
      });

      updateThermostat({ target_temp: newTemp });
    } catch (error) {
      console.error("Failed to change temperature:", error);
    }
  };

  // Change operation mode
  const changeMode = async (mode: string) => {
    try {
      await controlDevice(deviceId, {
        code: "mode",
        value: mode,
      });

      updateThermostat({ mode: mode as any });
    } catch (error) {
      console.error("Failed to change mode:", error);
    }
  };

  // Change preset
  const changePreset = async (preset: string) => {
    try {
      await controlDevice(deviceId, {
        code: "preset",
        value: preset,
      });

      updateThermostat({ preset: preset as any });
    } catch (error) {
      console.error("Failed to change preset:", error);
    }
  };

  // Toggle temperature unit
  const toggleTempUnit = async () => {
    const newUnit = localThermostatData.temp_unit === "c" ? "f" : "c";
    try {
      await controlDevice(deviceId, {
        code: "temp_unit",
        value: newUnit,
      });

      updateThermostat({ temp_unit: newUnit as "c" | "f" });
    } catch (error) {
      console.error("Failed to change temperature unit:", error);
    }
  };

  // Change fan speed
  const changeFanSpeed = async (speed: string) => {
    try {
      await controlDevice(deviceId, {
        code: "fan_speed",
        value: speed,
      });

      updateThermostat({ fan_speed: speed as any });
    } catch (error) {
      console.error("Failed to change fan speed:", error);
    }
  };

  // Toggle control lock
  const toggleControlLock = async () => {
    try {
      await controlDevice(deviceId, {
        code: "lock_status",
        value: !localThermostatData.lock_status,
      });

      updateThermostat({ lock_status: !localThermostatData.lock_status });
    } catch (error) {
      console.error("Failed to toggle control lock:", error);
    }
  };

  // Toggle window detection
  const toggleWindowDetection = async () => {
    try {
      await controlDevice(deviceId, {
        code: "window_detection",
        value: !localThermostatData.window_detection,
      });

      updateThermostat({
        window_detection: !localThermostatData.window_detection,
      });
    } catch (error) {
      console.error("Failed to toggle window detection:", error);
    }
  };

  // Get mode icon
  const getModeIcon = (mode: string, className = "h-6 w-6") => {
    switch (mode) {
      case "heat":
        return <Flame className={`${className} text-orange-500`} />;
      case "cool":
        return <Snowflake className={`${className} text-blue-500`} />;
      case "auto":
        return <ToggleRight className={`${className} text-green-500`} />;
      case "fan":
        return <Fan className={`${className} text-purple-500`} />;
      default:
        return <Thermometer className={className} />;
    }
  };

  // Get preset icon
  const getPresetIcon = (preset: string, className = "h-6 w-6") => {
    switch (preset) {
      case "home":
        return <Home className={`${className} text-green-500`} />;
      case "away":
        return <LayoutGrid className={`${className} text-blue-500`} />;
      case "eco":
        return <Droplets className={`${className} text-teal-500`} />;
      case "sleep":
        return <Moon className={`${className} text-purple-500`} />;
      default:
        return <Home className={className} />;
    }
  };

  // Determine display temperature
  const getDisplayTemp = (temp: number) => {
    // Round to 1 decimal place
    return Math.round(temp * 10) / 10;
  };

  // Get background style based on mode
  const getModeBgClass = () => {
    if (!localThermostatData.power_state) return "from-base-300 to-base-200";

    switch (localThermostatData.mode) {
      case "heat":
        return "from-red-500/20 to-orange-500/20";
      case "cool":
        return "from-blue-500/20 to-cyan-500/20";
      case "auto":
        return "from-green-500/20 to-teal-500/20";
      case "fan":
        return "from-purple-500/20 to-indigo-500/20";
      default:
        return "from-blue-500/10 to-purple-500/10";
    }
  };

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Control Panel */}
        <div className="lg:col-span-2 space-y-8">
          {/* Temperature Control */}
          <div
            className={`bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-base-content">
                Temperature Control
              </h2>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  localThermostatData.power_state
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {localThermostatData.power_state ? "Active" : "Standby"}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center py-6 gap-8">
              {/* Current temperature */}
              <div className="flex flex-col items-center">
                <span className="text-sm text-base-content/60 mb-2">
                  Current
                </span>
                <div
                  className={`p-6 rounded-xl bg-gradient-to-r ${getModeBgClass()} flex flex-col items-center`}
                >
                  <div className="text-4xl font-bold text-base-content">
                    {getDisplayTemp(localThermostatData.current_temp)}°
                    {localThermostatData.temp_unit.toUpperCase()}
                  </div>
                  {localThermostatData.humidity !== undefined && (
                    <div className="flex items-center mt-2 text-base-content/70">
                      <Droplets size={14} className="mr-1" />
                      <span>{localThermostatData.humidity}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Temperature controls */}
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-4">
                  <span className="text-sm text-base-content/60 mr-2">
                    Target
                  </span>
                  <button
                    className="btn btn-xs btn-ghost"
                    onClick={toggleTempUnit}
                    disabled={!localThermostatData.power_state}
                  >
                    °C / °F
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    className="btn btn-circle btn-lg"
                    onClick={() => changeTemperature(-0.5)}
                    disabled={!localThermostatData.power_state}
                  >
                    <ChevronDown size={24} />
                  </button>

                  <div
                    className={`p-6 rounded-xl bg-gradient-to-r ${getModeBgClass()} flex flex-col items-center min-w-[100px]`}
                  >
                    <div className="text-5xl font-bold text-base-content">
                      {getDisplayTemp(localThermostatData.target_temp)}°
                    </div>
                    <div className="text-sm text-base-content/70">
                      {localThermostatData.temp_unit.toUpperCase()}
                    </div>
                  </div>

                  <button
                    className="btn btn-circle btn-lg"
                    onClick={() => changeTemperature(0.5)}
                    disabled={!localThermostatData.power_state}
                  >
                    <ChevronUp size={24} />
                  </button>
                </div>

                <button
                  onClick={togglePower}
                  className={`btn mt-6 ${
                    localThermostatData.power_state
                      ? "btn-error"
                      : "btn-primary"
                  }`}
                >
                  <Power size={18} className="mr-2" />
                  {localThermostatData.power_state ? "Turn Off" : "Turn On"}
                </button>
              </div>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6 text-base-content">
              Operation Mode
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  mode: "heat",
                  icon: Flame,
                  label: "Heat",
                  color: "from-red-500 to-orange-500",
                },
                {
                  mode: "cool",
                  icon: Snowflake,
                  label: "Cool",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  mode: "auto",
                  icon: ToggleRight,
                  label: "Auto",
                  color: "from-green-500 to-teal-500",
                },
                {
                  mode: "fan",
                  icon: Fan,
                  label: "Fan",
                  color: "from-purple-500 to-indigo-500",
                },
              ].map(({ mode, icon: Icon, label, color }) => (
                <button
                  key={mode}
                  onClick={() => changeMode(mode)}
                  disabled={!localThermostatData.power_state}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    !localThermostatData.power_state
                      ? "opacity-50 cursor-not-allowed"
                      : localThermostatData.mode === mode
                        ? `bg-gradient-to-r ${color} border-transparent text-white shadow-lg`
                        : "bg-base-200 border-base-300 text-base-content/70 hover:bg-base-300 hover:border-base-400"
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">{label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Fan Speed Settings */}
          {localThermostatData.fan_speed !== undefined && (
            <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6 text-base-content">
                Fan Settings
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["auto", "low", "medium", "high"].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => changeFanSpeed(speed)}
                    disabled={!localThermostatData.power_state}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      !localThermostatData.power_state
                        ? "opacity-50 cursor-not-allowed"
                        : localThermostatData.fan_speed === speed
                          ? "bg-gradient-to-r from-blue-400 to-indigo-500 border-transparent text-white shadow-lg"
                          : "bg-base-200 border-base-300 text-base-content/70 hover:bg-base-300 hover:border-base-400"
                    }`}
                  >
                    <Fan
                      className={`w-6 h-6 mx-auto mb-2 ${
                        speed === "high"
                          ? "animate-spin-slow"
                          : speed === "medium"
                            ? "animate-spin-slower"
                            : speed === "low"
                              ? "animate-spin-slowest"
                              : ""
                      }`}
                    />
                    <div className="text-sm font-medium capitalize">
                      {speed}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Schedule Preview */}
          {localThermostatData.schedule.length > 0 && (
            <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-base-content">
                  Weekly Schedule
                </h2>
                <button className="btn btn-sm btn-outline">
                  <CalendarDays size={16} className="mr-2" />
                  Edit
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Periods</th>
                      <th>Temperature</th>
                      <th>Mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localThermostatData.schedule.map((day, index) => {
                      const dayNames = [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ];
                      return (
                        <tr key={index} className="hover">
                          <td>{dayNames[day.day]}</td>
                          <td>{day.periods.length}</td>
                          <td>
                            {day.periods.map((p, i) => (
                              <span key={i} className="badge badge-sm mr-1">
                                {p.temp}°
                                {localThermostatData.temp_unit.toUpperCase()}
                              </span>
                            ))}
                          </td>
                          <td>
                            {day.periods.map((p, i) => (
                              <span
                                key={i}
                                className="badge badge-outline badge-sm mr-1 capitalize"
                              >
                                {p.mode}
                              </span>
                            ))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Power & Preset */}
          <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-base-content">
              Quick Controls
            </h2>
            <div className="space-y-4">
              <ToggleSwitch
                isOn={localThermostatData.power_state}
                onToggle={togglePower}
                label="Power"
              />

              <div className="divider my-2"></div>

              <div className="text-sm font-medium text-base-content/70 mb-2">
                Preset Modes
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["home", "away", "eco", "sleep"].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => changePreset(preset)}
                    disabled={!localThermostatData.power_state}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center ${
                      !localThermostatData.power_state
                        ? "opacity-50 cursor-not-allowed"
                        : localThermostatData.preset === preset
                          ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/30"
                          : "bg-base-200 border-base-300 hover:bg-base-300"
                    }`}
                  >
                    {getPresetIcon(preset)}
                    <span className="text-xs mt-1 capitalize">{preset}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Status & Conditions */}
          <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-base-content">
              Status
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-base-content/70">Mode</span>
                <div className="flex items-center space-x-2">
                  {getModeIcon(localThermostatData.mode, "h-4 w-4")}
                  <span className="capitalize font-medium">
                    {localThermostatData.mode}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-base-content/70">Preset</span>
                <div className="flex items-center space-x-2">
                  {getPresetIcon(localThermostatData.preset, "h-4 w-4")}
                  <span className="capitalize font-medium">
                    {localThermostatData.preset}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-base-content/70">Target</span>
                <span className="font-medium">
                  {localThermostatData.target_temp}°
                  {localThermostatData.temp_unit.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-base-content/70">Current</span>
                <span className="font-medium">
                  {localThermostatData.current_temp}°
                  {localThermostatData.temp_unit.toUpperCase()}
                </span>
              </div>

              {localThermostatData.humidity !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Humidity</span>
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">
                      {localThermostatData.humidity}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Device Info */}
          <DeviceInfoPanel
            items={[
              { label: "Model", value: "UNYD Smart Thermostat" },
              { label: "Firmware", value: "v2.4.5" },
              {
                label: "Connection",
                value: "WiFi Connected",
                color: "text-green-400",
              },
              {
                label: "Temperature Unit",
                value:
                  localThermostatData.temp_unit === "c"
                    ? "Celsius"
                    : "Fahrenheit",
              },
              {
                label: "Control Lock",
                value: localThermostatData.lock_status ? "Enabled" : "Disabled",
              },
            ]}
          />

          {/* Additional Settings */}
          <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-base-content">
              Settings
            </h2>
            <div className="space-y-4">
              <ToggleSwitch
                isOn={localThermostatData.lock_status}
                onToggle={toggleControlLock}
                label="Control Lock"
                activeColor="bg-gradient-to-r from-purple-500 to-pink-500"
              />

              <ToggleSwitch
                isOn={localThermostatData.window_detection}
                onToggle={toggleWindowDetection}
                label="Window Detection"
                activeColor="bg-gradient-to-r from-cyan-500 to-blue-500"
              />

              <div className="flex justify-between items-center">
                <span className="text-base-content/70">Temperature Unit</span>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={toggleTempUnit}
                >
                  {localThermostatData.temp_unit === "c" ? "°C" : "°F"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes spin-slowest {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-slower {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slowest {
          animation: spin-slowest 8s linear infinite;
        }
        .animate-spin-slower {
          animation: spin-slower 5s linear infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};
