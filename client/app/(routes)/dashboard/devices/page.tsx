"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Select from "@radix-ui/react-select";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/app/_lib/store";
import { DeviceCard } from "./_components/DeviceCard";
import { toast } from "react-hot-toast";
import { Location } from "@/app/_types/device";

import { getDeviceStates } from "@/app/_lib/backendApi";

export interface TuyaDevice {
  deviceId: string;
  status: "online" | "offline" | "error";
  categoryCode?: string;
}
// ---------------- Interfaces ----------------
export interface Device {
  id: string;
  name: string;
  deviceId: string;
  deviceType:
    | "Smart Ac Controller"
    | "Smart Bulb"
    | "Smart Door Lock"
    | "Smart Plug"
    | "Smart Fan";
  description?: string;
  location: Location;
  organization: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  status: "online" | "offline";
  isOn: boolean;
  categoryCode: "dj" | "ktkzq" | "mc";
}

interface PaginatedResponse {
  devices: Device[];
  totalPages: number;
  currentPage: number;
  message: string;
}

// ---------------- Component ----------------

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tuyaDeviceState, setTuyaDeviceState] = useState<TuyaDevice[]>([]);
  const itemsPerPage = 10;

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const setStatus = (devices: Device[], tuyaDeviceState: any) => {
    const updateddevice = devices;

    for (let i = 0; i < devices.length; i++) {
      for (let j = 0; j < tuyaDeviceState.length; j++) {
        if (devices[i].deviceId == tuyaDeviceState[j].deviceId) {
          console.log(devices[i], tuyaDeviceState[j]);
          if (tuyaDeviceState[j].status === "online") {
            updateddevice[i].status = "online";
            break;
          }
        }
      }
    }
    setDevices(updateddevice);
  };
  const fetchtTuyaDeviceState = async (devices: Device[]) => {
    const deviceIds = [];
    for (let i = 0; i < devices.length; i++) {
      deviceIds.push(devices[i].deviceId);
    }
    const data = await getDeviceStates(deviceIds);

    setTuyaDeviceState(data);
    setStatus(devices, data.devices);
  };
  // API Fetch
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}device/organization/${userInfo?.organization}?page=${currentPage}&limit=${itemsPerPage}`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) throw new Error("Failed to fetch devices");

        const data: PaginatedResponse = await response.json();

        setDevices(data.devices);
        fetchtTuyaDeviceState(data.devices);
        setTotalPages(data.totalPages);
      } catch (error) {
        toast.error("Error fetching devices");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.organization) {
      fetchDevices();
    }
  }, [userInfo?.organization, currentPage]);

  // Filter + Search Logic
  const filteredDevices = devices.filter((device) => {
    const matchesFilter = filter === "all" || device.deviceType === filter;
    const matchesSearch = device.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Device Navigation
  const navigateToDevice = (device: Device) => {
    console.log("Navigating to device:", device);
    router.push(
      `/dashboard/devices/${device.deviceId}?code=${device.deviceType}`,
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Devices</h1>
        {(userInfo?.role === "admin" || userInfo?.role === "helper") && (
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            <Link href="/dashboard/devices/new">Add Device</Link>
          </Button>
        )}
      </div>

      {/* Search + Filter */}
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative w-full md:col-span-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search devices..."
            className="input input-bordered w-full !pl-10 py-2 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full">
          <Select.Root value={filter} onValueChange={setFilter}>
            <Select.Trigger className="w-full h-full px-3 py-2 bg-white rounded-md border border-gray-300 shadow-sm flex items-center justify-between">
              <Select.Value placeholder="Select device type" />
              <Select.Icon>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content className="bg-white rounded-md border shadow-lg">
                <Select.ScrollUpButton className="flex items-center justify-center h-6">
                  <ChevronUp className="h-4 w-4" />
                </Select.ScrollUpButton>
                <Select.Viewport className="p-1">
                  {[
                    "all",
                    "Smart Ac Controller",
                    "Smart Bulb",
                    "Smart Door Lock",
                    "Smart Plug",
                    "Smart Fan",
                  ].map((type) => (
                    <Select.Item
                      key={type}
                      value={type}
                      className="px-3 py-2 rounded-md text-gray-800 flex items-center hover:bg-gray-50"
                    >
                      <Select.ItemText>{type}</Select.ItemText>
                      <Select.ItemIndicator className="ml-auto">
                        <Check className="h-4 w-4 text-gray-600" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
                <Select.ScrollDownButton className="flex items-center justify-center h-6">
                  <ChevronDown className="h-4 w-4" />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((device, index) => (
          <DeviceCard key={index} device={device} onClick={navigateToDevice} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded ${
              currentPage === page
                ? "bg-black text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {!loading && filteredDevices.length === 0 && (
        <div className="text-center py-10 space-y-2">
          <span className="text-6xl">🕵️‍♂️</span>
          <p className="text-lg text-muted-foreground">
            No devices found matching your search
          </p>
        </div>
      )}
    </div>
  );
}
