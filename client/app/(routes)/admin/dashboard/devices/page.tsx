"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Select from "@radix-ui/react-select";
import {
  ChevronDown,
  ChevronUp,
  Check,
  PlusCircle,
  Power,
  DoorClosed,
  Lightbulb,
  Snowflake,
  Lock,
  Fan,
  SwitchCamera,
  Thermometer,
  Waves,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample device data (replace with your API data)
const devices = [
  {
    id: "dev1",
    name: "Living Location Light",
    type: "bulb",
    status: "online",
    location: "Living Location",
    isOn: true,
  },
  {
    id: "dev2",
    name: "Bedroom AC",
    type: "ac",
    status: "offline",
    location: "Master Bedroom",
    isOn: false,
  },
  {
    id: "dev3",
    name: "Main Door Lock",
    type: "lock",
    status: "online",
    location: "Entrance",
    isOn: true,
  },
  {
    id: "dev4",
    name: "Kitchen Light",
    type: "bulb",
    status: "online",
    location: "Kitchen",
    isOn: true,
  },
  {
    id: "dev5",
    name: "Hallway Motion Sensor",
    type: "sensor",
    status: "offline",
    location: "Hallway",
    isOn: false,
  },
  {
    id: "dev6",
    name: "Garage Door",
    type: "lock",
    status: "online",
    location: "Garage",
    isOn: false,
  },
  {
    id: "dev7",
    name: "Balcony Fan",
    type: "fan",
    status: "offline",
    location: "Balcony",
    isOn: false,
  },
  {
    id: "dev8",
    name: "Study Location Heater",
    type: "heater",
    status: "online",
    location: "Study Location",
    isOn: true,
  },
  {
    id: "dev9",
    name: "Bathroom Exhaust",
    type: "fan",
    status: "online",
    location: "Bathroom",
    isOn: true,
  },
  {
    id: "dev10",
    name: "Dining Table Light",
    type: "bulb",
    status: "offline",
    location: "Dining Location",
    isOn: false,
  },
];


const deviceTypeIcons: Record<string, React.ReactElement> = {
  bulb: <Lightbulb className="h-5 w-5" />,
  ac: <Snowflake className="h-5 w-5" />,
  lock: <Lock className="h-5 w-5" />,
  fan: <Fan className="h-5 w-5" />,
  switch: <SwitchCamera className="h-5 w-5" />,
  sensor: <Waves className="h-5 w-5" />,
  heater: <Thermometer className="h-5 w-5" />,
};

export default function DevicesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDevices = devices.filter((device) => {
    const matchesFilter = filter === "all" || device.status === filter;
    const matchesSearch = device.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });



  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Devices</h1>
        <Button>
          <PlusCircle className="h-4 w-4" />
          <Link
            href="/dashboard/devices/new"
          >
            Add Device
          </Link>
        </Button>
      </div>

      {/* Updated search and filter section to be fully responsive */}
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative w-full md:col-span-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search rooms..."
            className="input input-bordered w-full !pl-10 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full">
          <Select.Root value={filter} onValueChange={setFilter}>
            <Select.Trigger className="w-full h-full px-3 py-2 bg-white rounded-md border border-gray-300 shadow-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-black focus:border-black">
              <Select.Value placeholder="Select device type" />
              <Select.Icon>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content className="bg-white rounded-md border border-gray-200 shadow-lg z-50">
                <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                  <ChevronUp className="h-4 w-4" />
                </Select.ScrollUpButton>
                <Select.Viewport className="p-1">
                  {["all", "online", "offline"].map((status) => (
                    <Select.Item
                      key={status}
                      value={status}
                      className="px-3 py-2 rounded-md text-gray-800 focus:bg-blue-50 outline-none cursor-pointer flex items-center hover:bg-gray-50"
                    >
                      <Select.ItemText>{status}</Select.ItemText>
                      <Select.ItemIndicator className="ml-auto">
                        <Check className="h-4 w-4 text-gray-600" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
                <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                  <ChevronDown className="h-4 w-4" />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((device) => (
          <div
            key={device.id}
            className="w-full card bg-base-100 shadow-md hover:shadow-lg transition-all rounded-lg cursor-pointer border border-base-300"
            onClick={() => router.push(`/dashboard/devices/${device.id}`)}
          >
            <div className="card-body space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="card-title text-lg font-semibold">{device.name}</h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <DoorClosed className="h-4 w-4" />
                    {device.location}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`h-2 w-2 rounded-full ${device.status === "online" ? "bg-green-500" : "bg-gray-400"}`} />
                  <span className="capitalize text-muted-foreground">{device.status}</span>
                </div>
              </div>

              <div className="divider my-1" />

              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  {deviceTypeIcons[device.type]}
                  <span className="capitalize">{device.type}</span>
                </div>
                <Power
                  className={`h-5 w-5 ${device.isOn ? "text-success" : ""}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-10 space-y-2">
          <span className="text-6xl">🕵️‍♂️</span>
          <p className="text-lg text-muted-foreground">No devices found matching your search</p>
        </div>
      )}
    </div>

  );
} 