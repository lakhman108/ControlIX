"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Power, Settings2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getDeviceStates,
  getDeviceCurrentStatus,
  controlDevice,
} from "@/app/_lib/backendApi";

interface Device {
  id: string;
  name: string;
  deviceType: string;
  deviceId: string;
  isOnline?: boolean;
  isOn?: boolean; // This will now be based on the "switch_led" value
  currentStatus?: any;
  categoryCode?: string; // Added for category code
}

interface Location {
  _id: string;
  name: string;
  floor?: string;
  description?: string;
  devices: Device[];
}

export default function GuestHomePage() {
  const router = useRouter();
//   const searchParams = useSearchParams();
//   const token = searchParams.get('token');

  // Static location ID - in a real implementation, you would extract this from the token
  const locationId = "6821ea93aee0eb977109f209";

  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingCurrentStatus, setIsFetchingCurrentStatus] = useState(false);
  const [loadingDevices, setLoadingDevices] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // In a real implementation, you would verify the token on the server
        // and retrieve the data only if the token is valid
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}location/${locationId}`,
          { credentials: "include" }
        );
        const data = await response.json();
        setLocation(data.location);

        // Fetch states for all devices if devices exist
        if (data.location.devices && data.location.devices.length > 0) {
          const deviceIds = data.location.devices.map(
            (device: Device) => device.deviceId
          );

          fetchDeviceStates(deviceIds);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        toast.error("Failed to fetch location details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const fetchDeviceStates = async (deviceIds: string[]) => {
    try {
      if (deviceIds.length === 0) return; // Avoid unnecessary requests if no devices exist

      // Fetch device states
      const stateResponses = await getDeviceStates(deviceIds);

      // Filter devices that are online
      const onlineDevices = stateResponses.devices.filter(
        (device: any) => device.status === "online"
      );

      if (onlineDevices.length > 0) {
        // Fetch current status for online devices
        setIsFetchingCurrentStatus(true);
        const onlineDeviceIds = onlineDevices.map(
          (device: any) => device.deviceId
        );
        const currentStatusResponses =
          await getDeviceCurrentStatus(onlineDeviceIds);

        // Update location state with device states and current statuses
        setLocation((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            devices: prev.devices.map((device) => {
              const state = stateResponses.devices.find(
                (d: any) => d.deviceId === device.deviceId
              );
              const currentStatus = currentStatusResponses.devices?.find(
                (d: any) => d.deviceId === device.deviceId
              );
              const switchLedStatus = currentStatus?.currentStatus?.find(
                (status: any) => status.code === "switch_led"
              );

              return state
                ? {
                    ...device,
                    isOnline: state.status === "online",
                    isOn: switchLedStatus ? switchLedStatus.value : false, // Set isOn based on switch_led
                    currentStatus: currentStatus
                      ? currentStatus.currentStatus
                      : null,
                  }
                : device;
            }),
          };
        });
      } else {
        // If no devices are online, update the state with only the device states
        setLocation((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            devices: prev.devices.map((device) => {
              const state = stateResponses.devices.find(
                (d: any) => d.deviceId === device.deviceId
              );
              return state
                ? {
                    ...device,
                    isOnline: state.status === "online",
                    isOn: false,
                    currentStatus: null,
                  }
                : device;
            }),
          };
        });
      }
    } catch (error) {
      console.error("Error fetching device states or current statuses:", error);
      toast.error("Failed to fetch device states or current statuses");
    } finally {
      setIsFetchingCurrentStatus(false); // Stop loading animation for currentStatus
    }
  };

  const toggleDevice = async (device: Device) => {
    if (!device.isOnline) {
      toast.error("Device is offline");
      return;
    }

    const switchLedStatus = device.currentStatus?.find(
      (status: any) => status.code === "switch_led"
    );

    if (!switchLedStatus) {
      toast.error("Device does not support the switch_led command");
      return;
    }

    setLoadingDevices((prev) => ({ ...prev, [device.id]: true }));
    try {
      // Send the toggle command for "switch_led"
      const response = await controlDevice(device.deviceId, {
        code: "switch_led", // Command code
        value: !switchLedStatus.value, // Toggle the current value
      });

      if (response.success) {
        setLocation((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            devices: prev.devices.map((d) =>
              d.id === device.id
                ? {
                    ...d,
                    isOn: !d.isOn, // Update the isOn state
                    currentStatus: d.currentStatus.map((status: any) =>
                      status.code === "switch_led"
                        ? { ...status, value: !switchLedStatus.value }
                        : status
                    ),
                  }
                : d
            ),
          };
        });
        toast.success(
          `${device.name} turned ${!switchLedStatus.value ? "on" : "off"}`
        );
      } else {
        toast.error("Failed to control device");
      }
    } catch (error) {
      console.error("Error controlling device:", error);
      toast.error("Failed to control device");
    } finally {
      setLoadingDevices((prev) => ({ ...prev, [device.id]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Room Not Available</h2>
          <p className="text-muted-foreground mb-4">
            The room you're trying to access is not available or your access token is invalid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{location.name}</h1>
          {location.floor && (
            <p className="text-sm opacity-70">{location.floor}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-200 shadow-xl md:col-span-2">
          <div className="card-body">
            <h2 className="card-title">Devices</h2>
            {isFetchingCurrentStatus ? (
              <div className="flex items-center justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : location.devices.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No devices found in this room
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {location.devices.map((device) => (
                  <div
                    key={device.id}
                    className="py-4 cursor-pointer hover:bg-base-300 rounded-lg px-4 -mx-4"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center gap-3 flex-1"
                        onClick={() =>
                          router.push(`guest/${device.id}?code=${device?.categoryCode}`)
                        }
                      >
                        <Settings2 className="h-5 w-5" />
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-sm opacity-70 capitalize">
                            {device.deviceType}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="badge badge-outline badge-sm">
                          {device.deviceId}
                        </div>
                        <button
                          className={`btn btn-circle btn-sm ${
                            device.isOnline
                              ? device.isOn
                                ? "btn-success"
                                : "btn-error"
                              : "btn-ghost"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDevice(device);
                          }}
                          disabled={
                            !device.isOnline || loadingDevices[device.id]
                          }
                        >
                          {loadingDevices[device.id] ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <Power className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Room Info</h2>
            <div className="space-y-4">
              {location.floor && (
                <div>
                  <label className="text-sm opacity-70">Floor</label>
                  <p>{location.floor}</p>
                </div>
              )}
              <div>
                <label className="text-sm opacity-70">Total Devices</label>
                <p>{location.devices.length}</p>
              </div>
              {location.description && (
                <div>
                  <label className="text-sm opacity-70">Description</label>
                  <p>{location.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
