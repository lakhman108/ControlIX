"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building, Layers, FileText, Plus, ChevronDown, ChevronUp, Check, House, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as Label from "@radix-ui/react-label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as Select from "@radix-ui/react-select";
import Notification from "@/app/_components/client/Notification";

const roomFormSchema = z.object({
  name: z.string().min(1, "Location name is required"),
  organization: z.string().min(1, "Organization is missing"),
  description: z.string().optional(),
  floor: z.string().min(1, "Floor is required"),
});

type FormData = z.infer<typeof roomFormSchema>;

interface Organization {
  _id: string;
  name: string;
  bio: string;
  address: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
  createdBy: [{
    name: string;
    email: string;
  }];
  locations: {
    _id: string;
    name: string;
    description: string;
    devices: {
      _id: string;
      name: string;
      deviceId: string;
      deviceType: string;
      description: string;
    }[];
  }[];
  users: {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }[];
}

export default function AddRoomPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      name: "",
      organization: "",
      description: "",
      floor: "",
    },
  });

  async function onSubmit(values: FormData) {
    try {
      setIsSubmitting(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}location/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create location");
      }

      setNotification({
        message: "Location created successfully!",
        type: "success"
      });

      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error adding location:", error);
      setNotification({
        message: error instanceof Error ? error.message : "Failed to create location",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  }
    const fetchOrganizations = async (page: number = 1) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}organization?page=${page}&limit=10`, {
        credentials: "include"
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch organizations");
      }
      setOrganizations(data.data)
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };
  
  useEffect(() => {
    fetchOrganizations()
  }, [])
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/admin/dashboard/locations">
            <Button variant="ghost" className="p-2 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="text-sm text-gray-500">Back to Locations</span>
        </div>
        <div className="flex items-center gap-3">
          <House className="h-7 w-7 text-gray-600" />
          <h1 className="text-3xl font-bold">Add New Location</h1>
        </div>
        <p className="text-gray-500 mt-1">Create a new location in your facility</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <div className="pb-4 mb-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5 text-gray-600" />
            Location Details
          </h2>
          <p className="text-gray-500 text-sm mt-1">Enter the details of your room</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label.Root className="flex items-center gap-2 font-medium text-gray-700">
                <Building className="h-4 w-4 text-gray-500" />
                Location Name
              </Label.Root>
              <input
                {...register("name")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-600 focus:border-gray-600 focus:outline-none"
                placeholder="Conference Location A"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label.Root className="flex items-center gap-2 font-medium text-gray-700">
                <Layers className="h-4 w-4 text-gray-500" />
                Floor
              </Label.Root>
              <input
                {...register("floor")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-600 focus:border-gray-600 focus:outline-none"
                placeholder="Enter floor number or name"
              />
              {errors.floor && (
                <p className="text-red-500 text-sm mt-1">{errors.floor.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label.Root className="flex items-center gap-2 font-medium text-gray-700">
              <Building2 className="h-4 w-4 text-gray-500" />
              Organization
            </Label.Root>
            <Select.Root onValueChange={(value) => {
              setValue("organization", value)
            }}>
              <Select.Trigger className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 shadow-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600">
                <Select.Value placeholder="Select organization" />
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
                    {organizations.map((type) => (
                      <Select.Item
                        key={type._id}
                        value={type._id}
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
            {errors.organization && (
              <p className="text-red-500 text-sm">{errors.organization.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label.Root className="flex items-center gap-2 font-medium text-gray-700">
              <FileText className="h-4 w-4 text-gray-500" />
              Description
            </Label.Root>
            <textarea
              {...register("description")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-600 focus:border-gray-600 focus:outline-none min-h-32"
              placeholder="Provide details about this location"
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 mt-8">
            <Link href="/dashboard/locations">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-white flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Location
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
          position="bottom-right"
          duration={5000}
        />
      )}
    </div>
  );
}