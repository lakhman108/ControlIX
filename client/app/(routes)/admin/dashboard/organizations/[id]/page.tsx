"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, Loader2, Trash2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Label from "@radix-ui/react-label";

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

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
}

const locationFormSchema = z.object({
  name: z.string().min(1, "Location name is required"),
  description: z.string().optional(),
  floor: z.string().min(1, "Floor is required"),
});

type LocationFormData = z.infer<typeof locationFormSchema>;

export default function OrganizationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isCreateLocationOpen, setIsCreateLocationOpen] = useState(false);
  const [isCreatingLocation, setIsCreatingLocation] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");

  const {
    register: registerLocation,
    handleSubmit: handleSubmitLocation,
    formState: { errors: locationErrors },
    reset: resetLocationForm,
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      name: "",
      description: "",
      floor: "",
    },
  });

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}organization/${params.id}`, {
          credentials: 'include'
        });
        const data = await response.json();
        setOrganization(data.data);
      } catch (error) {
        console.error("Error fetching organization:", error);
      }
    };

    fetchOrganization();
  }, [params.id]);

  useEffect(() => {
    searchUsers(debouncedSearch);
  }, [debouncedSearch]);

  const searchUsers = async (query: string) => {
    if (!query) {
      setUsers([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}admin/searchUsers?searchQuery=${query}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setUsers(data.data || []);
      } else {
        console.error("Error searching users:", data.message);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser) return;

    setIsAssigning(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}admin/assign-manager-role`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userId: selectedUser._id,
            organizationId: params.id,
          }),
        }
      );

      if (response.ok) {
        setIsOpen(false);
        setSelectedUser(null);
        setSearchQuery("");

        // Refetch organization data
        const orgResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}organization/${params.id}`, {
          credentials: 'include'
        });
        const orgData = await orgResponse.json();
        setOrganization(orgData.data);

        toast.success("Manager role assigned successfully");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to assign manager role");
      }
    } catch (error) {
      console.error("Error assigning role:", error);
      toast.error("Failed to assign manager role");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleDeleteOrganization = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}organization/${params.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        toast.success("Organization deleted successfully");
        router.push("/admin/dashboard/organizations");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete organization");
      }
    } catch (error) {
      console.error("Error deleting organization:", error);
      toast.error("Failed to delete organization");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "destructive";
      case "manager":
        return "secondary";
      case "customer":
        return "default";
      case "helper":
        return "outline";
      default:
        return "secondary";
    }
  };

  const handleCreateLocation = async (values: LocationFormData) => {
    setIsCreatingLocation(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}location/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...values,
            organization: params.id,
          }),
        }
      );

      if (response.ok) {
        toast.success("Location created successfully");
        setIsCreateLocationOpen(false);
        resetLocationForm();
        const orgResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}organization/${params.id}`, {
          credentials: 'include'
        });
        const orgData = await orgResponse.json();
        setOrganization(orgData.data);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to create location");
      }
    } catch (error) {
      console.error("Error creating location:", error);
      toast.error("Failed to create location");
    } finally {
      setIsCreatingLocation(false);
    }
  };

  if (!organization) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <div className="space-x-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2].map((location) => (
                  <div key={location} className="border rounded-lg p-4">
                    <div className="mb-4">
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-4 w-72" />
                    </div>
                    <div className="ml-4">
                      <Skeleton className="h-5 w-24 mb-2" />
                      <div className="grid gap-4">
                        {[1, 2].map((device) => (
                          <div key={device} className="bg-gray-50 p-3 rounded">
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-4 w-48 mb-1" />
                            <Skeleton className="h-4 w-40 mb-1" />
                            <Skeleton className="h-4 w-64" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{organization.name}</h1>
        <div className="flex items-center gap-3">
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <span className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Organization
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Organization</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this organization? This action cannot be undone.
                  All associated users will be set to newbie role, and all locations and devices will be deleted.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteOrganization}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Organization"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <span>Back to Organizations</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
            <CardDescription>Basic information about the organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Bio</h3>
                <p>{organization.bio}</p>
              </div>
              <div>
                <h3 className="font-semibold">Address</h3>
                <p>{organization.address}</p>
              </div>
              <div>
                <h3 className="font-semibold">Contact</h3>
                <p>{organization.contact}</p>
              </div>
              <div>
                <h3 className="font-semibold">Created By</h3>
                <p>{organization.createdBy[0].name} ({organization.createdBy[0].email})</p>
              </div>
              <div>
                <h3 className="font-semibold">Created At</h3>
                <p>{new Date(organization.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-semibold">Last Updated</h3>
                <p>{new Date(organization.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Locations</CardTitle>
                <CardDescription>List of locations and their devices</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search locations..."
                    value={locationSearchQuery}
                    onChange={(e) => setLocationSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Dialog open={isCreateLocationOpen} onOpenChange={setIsCreateLocationOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Location
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Location</DialogTitle>
                      <DialogDescription>
                        Add a new location to this organization.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitLocation(handleCreateLocation)} className="space-y-4">
                      <div className="space-y-2">
                        <Label.Root className="text-sm font-medium">Location Name</Label.Root>
                        <Input
                          {...registerLocation("name")}
                          placeholder="Enter location name"
                          disabled={isCreatingLocation}
                        />
                        {locationErrors.name && (
                          <p className="text-sm text-red-500">{locationErrors.name.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label.Root className="text-sm font-medium">Floor</Label.Root>
                        <Input
                          {...registerLocation("floor")}
                          placeholder="Enter floor number"
                          disabled={isCreatingLocation}
                        />
                        {locationErrors.floor && (
                          <p className="text-sm text-red-500">{locationErrors.floor.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label.Root className="text-sm font-medium">Description</Label.Root>
                        <textarea
                          {...registerLocation("description")}
                          className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                          placeholder="Enter location description"
                          disabled={isCreatingLocation}
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCreateLocationOpen(false)}
                          disabled={isCreatingLocation}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isCreatingLocation}>
                          {isCreatingLocation ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Location"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {organization.locations && organization.locations.length > 0 ? (
                organization.locations
                  .filter(location =>
                    location.name.toLowerCase().includes(locationSearchQuery.toLowerCase()) ||
                    location.description.toLowerCase().includes(locationSearchQuery.toLowerCase())
                  )
                  .map((location) => (
                    <div key={location._id} className="border rounded-lg p-4">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold">{location.name}</h3>
                        <p className="text-sm text-gray-500">{location.description}</p>
                      </div>

                      <div className="ml-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Devices</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/dashboard/organizations/${params.id}/locations/${location._id}`)}
                          >
                            View
                          </Button>
                        </div>
                        <div className="grid gap-4">
                          {location.devices.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No devices found in this location</p>
                          ) : (
                            <>
                              {location.devices.slice(0, 3).map((device) => (
                                <div key={device._id} className="bg-gray-50 p-3 rounded">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h5 className="font-medium">{device.name}</h5>
                                      <p className="text-sm text-gray-500">ID: {device.deviceId}</p>
                                      <p className="text-sm text-gray-500">Type: {device.deviceType}</p>
                                      <p className="text-sm mt-1">{device.description}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {location.devices.length > 3 && (
                                <p className="text-sm text-muted-foreground">
                                  +{location.devices.length - 3} more devices
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No locations added yet.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setIsCreateLocationOpen(true)}
                  >
                    Create Location
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Organization Users</CardTitle>
                <CardDescription>List of users associated with this organization</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <span className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Assign Manager
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Assign Manager Role</DialogTitle>
                      <DialogDescription>
                        Search for a user to assign them as a manager of this organization.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                            disabled={isAssigning}
                          />
                        </div>
                        {isLoading && (
                          <p className="text-sm text-gray-500">Searching...</p>
                        )}
                        {users.length > 0 && (
                          <div className="border rounded-md mt-2 max-h-[200px] overflow-y-auto">
                            {users.map((user) => (
                              <div
                                key={user._id}
                                className={`p-2 hover:bg-gray-100 cursor-pointer ${selectedUser?._id === user._id ? "bg-gray-100" : ""
                                  } ${isAssigning ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={() => !isAssigning && setSelectedUser(user)}
                              >
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <p className="text-xs text-gray-400">Current Role: {user.role}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {selectedUser && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Selected User</label>
                          <div className="p-3 border rounded-md">
                            <p className="font-medium">{selectedUser.name}</p>
                            <p className="text-sm text-gray-500">{selectedUser.email}</p>
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={handleAssignRole}
                        disabled={!selectedUser || isAssigning}
                        className="w-full"
                      >
                        {isAssigning ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Assigning...
                          </>
                        ) : (
                          "Assign Manager Role"
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {organization.users && organization.users.length > 0 ? (
                <div className="grid gap-4">
                  {organization.users.map((user) => (
                    <div key={user._id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user.name}</h3>
                            <Badge variant={getRoleBadgeVariant(user.role)}>
                              {user.role}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{user.email}</span>
                            <span>•</span>
                            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No users associated with this organization yet.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setIsOpen(true)}
                  >
                    Assign Manager
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 