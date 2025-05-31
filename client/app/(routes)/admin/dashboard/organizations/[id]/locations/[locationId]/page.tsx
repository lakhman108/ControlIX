"use client";

import { Button } from "@/components/ui/button";
import { Card ,CardContent ,CardHeader} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Label from "@radix-ui/react-label";
import { DeviceCard } from "@/app/(routes)/dashboard/devices/_components/DeviceCard";
import { Device as DeviceCardType } from "@/app/_types/device";
interface Device {
  id: string;
  name: string;
  deviceId: string;
  deviceType: string;
  description: string;
}

interface Location {
  id: string;
  name: string;
  description: string;
  devices: Device[];
}

// Replace the old deviceTypes array with the new one:
const deviceTypes = [
  { id: "wk", name: "Thermostat" },
  { id: "mc", name: "Door Lock" },
  { id: "ele", name: "Elevator Controller" },
  { id: "dj", name: "Smart Bulb" },
] as const;

const deviceFormSchema = z.object({
  name: z.string().min(1, "Device name is required"),
  deviceId: z.string().min(1, "Device ID is required"),
  deviceType: z.string().min(1, "Device type is required"), // now stores the id/code
  description: z.string().optional(),
});

type DeviceFormData = z.infer<typeof deviceFormSchema>;

export default function LocationDevicesPage() {
  const params = useParams();
  const router = useRouter();
  const [location, setLocation] = useState<Location | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);
  const [isCreateDeviceOpen, setIsCreateDeviceOpen] = useState(false);
  const [isCreatingDevice, setIsCreatingDevice] = useState(false);
  const [deletingDeviceId, setDeletingDeviceId] = useState<string | null>(null);

  const {
    register: registerDevice,
    handleSubmit: handleSubmitDevice,
    formState: { errors: deviceErrors },
    reset: resetDeviceForm,
    setValue,
  } = useForm<DeviceFormData>({
    resolver: zodResolver(deviceFormSchema),
    defaultValues: {
      name: "",
      deviceId: "",
      deviceType: "",
      description: "",
    },
  });

  useEffect(() => {
    fetchLocation();
    fetchDevices();
  }, [params.locationId]);

  const fetchLocation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}location/${params.locationId}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.message) {
        setLocation(data.location);
      } else {
        toast.error(data.error || "Failed to fetch location");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      toast.error("Failed to fetch location");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDevices = async () => {
    setIsLoadingDevices(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}device/location/${params.locationId}?page=1&limit=10`,
        {
          method: 'GET',
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.message) {
        setDevices(data.devices);
      } else {
        toast.error(data.error || "Failed to fetch devices");
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
      toast.error("Failed to fetch devices");
    } finally {
      setIsLoadingDevices(false);
    }
  };

  const handleCreateDevice = async (values: DeviceFormData) => {
    setIsCreatingDevice(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}device`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...values,
            location: params.locationId,
            organization: params.id,
          }),
        }
      );

      if (response.ok) {
        toast.success("Device created successfully");
        setIsCreateDeviceOpen(false);
        resetDeviceForm();
        fetchDevices(); // Only refresh devices, not the entire location
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to create device");
      }
    } catch (error) {
      console.error("Error creating device:", error);
      toast.error("Failed to create device");
    } finally {
      setIsCreatingDevice(false);
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    setDeletingDeviceId(deviceId);
    console.log(deviceId)
    try {
      console.log(deviceId)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}device/`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deviceId: deviceId,
          }),
        }
      );
      if (response.ok) {
        toast.success("Device deleted successfully");
        fetchDevices(); // Refresh the devices list
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete device");
      }
    } catch (error) {
      console.error("Error deleting device:", error);
      toast.error("Failed to delete device");
    } finally {
      setDeletingDeviceId(null);
    }
  };

  // Convert admin Device to DeviceCard Device format
  const convertToDeviceCardFormat = (device: Device): DeviceCardType => {
    // Map device type codes to display names and types
    const typeMapping: Record<string, string> = {
      wk: "thermostat",
      mc: "lock",
      ele: "elevator",
      dj: "bulb",
    };

    // Find the device type name from the deviceTypes array
    const deviceTypeObj = deviceTypes.find((t) => t.id === device.deviceType);

    return {
      id: device.deviceId,
      name: device.name,
      type: typeMapping[device.deviceType] || "unknown",
      status: "online" as const,
      location: location?.name || "Unknown",
      isOn: true,
      categoryCode: device?.deviceType, // now stores the id/code directly
      displayType: deviceTypeObj?.name || "Unknown",
    };
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Location not found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{location.name}</h1>
          <p className="text-muted-foreground">{location.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isCreateDeviceOpen} onOpenChange={setIsCreateDeviceOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Device</DialogTitle>
                <DialogDescription>
                  Add a new device to this location.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitDevice(handleCreateDevice)} className="space-y-4">
                <div className="space-y-2">
                  <Label.Root className="text-sm font-medium">Device Name</Label.Root>
                  <Input
                    {...registerDevice("name")}
                    placeholder="Enter device name"
                    disabled={isCreatingDevice}
                  />
                  {deviceErrors.name && (
                    <p className="text-sm text-red-500">{deviceErrors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label.Root className="text-sm font-medium">Device ID</Label.Root>
                  <Input
                    {...registerDevice("deviceId")}
                    placeholder="Enter device ID"
                    disabled={isCreatingDevice}
                  />
                  {deviceErrors.deviceId && (
                    <p className="text-sm text-red-500">{deviceErrors.deviceId.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label.Root className="text-sm font-medium">Device Type</Label.Root>
                  <Select
                    onValueChange={(value) => {
                      setValue("deviceType", value, { shouldValidate: true });
                    }}
                    disabled={isCreatingDevice}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent>
                      {deviceTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {deviceErrors.deviceType && (
                    <p className="text-sm text-red-500">{deviceErrors.deviceType.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label.Root className="text-sm font-medium">Description</Label.Root>
                  <textarea
                    {...registerDevice("description")}
                    className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                    placeholder="Enter device description"
                    disabled={isCreatingDevice}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDeviceOpen(false)}
                    disabled={isCreatingDevice}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreatingDevice}>
                    {isCreatingDevice ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Device"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <span>Back to Location</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {isLoadingDevices ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-72" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : devices && devices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device) => (
              <DeviceCard
                key={device._id}
                device={convertToDeviceCardFormat(device)}
                onClick={() => {}} // No click action needed for admin view
                onDelete={handleDeleteDevice}
                isAdmin={true}
                isDeleting={deletingDeviceId === device.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No devices added yet.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsCreateDeviceOpen(true)}
            >
              Add Device
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
