// Base interface for Tuya device response
interface TuyaDeviceItem {
  code: string;
  value: string | number | boolean;
}

// Light color settings
interface LightColor {
  h: number; // Hue (0-360)
  s: number; // Saturation (0-1000)
  v: number; // Value/Brightness (0-1000)
}

// Light scene unit
interface LightScene {
  bright: number;
  h: number; // Hue
  s: number; // Saturation
  temperature: number;
  unit_change_mode: "gradient" | "jump" | string;
  unit_gradient_duration: number;
  unit_switch_duration: number;
  v: number; // Value/Brightness
}

// Light scene collection
interface LightScenes {
  scene_num: number;
  scene_units: LightScene[];
}

// Main Tuya bulb state
interface TuyaBulb {
  switch_led: boolean;
  work_mode: "white" | "colour" | "scene" | "music" | string;
  bright_value_v2: number; // 0-1000
  temp_value_v2: number; // Color temperature
  colour_data_v2: string; // JSON string - use parseColor() to convert
  scene_data_v2: string; // JSON string - use parseScenes() to convert
  countdown_1: number; // Timer in seconds
  music_data: string; // Music sync data
  control_data: string; // Control commands
  rhythm_mode: string; // Base64 encoded rhythm settings
  sleep_mode: string; // Base64 encoded sleep settings
  wakeup_mode: string; // Base64 encoded wakeup settings
  power_memory: string; // Base64 encoded power memory
  do_not_disturb: boolean;
  cycle_timing: string; // Base64 encoded cycle timing
  random_timing: string; // Base64 encoded random timing
}

// Parsed Tuya bulb with typed objects
interface ParsedTuyaBulb
  extends Omit<TuyaBulb, "colour_data_v2" | "scene_data_v2"> {
  colour_data_v2: LightColor;
  scene_data_v2: LightScenes;
}

// Lock Types
interface UnlockRecord {
  timestamp: number;
  method: "app" | "manual" | "fingerprint" | "code" | "card";
  user_id?: string;
  success: boolean;
}

// Main Tuya Lock state
interface TuyaLock {
  switch_state: boolean; // Lock/unlock status
  alarm_state: boolean; // Whether alarm is triggered
  battery_percentage: number; // Battery level (0-100)
  child_lock: boolean; // Child lock status
  tamper_alert: boolean; // Tamper detection
  auto_lock_time: number; // Auto lock after X seconds
  unlock_records: string; // JSON string with unlock records
  wrong_attempts: number; // Failed unlock attempts
  low_power: boolean; // Low battery indicator
  door_state?: "closed" | "open"; // Door state if sensor present
}

// Parsed lock with typed objects
interface ParsedTuyaLock extends Omit<TuyaLock, "unlock_records"> {
  unlock_records: UnlockRecord[]; // Parsed array of records
}

// Thermostat Types
interface ThermostatSchedulePeriod {
  start_time: string; // HH:MM format
  temp: number; // Temperature setting
  mode: "heat" | "cool" | "auto" | "off"; // Mode for this period
}

interface ThermostatScheduleDay {
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Monday, 6 = Sunday
  periods: ThermostatSchedulePeriod[];
}

// Main Tuya Thermostat state
interface TuyaThermostat {
  power_state: boolean; // On/off status
  current_temp: number; // Current temperature (in selected unit)
  target_temp: number; // Target temperature (in selected unit)
  temp_unit: "c" | "f"; // Celsius or Fahrenheit
  mode: "heat" | "cool" | "auto" | "fan"; // Operating mode
  preset: "home" | "away" | "eco" | "sleep"; // Preset modes
  humidity?: number; // Current humidity if supported
  fan_speed?: "auto" | "low" | "medium" | "high"; // Fan speed
  lock_status: boolean; // Control lock status
  schedule: string; // JSON string with schedule
  window_detection: boolean; // Open window detection
  eco_temp?: number; // Eco mode temperature
  away_temp?: number; // Away mode temperature
}

// Parsed thermostat with typed objects
interface ParsedTuyaThermostat extends Omit<TuyaThermostat, "schedule"> {
  schedule: ThermostatScheduleDay[]; // Parsed schedule
}

// Tuya device response type
type TuyaResponse = TuyaDeviceItem[];

// Tuya bulb utilities
class TuyaBulbUtils {
  static parseColor(colorString: string): LightColor {
    try {
      return JSON.parse(colorString) as LightColor;
    } catch (error) {
      console.error("Failed to parse color:", error);
      return { h: 0, s: 0, v: 0 };
    }
  }

  static parseScenes(sceneString: string): LightScenes {
    try {
      return JSON.parse(sceneString) as LightScenes;
    } catch (error) {
      console.error("Failed to parse scenes:", error);
      return { scene_num: 0, scene_units: [] };
    }
  }

  static fromTuyaResponse(response: TuyaResponse): TuyaBulb {
    const bulb = {} as TuyaBulb;

    response.forEach((item) => {
      (bulb as any)[item.code] = item.value;
    });

    return bulb;
  }

  static parseBulb(bulb: TuyaBulb): ParsedTuyaBulb {
    return {
      ...bulb,
      colour_data_v2: this.parseColor(bulb.colour_data_v2),
      scene_data_v2: this.parseScenes(bulb.scene_data_v2),
    };
  }
}

// Tuya Lock utilities
class TuyaLockUtils {
  static parseUnlockRecords(recordsString: string): UnlockRecord[] {
    try {
      return JSON.parse(recordsString) as UnlockRecord[];
    } catch (error) {
      console.error("Failed to parse unlock records:", error);
      return [];
    }
  }

  static fromTuyaResponse(response: TuyaResponse): TuyaLock {
    const lock = {} as TuyaLock;
    response.forEach((item) => {
      (lock as any)[item.code] = item.value;
    });
    return lock;
  }

  static parseLock(lock: TuyaLock): ParsedTuyaLock {
    return {
      ...lock,
      unlock_records: this.parseUnlockRecords(lock.unlock_records),
    };
  }
}

// Tuya Thermostat utilities
class TuyaThermostatUtils {
  static parseSchedule(scheduleString: string): ThermostatScheduleDay[] {
    try {
      return JSON.parse(scheduleString) as ThermostatScheduleDay[];
    } catch (error) {
      console.error("Failed to parse thermostat schedule:", error);
      return [];
    }
  }

  static fromTuyaResponse(response: TuyaResponse): TuyaThermostat {
    const thermostat = {} as TuyaThermostat;
    response.forEach((item) => {
      (thermostat as any)[item.code] = item.value;
    });
    return thermostat;
  }

  static parseThermostat(thermostat: TuyaThermostat): ParsedTuyaThermostat {
    return {
      ...thermostat,
      schedule: this.parseSchedule(thermostat.schedule),
    };
  }

  // Helper to convert between C and F
  static convertTemperature(temp: number, toUnit: "c" | "f"): number {
    if (toUnit === "c") {
      return (temp - 32) * (5 / 9); // F to C
    } else {
      return temp * (9 / 5) + 32; // C to F
    }
  }
}

// Export all interfaces and utilities
export type {
  TuyaDeviceItem,
  TuyaResponse,
  LightColor,
  LightScene,
  LightScenes,
  TuyaBulb,
  ParsedTuyaBulb,
  // New exports
  TuyaLock,
  ParsedTuyaLock,
  UnlockRecord,
  TuyaThermostat,
  ParsedTuyaThermostat,
  ThermostatScheduleDay,
  ThermostatSchedulePeriod,
};

export { TuyaBulbUtils, TuyaLockUtils, TuyaThermostatUtils };
