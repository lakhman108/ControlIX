"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Search,
  DoorClosed,
  Power,
  Settings2,
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


// Sample locations data (replace with your API data)
const locations = [
  {
    id: "room1",
    name: "Living Room",
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
  },
  {
    id: "room2",
    name: "Master Bedroom",
    floor: "First Floor",
    description: "Comfortable room with air conditioning and great lighting.",
    devices: [
      {
        id: "dev2",
        name: "Bedroom AC",
        type: "ac",
        status: "offline",
        isOn: false,
      },
      {
        id: "dev8",
        name: "Study Room Heater",
        type: "heater",
        status: "online",
        isOn: true,
      },
    ],
  },
  {
    id: "room3",
    name: "Entrance",
    floor: "Ground Floor",
    description: "Main entrance with a smart door lock system.",
    devices: [
      {
        id: "dev3",
        name: "Main Door Lock",
        type: "lock",
        status: "online",
        isOn: true,
      },
      {
        id: "dev5",
        name: "Hallway Motion Sensor",
        type: "sensor",
        status: "offline",
        isOn: false,
      },
    ],
  },
  {
    id: "room4",
    name: "Kitchen",
    floor: "Ground Floor",
    description: "Well-lit kitchen for cooking and dining preparation.",
    devices: [
      {
        id: "dev4",
        name: "Kitchen Light",
        type: "bulb",
        status: "online",
        isOn: true,
      },
      {
        id: "dev9",
        name: "Bathroom Exhaust",
        type: "fan",
        status: "online",
        isOn: true,
      },
    ],
  },
  {
    id: "room5",
    name: "Hallway",
    floor: "Ground Floor",
    description: "Passage area monitored by motion sensors.",
    devices: [
      {
        id: "dev5",
        name: "Hallway Motion Sensor",
        type: "sensor",
        status: "offline",
        isOn: false,
      },
      {
        id: "dev1",
        name: "Living Room Light",
        type: "bulb",
        status: "online",
        isOn: true,
      },
    ],
  },
  {
    id: "room6",
    name: "Garage",
    floor: "Basement",
    description: "Vehicle parking with smart lock system.",
    devices: [
      {
        id: "dev6",
        name: "Garage Door",
        type: "lock",
        status: "online",
        isOn: false,
      },
      {
        id: "dev7",
        name: "Balcony Fan",
        type: "fan",
        status: "offline",
        isOn: false,
      },
    ],
  },
  {
    id: "room7",
    name: "Balcony",
    floor: "First Floor",
    description: "Outdoor space with ceiling fan.",
    devices: [
      {
        id: "dev7",
        name: "Balcony Fan",
        type: "fan",
        status: "offline",
        isOn: false,
      },
      {
        id: "dev4",
        name: "Kitchen Light",
        type: "bulb",
        status: "online",
        isOn: true,
      },
    ],
  },
  {
    id: "room8",
    name: "Study Room",
    floor: "First Floor",
    description: "Warm and quiet area ideal for working or reading.",
    devices: [
      {
        id: "dev8",
        name: "Study Room Heater",
        type: "heater",
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
  },
  {
    id: "room9",
    name: "Bathroom",
    floor: "First Floor",
    description: "Modern bathroom with exhaust ventilation.",
    devices: [
      {
        id: "dev9",
        name: "Bathroom Exhaust",
        type: "fan",
        status: "online",
        isOn: true,
      },
      {
        id: "dev2",
        name: "Bedroom AC",
        type: "ac",
        status: "offline",
        isOn: false,
      },
    ],
  },
  {
    id: "room10",
    name: "Dining Room",
    floor: "Ground Floor",
    description: "Dining area for family meals and gatherings.",
    devices: [
      {
        id: "dev10",
        name: "Dining Table Light",
        type: "bulb",
        status: "offline",
        isOn: false,
      },
      {
        id: "dev6",
        name: "Garage Door",
        type: "lock",
        status: "online",
        isOn: false,
      },
    ],
  },
];

const deviceTypeIcons: Record<string, React.ReactElement> = {
  bulb: <Lightbulb className="h-3 w-3" />,
  ac: <Snowflake className="h-3 w-3" />,
  lock: <Lock className="h-3 w-3" />,
  fan: <Fan className="h-3 w-3" />,
  switch: <SwitchCamera className="h-3 w-3" />,
  sensor: <Waves className="h-3 w-3" />,
  heater: <Thermometer className="h-3 w-3" />,
};



export default function RoomsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = locations.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Locations</h1>
        <Link href="/dashboard/locations/new">
          <Button>
            <PlusCircle className="h-4 w-4" />
            Add Location
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search locations..."
            className="input input-bordered w-full !pl-10 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((location) => (
          <div
            key={location.id}
            className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
            onClick={() => router.push(`/dashboard/locations/${location.id}`)}
          >
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all rounded-lg cursor-pointer border border-base-300">
              <div className="card-body space-y-3 !min-h-[292px]">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title text-lg font-semibold">{location.name}</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Settings2 className="h-4 w-4" />
                      {location.devices.length} {location.devices.length === 1 ? 'device' : 'devices'}
                    </p>
                  </div>
                  <DoorClosed className="h-5 w-5 text-primary" />
                </div>

                <div className="divider my-1" />

                {/* Active Devices Section - Moved to the top and aligned left */}
                <div className="flex items-center gap-2 text-sm text-success font-medium bg-success/10 px-3 py-1 rounded-full w-fit">
                  <Power className="h-4 w-4" />
                  {location.devices.filter((d) => d.status === "online").length} Active Devices
                </div>

                <div className="space-y-1 mt-2">
                  <div className="flex flex-wrap gap-2">
                    {location.devices.slice(0, 3).map((device) => (
                      <div key={device.id} className="badge badge-outline gap-1 text-xs">
                        {deviceTypeIcons[device.type]}
                        {device.name}
                      </div>
                    ))}
                    {location.devices.length > 3 && (
                      <div className="badge badge-outline text-xs">+{location.devices.length - 3}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-10 space-y-2">
          <span className="text-6xl">🕵️‍♂️</span>
          <p className="text-lg text-muted-foreground">No locations found matching your search</p>
        </div>
      )}
    </div>
  );
} 