import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Device, LightDevice, ACDevice, LockDevice } from '../../_types/device';

// Define the state structure
interface DeviceState {
  devices: Device[];
  selectedDevice: Device | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: DeviceState = {
  devices: [],
  selectedDevice: null,
  isLoading: false,
  error: null
};

// Helper function to update a device in the devices array
// const updateDeviceInArray = (devices: Device[], updatedDevice: Device): Device[] => {
//   return devices.map(device =>
//     device.id === updatedDevice.id ? updatedDevice : device
//   );
// };

// Create the device slice
const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    // Set all devices
    setDevices: (state, action: PayloadAction<Device[]>) => {
      state.devices = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Set the selected device
    setSelectedDevice: (state, action: PayloadAction<Device>) => {
      state.selectedDevice = action.payload;
    },

    // Clear the selected device
    clearSelectedDevice: (state) => {
      state.selectedDevice = null;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Toggle device power
    toggleDevicePower: (state, action: PayloadAction<string>) => {
      const deviceId = action.payload;

      // Update the selected device if it matches
      if (state.selectedDevice && state.selectedDevice.id === deviceId) {
        state.selectedDevice = {
          ...state.selectedDevice,
          isOn: !state.selectedDevice.isOn
        };
      }

      // Update device in the devices array
      state.devices = state.devices.map(device => {
        if (device.id === deviceId) {
          return { ...device, isOn: !device.isOn };
        }
        return device;
      });
    },

    // Update light device
    updateLightDevice: (state, action: PayloadAction<Partial<LightDevice> & { id: string }>) => {
      const updatedDevice = action.payload;

      // Update the selected device if it matches
      if (state.selectedDevice && state.selectedDevice.id === updatedDevice.id) {
        state.selectedDevice = {
          ...state.selectedDevice,
          ...updatedDevice
        } as Device;
      }

      // Update device in the devices array
      state.devices = state.devices.map(device => {
        if (device.id === updatedDevice.id) {
          return { ...device, ...updatedDevice } as Device;
        }
        return device;
      });
    },

    // Update AC device
    updateACDevice: (state, action: PayloadAction<Partial<ACDevice> & { id: string }>) => {
      const updatedDevice = action.payload;

      // Update the selected device if it matches
      if (state.selectedDevice && state.selectedDevice.id === updatedDevice.id) {
        state.selectedDevice = {
          ...state.selectedDevice,
          ...updatedDevice
        } as Device;
      }

      // Update device in the devices array
      state.devices = state.devices.map(device => {
        if (device.id === updatedDevice.id) {
          return { ...device, ...updatedDevice } as Device;
        }
        return device;
      });
    },

    // Update lock device
    updateLockDevice: (state, action: PayloadAction<Partial<LockDevice> & { id: string }>) => {
      const updatedDevice = action.payload;

      // Update the selected device if it matches
      if (state.selectedDevice && state.selectedDevice.id === updatedDevice.id) {
        state.selectedDevice = {
          ...state.selectedDevice,
          ...updatedDevice
        } as Device;
      }

      // Update device in the devices array
      state.devices = state.devices.map(device => {
        if (device.id === updatedDevice.id) {
          return { ...device, ...updatedDevice } as Device;
        }
        return device;
      });
    },

    // Delete device
    deleteDevice: (state, action: PayloadAction<string>) => {
      const deviceId = action.payload;

      // Remove device from devices array
      state.devices = state.devices.filter(device => device.id !== deviceId);

      // Clear selected device if it was the deleted one
      if (state.selectedDevice && state.selectedDevice.id === deviceId) {
        state.selectedDevice = null;
      }
    },

    // Add device
    addDevice: (state, action: PayloadAction<Device>) => {
      state.devices.push(action.payload);
    },

    // Update device (generic update for any device type)
    updateDevice: (state, action: PayloadAction<Partial<Device> & { id: string }>) => {
      const updatedDevice = action.payload;

      // Update the selected device if it matches
      if (state.selectedDevice && state.selectedDevice.id === updatedDevice.id) {
        state.selectedDevice = {
          ...state.selectedDevice,
          ...updatedDevice
        } as Device;
      }

      // Update device in the devices array
      state.devices = state.devices.map(device => {
        if (device.id === updatedDevice.id) {
          return { ...device, ...updatedDevice } as Device;
        }
        return device;
      });
    }
  }
});

// Export actions and reducer
export const {
  setDevices,
  setSelectedDevice,
  clearSelectedDevice,
  setLoading,
  setError,
  toggleDevicePower,
  updateLightDevice,
  updateACDevice,
  updateLockDevice,
  deleteDevice,
  addDevice,
  updateDevice
} = deviceSlice.actions;

export default deviceSlice.reducer;
