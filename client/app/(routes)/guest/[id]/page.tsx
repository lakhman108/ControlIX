"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import Link from "next/link";
// Import device-specific controls
import { ACControls } from "./_components/controls/ACControls";
import { BulbControls } from "./_components/controls/BulbControls";
import { LockControls } from "./_components/controls/LockControls";
import { ArrowLeft, Settings2,  } from "lucide-react";
// import * as Slider from "@radix-ui/react-slider";
// Import Redux actions
import {
  setSelectedDevice,
  toggleDevicePower
} from "@/app/_lib/slices/deviceSlice";

// Import device types
import {
  Device,
  DeviceCategory,
  categoryComponentMap
} from "@/app/_types/device";

// Mock device data for demo purposes
const SAMPLE_DEVICES = [
  {
    id: "dev1",
    name: "Living Room Light",
    status: "online",
    location: "Living Room",
    categoryCode: "dj",
    isOn: true,
    brightness: 80,
    brightnessV2: 800,
    temperature: 127,
    temperatureV2: 500,
    workMode: "white",
    colorCode: "#ffffff"
  },
  {
    id: "dev2",
    name: "Bedroom AC",
    status: "online",
    location: "Bedroom",
    categoryCode: "ktkzq",
    isOn: true,
    temperature: 24,
    mode: "cold",
    fanSpeed: "level_2",
    currentTemperature: 26,
    childLock: false,
    countdownSet: "cancel"
  },
  {
    id: "dev3",
    name: "Front Door Lock",
    status: "online",
    location: "Entrance",
    categoryCode: "mc",
    isOn: true,
    lockStatus: "close",

    percentControl: 0,
    percentState: 0,
    residualElectricity: 75,
    antiTheft: true,
    mode: "morning"
  }
];


// Sample device data (replace with your API data)
// const _deviceData = {
//   id: "dev1",
//   name: "Living Location Light",
//   type: "bulb",
//   status: "online",
//   location: "Living Location",
//   isOn: true,
//   brightness: 80,
//   temperature: 24,
// };


export default function DeviceControlPage() {
//   const locationId = "6821ea93aee0eb977109f209";
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  // Get category code from URL
  const categoryCode = searchParams.get("code") || "";
  const deviceId = params.id as string;

  // Determine device type from category code
  const deviceType = categoryCode && categoryCode in categoryComponentMap
    ? categoryComponentMap[categoryCode as DeviceCategory]
    : "unknown";

  // Local state to manage device data before Redux integration is complete
  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch device data (mock implementation)
    const fetchDeviceData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be an API call
        // For demo, we'll use our sample data
        const foundDevice = SAMPLE_DEVICES.find(d => d.id === deviceId);

        if (foundDevice) {
          setDevice(foundDevice as Device);
          dispatch(setSelectedDevice(foundDevice as Device));
        } else {
          // If device not found, create placeholder
          const placeholder = {
            id: deviceId,
            name: `Device ${deviceId}`,
            status: "offline",
            location: "Unknown",
            categoryCode: categoryCode as DeviceCategory || "dj",
            isOn: false,
          } as Device;

          setDevice(placeholder);
          dispatch(setSelectedDevice(placeholder));
        }
      } catch (error) {
        console.error("Error fetching device:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeviceData();
  }, [deviceId, categoryCode, dispatch]);

  // Handle device power toggle
  const togglePower = () => {
    if (device) {
      dispatch(toggleDevicePower(device.id));
      setDevice(prev => prev ? { ...prev, isOn: !prev.isOn } : null);
    }
  };

  // Generic handler for device changes
  const handleDeviceChange = (updatedDevice: Device) => {
    setDevice(updatedDevice);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Device Not Found</h2>
            <p>The device you are looking for does not exist or is unavailable.</p>
            <div className="card-actions justify-end mt-4">
              <Link href="/dashboard/devices">
                <button className="btn btn-primary">Go Back</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render device-specific controls based on category code
  const renderDeviceControls = () => {
    switch (deviceType) {
      case "bulb":
        return (
          <BulbControls
            device={device}
            onChange={handleDeviceChange}
            togglePower={togglePower}
          />
        );
      case "ac":
        return (
          <ACControls
            device={device}
            onChange={handleDeviceChange}
            togglePower={togglePower}
          />
        );
      case "lock":
        return (
          <LockControls
            device={device}
            onChange={handleDeviceChange}
            togglePower={togglePower}
          />
        );
      default:
        return (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Unsupported Device</h2>
              <p>This device type is not currently supported.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <Link href="/guest">
          <button className="btn btn-ghost btn-sm btn-circle">
            <ArrowLeft className="h-4 w-4" />
          </button>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold">{device.name}</h1>
        <div
          className={`badge ${
            device.status === "online" ? "badge-success" : "badge-error"
          } badge-sm capitalize self-start sm:self-auto`}
        >
          {device.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Device info card - takes 1/3 of space on large screens */}
        <div className="lg:col-span-4">
          <div className="card bg-base-200 shadow-xl h-full">
            <div className="card-body">
              <h2 className="card-title">Device Info</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="opacity-70">Type</span>
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4" />
                    <span className="capitalize">{deviceType}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-70">Room</span>
                  <span>{device.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-70">Category</span>
                  <span className="badge badge-primary badge-sm">{device.categoryCode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-70">Power</span>
                  <span className={`badge ${device.isOn ? 'badge-success' : 'badge-error'}`}>
                    {device.isOn ? 'On' : 'Off'}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-70">Location</span>
                <span>{device.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Device controls - takes 2/3 of space on large screens */}
        <div className="lg:col-span-8">
          {renderDeviceControls()}
        </div>
      </div>
    </div>
  );
}
