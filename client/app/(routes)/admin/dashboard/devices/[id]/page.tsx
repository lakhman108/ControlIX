"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Power, Settings2, Thermometer } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";

// Sample device data (replace with your API data)
const deviceData = {
  id: "dev1",
  name: "Living Location Light",
  type: "bulb",
  status: "online",
  location: "Living Location",
  isOn: true,
  brightness: 80,
  temperature: 24,
};

export default function DeviceControlPage() {
  const params = useParams();
  const [device, setDevice] = useState(deviceData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch device data using params.id
    // Replace with your API call
    setIsLoading(false);
  }, [params.id]);

  const togglePower = () => {
    setDevice((prev) => ({ ...prev, isOn: !prev.isOn }));
    // Add your API call here
  };

  const updateBrightness = (value: number[]) => {
    setDevice((prev) => ({ ...prev, brightness: value[0] }));
    // Add your API call here
  };

  const updateTemperature = (value: number[]) => {
    setDevice((prev) => ({ ...prev, temperature: value[0] }));
    // Add your API call here
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/devices">
          <button className="btn btn-ghost btn-sm btn-circle">
            <ArrowLeft className="h-4 w-4" />
          </button>
        </Link>
        <h1 className="text-3xl font-bold">{device.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Device Info</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="opacity-70">Status</span>
                <div
                  className={`badge ${
                    device.status === "online"
                      ? "badge-success"
                      : "badge-error"
                  } badge-sm capitalize`}
                >
                  {device.status}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-70">Type</span>
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  <span className="capitalize">{device.type}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-70">Location</span>
                <span>{device.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Controls</h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-lg">Power</span>
                <button
                  className={`btn ${
                    device.isOn ? "btn-error" : "btn-success"
                  } btn-circle`}
                  onClick={togglePower}
                >
                  <Power className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm opacity-70">Brightness</label>
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={[device.brightness]}
                  max={100}
                  step={1}
                  onValueChange={updateBrightness}
                >
                  <Slider.Track className="bg-base-300 relative grow rounded-full h-2">
                    <Slider.Range className="absolute bg-primary rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-5 h-5 bg-primary rounded-full focus:outline-none" />
                </Slider.Root>
                <div className="text-right text-sm">{device.brightness}%</div>
              </div>

              {device.type === "ac" && (
                <div className="space-y-2">
                  <label className="text-sm opacity-70">Temperature</label>
                  <div className="flex items-center gap-4">
                    <Thermometer className="h-5 w-5" />
                    <Slider.Root
                      className="relative flex items-center select-none touch-none w-full h-5"
                      value={[device.temperature]}
                      min={16}
                      max={30}
                      step={1}
                      onValueChange={updateTemperature}
                    >
                      <Slider.Track className="bg-base-300 relative grow rounded-full h-2">
                        <Slider.Range className="absolute bg-primary rounded-full h-full" />
                      </Slider.Track>
                      <Slider.Thumb className="block w-5 h-5 bg-primary rounded-full focus:outline-none" />
                    </Slider.Root>
                    <span className="text-sm">{device.temperature}°C</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 