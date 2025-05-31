// Device Category Types
export type DeviceCategory = 'dj' | 'ktkzq' | 'mc';

export interface Location {
  _id: string;
  name: string;
  description?: string;
  floor?: string;
  organization: string;
  createdBy: string;
  createdAt: Date;
}

// Base Device Interface
export interface BaseDevice {
  _id: string;
  name: string;
  status: 'online' | 'offline';
  location: string;
  categoryCode: DeviceCategory;
  isOn: boolean;
}

// Light Device (dj category)
export interface LightDevice extends BaseDevice {
  categoryCode: 'dj';
  brightness?: number;
  brightnessV2?: number;
  temperature?: number;
  temperatureV2?: number;
  workMode?: 'white' | 'colour' | 'scene' | 'music' | 'scene_1' | 'scene_2' | 'scene_3' | 'scene_4';
  colorCode?: string;
  sceneSelect?: '1' | '2' | '3' | '4' | '5';
  doNotDisturb?: boolean;
  countdown?: number;
  switchHealthRead?: boolean;
  readTime?: number;
  restTime?: number;
}

// AC Device (ktkzq category)
export interface ACDevice extends BaseDevice {
  categoryCode: 'ktkzq';
  temperature: number;
  mode?: 'hot' | 'cold' | 'wet' | 'wind';
  fanSpeed?: 'level_1' | 'level_2' | 'level_3' | 'level_4';
  windspeed?: '1' | '2' | '3' | '4' | '5' | '6';
  childLock?: boolean;
  currentTemperature?: number;
  countdownSet?: string;
  countdownLeft?: number;
}

// Lock Device (mc category)
export interface LockDevice extends BaseDevice {
  categoryCode: 'mc';
  lockStatus?: 'open' | 'stop' | 'close';
  lockState?: 'opened' | 'closed';
  antiTheft?: boolean;
  mode?: 'morning' | 'night';
  percentControl?: number;
  percentState?: number;
  residualElectricity?: number;
  chargeSwitch?: boolean;
  closeReminder?: boolean;
  countdownSet?: 'cancel' | '1h' | '2h' | '3h' | '4h';
  countdown?: 'cancel' | '1' | '2' | '3' | '4' | '5' | '6';
  countdownLeft?: number;
  autoPower?: boolean;
}

// Union type for all device types
export type Device = LightDevice | ACDevice | LockDevice;

// Device Function Types
export interface DeviceFunction {
  code: string;
  type: 'Boolean' | 'Integer' | 'Enum' | 'Json' | 'Raw';
  values: any;
}

// Device category specs based on the provided JSON
export interface DeviceCategorySpec {
  category: DeviceCategory;
  functions: DeviceFunction[];
  status: DeviceFunction[];
}

// Map category codes to human-readable names and component types
export const categoryComponentMap: Record<DeviceCategory, string> = {
  'dj': 'bulb',    // Light devices
  'ktkzq': 'ac',   // AC devices
  'mc': 'lock',    // Lock devices
};
