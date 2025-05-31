"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import {
  ChevronDown,
  ChevronUp,
  Check,
  ArrowLeft,
  Cpu,
  Tag,
  Home,
  FileText,
  Plus,
  Laptop,
  Settings2
} from "lucide-react";
import Link from "next/link";

// Form validation schema
const deviceFormSchema = z.object({
  deviceId: z.string().min(1, "Device ID is required"),
  deviceName: z.string().min(1, "Device name is required"),
  deviceType: z.string().min(1, "Device type is required"),
  roomId: z.string().min(1, "Location is required"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof deviceFormSchema>;

// Sample location data (replace with actual data from your backend)
const locations = [
  { id: "room1", name: "Living Location" },
  { id: "room2", name: "Master Bedroom" },
  { id: "room3", name: "Kitchen" },
  { id: "room4", name: "Guest Location" },
];

// Device types
const deviceTypes = [
  { id: "bulb", name: "Smart Bulb" },
  { id: "ac", name: "AC Controller" },
  { id: "lock", name: "Door Lock" },
  { id: "fan", name: "Smart Fan" },
  { id: "switch", name: "Smart Switch" },
  { id: "sensor", name: "Motion Sensor" },
];


export default function AddDevicePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(deviceFormSchema),
    defaultValues: {
      deviceId: "",
      deviceName: "",
      deviceType: "",
      roomId: "",
      description: "",
    }
  });

  // Watch device type to show conditional fields

  async function onSubmit(values: FormData) {
    try {
      setIsSubmitting(true);
      console.log(values);
      // Add your API call here
      window.setTimeout(() => {
        setIsSubmitting(false);
        // Navigate to devices page after successful submission
        window.location.href = "/dashboard/devices";
      }, 1000);
    } catch (error) {
      console.error("Error adding device:", error);
      setIsSubmitting(false);
    }
  }


  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard/devices">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
          </Link>
          <span className="text-sm text-gray-500">Back to Devices</span>
        </div>
        <div className="flex items-center gap-3">
          <Laptop className="h-7 w-7 text-gray-600" />
          <h1 className="text-3xl font-bold">Add New Device</h1>
        </div>
        <p className="text-gray-500 mt-1 ml-10">Connect a new smart device to your home</p>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5 text-gray-600" />
            Device Information
          </h2>
          <p className="text-gray-500 text-sm mt-1">Enter the details of your smart device</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Device ID Field */}
              <div className="space-y-2">
                <Label.Root className="flex items-center gap-2 font-medium text-gray-700">
                  <Tag className="h-4 w-4 text-gray-500" />
                  Device ID
                </Label.Root>
                <input
                  {...register("deviceId")}
                  className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                  placeholder="e.g., SB-001"
                />
                {errors.deviceId && (
                  <p className="text-red-500 text-sm">{errors.deviceId.message}</p>
                )}
              </div>

              {/* Device Name Field */}
              <div className="space-y-2">
                <Label.Root className="flex items-center gap-2 font-medium text-gray-700">
                  <Cpu className="h-4 w-4 text-gray-500" />
                  Device Name
                </Label.Root>
                <input
                  {...register("deviceName")}
                  className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                  placeholder="e.g., Living Location Light"
                />
                {errors.deviceName && (
                  <p className="text-red-500 text-sm">{errors.deviceName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Device Type Select */}
              <div className="space-y-2">
                <Label.Root className="flex items-center gap-2 font-medium text-gray-700">
                  <Settings2 className="h-4 w-4 text-gray-500" />
                  Device Name
                </Label.Root>
                <Select.Root onValueChange={(value) => setValue("deviceType", value)}>
                  <Select.Trigger className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 shadow-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600">
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
                        {deviceTypes.map((type) => (
                          <Select.Item
                            key={type.id}
                            value={type.id}
                            className="px-3 py-2 rounded-md text-gray-800 focus:bg-blue-50 outline-none cursor-pointer flex items-center hover:bg-gray-50"
                          >
                            <Select.ItemText>{type.name}</Select.ItemText>
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
                {errors.deviceType && (
                  <p className="text-red-500 text-sm">{errors.deviceType.message}</p>
                )}
              </div>

              {/* Location Select */}
              <div className="space-y-2">
                <Label.Root className="flex items-center gap-2 font-medium text-gray-700">
                  <Home className="h-4 w-4 text-gray-500" />
                  Location
                </Label.Root>
                <Select.Root onValueChange={(value) => setValue("roomId", value)}>
                  <Select.Trigger className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 shadow-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600">
                    <Select.Value placeholder="Select location" />
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
                        {locations.map((location) => (
                          <Select.Item
                            key={location.id}
                            value={location.id}
                            className="px-3 py-2 rounded-md text-gray-800 focus:bg-blue-50 outline-none cursor-pointer flex items-center hover:bg-gray-50"
                          >
                            <Select.ItemText>{location.name}</Select.ItemText>
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
                {errors.roomId && (
                  <p className="text-red-500 text-sm">{errors.roomId.message}</p>
                )}
              </div>
            </div>


            {/* Description Field */}
            <div className="space-y-2">
              <Label.Root className="flex items-center gap-2 font-medium text-gray-700">
                <FileText className="h-4 w-4 text-gray-500" />
                Description
              </Label.Root>
              <textarea
                {...register("description")}
                className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 min-h-32"
                placeholder="Enter additional information about this device"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
              <Link href="/dashboard/devices">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors disabled:opacity-50 disabled:hover:bg-gray-900 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    <span>Adding Device...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Add Device</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}