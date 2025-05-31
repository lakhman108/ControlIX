"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Power,
  PlusCircle,
  Lightbulb,
  Snowflake,
  Lock,
  Fan,
  SwitchCamera,
  Thermometer,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

// Sample location data (replace with your API data)
const roomData = {
  id: "room1",
  name: "Living Location",
  floor: "Ground Floor",
  description: "Spacious area for relaxing and entertainment.",
  devices: [
    {
      id: "dev1",
      name: "Living Room Light",
      type: "bulb",
      status: "online",
      isOn: true,
    },
    {
      id: "dev3",
      name: "Main Door Lock",
      type: "lock",
      status: "online",
      isOn: true,
    },
    {
      id: "dev10",
      name: "Dining Table Light",
      type: "bulb",
      status: "offline",
      isOn: false,
    },
  ],
}
const deviceTypeIcons: Record<string, React.ReactElement> = {
  bulb: <Lightbulb className="h-5 w-5" />,
  ac: <Snowflake className="h-5 w-5" />,
  lock: <Lock className="h-5 w-5" />,
  fan: <Fan className="h-5 w-5" />,
  switch: <SwitchCamera className="h-5 w-5" />,
  sensor: <Waves className="h-5 w-5" />,
  heater: <Thermometer className="h-5 w-5" />,
};


export default function RoomDetailPage() {
  const router = useRouter();
  const params = useParams();
  // const [location, setRoom] = useState(roomData);
  const [isLoading, setIsLoading] = useState(true);
  const location = roomData; // Replace with your API data
  useEffect(() => {
    // Fetch location data using params.id
    // Replace with your API call
    setIsLoading(false);
  }, [params.id]);

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
        <Link href="/dashboard/locations">
          <button className="btn btn-ghost btn-sm btn-circle">
            <ArrowLeft className="h-4 w-4" />
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{location.name}</h1>
          <p className="text-sm opacity-70">{location.floor}</p>
        </div>
        <Link href="/dashboard/devices/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Device
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-200 shadow-xl md:col-span-2">
          <div className="card-body">
            <h2 className="card-title">Devices</h2>
            <div className="divide-y">
              {location.devices.map((device) => (
                <div
                  key={device.id}
                  className="py-4 cursor-pointer hover:bg-base-300 rounded-lg px-4 -mx-4"
                  onClick={() => router.push(`/dashboard/devices/${device.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {deviceTypeIcons[device.type]}
                      </div>
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-sm opacity-70 capitalize">{device.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className={`h-2 w-2 rounded-full ${device.status === "online" ? "bg-green-500" : "bg-gray-400"}`} />
                        <span className="capitalize text-muted-foreground">{device.status}</span>
                      </div>
                      <Power
                        className={`h-5 w-5 ${device.isOn ? "text-success" : "text-error"
                          }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Location Info</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm opacity-70">Floor</label>
                <p>{location.floor}</p>
              </div>
              <div>
                <label className="text-sm opacity-70">Total Devices</label>
                <p>{location.devices.length}</p>
              </div>
              <div>
                <label className="text-sm opacity-70">Active Devices</label>
                <p>{location.devices.filter((d) => d.status === "online").length}</p>
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