"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HouseIcon, User } from "lucide-react";
import CountUp from 'react-countup'
import {
  Laptop,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

// --- Types ---
type UserType = {
  _id: string;
  name: string;
  email: string;
  organization?: string;
};

type OrganizationType = {
  _id: string;
  name: string;
};

type LocationType = {
  _id: string;
  name: string;
  organization: OrganizationType;
  deviceCount: number;
};

type DeviceType = {
  _id: string;
  name: string;
  deviceType: string;
  location: { _id: string; name: string };
  organization: OrganizationType;
};

type TotalsType = {
  users: number;
  organizations: number;
  devices: number;
  locations: number;
};

type DashboardApiResponse = {
  success: boolean;
  data: {
    users: UserType[];
    organizations: OrganizationType[];
    locations: LocationType[];
    devices: DeviceType[];
    totals: TotalsType;
  };
  message?: string;
};

const DashboardPage: React.FC = () => {
  const router = useRouter();

  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [recentUsers, setRecentUsers] = useState<UserType[]>([]);
  const [recentOrganizations, setRecentOrganizations] = useState<OrganizationType[]>([]);
  const [totals, setTotals] = useState<TotalsType>({ users: 0, organizations: 0, devices: 0, locations: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const CountUpComponent = (props: { number: number }) => (
    <CountUp
      className="text-2xl font-bold"
      end={props.number}
      duration={2}
    />
  );

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}admin/recent`, { credentials: "include" })
      .then(res => res.json())
      .then((data: DashboardApiResponse) => {
        if (!data.success) throw new Error(data.message);
        setDevices(data.data.devices || []);
        setLocations(data.data.locations || []);
        setRecentUsers(data.data.users || []);
        setRecentOrganizations(data.data.organizations || []);
        setTotals(data.data.totals || { users: 0, organizations: 0, devices: 0, locations: 0 });
        setError(null);
      })
      .catch(err => {
        setError(err.message || "Failed to load recent data");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <Link href="/admin/dashboard/devices/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Device
          </Button>
        </Link>
      </div>

      {error && (
        <div className="text-red-500 bg-red-100 p-2 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {/* Skeleton for stats cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card className="p-4" key={i}>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Skeleton for Recent Users and Organizations */}
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Card className="p-4" key={i}>
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div className="flex justify-between items-center bg-base-200 p-3 rounded-lg" key={j}>
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-8 w-16 rounded" />
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Skeleton for Devices and Locations */}
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Card className="p-4" key={i}>
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div className="flex justify-between items-center bg-base-200 p-3 rounded-lg" key={j}>
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-8 w-16 rounded" />
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Laptop className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium">Total Devices</p>
                  <CountUpComponent number={totals.devices} />
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <HouseIcon className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Total Organizations</p>
                  <CountUpComponent number={totals.organizations} />
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <User className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Total Users</p>
                  <CountUpComponent number={totals.users} />
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <HouseIcon className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Total Locations</p>
                  <CountUpComponent number={totals.locations} />
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Users and Organizations */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Users</h3>
              </div>
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex justify-between items-center bg-base-200 p-3 rounded-lg hover:shadow cursor-pointer transition"
                  >
                    <div>
                      <h2 className="text-base font-semibold">{user.name}</h2>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/admin/dashboard/users/${user._id}`)}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Organizations</h3>
              </div>
              <div className="space-y-3">
                {recentOrganizations.map((org) => (
                  <div
                    key={org._id}
                    className="flex justify-between items-center bg-base-200 p-3 rounded-lg hover:shadow cursor-pointer transition"
                  >
                    <div>
                      <h2 className="text-base font-semibold">{org.name}</h2>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/admin/dashboard/organizations/${org._id}`)}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Devices and Locations */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Recent Devices</h3>
              </div>
              <div className="space-y-3">
                {devices.map((device) => (
                  <div
                    key={device._id}
                    className="flex justify-between items-center bg-base-200 p-3 rounded-lg hover:shadow transition"
                  >
                    <div>
                      <h2 className="text-base font-semibold">{device.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {device.deviceType} — {device.location.name}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => router.push(`/admin/dashboard/organizations/${device.organization?._id || device.organization}`)}
                    >
                      View Org
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Locations Overview</h3>
              </div>
              <div className="space-y-3">
                {locations.map((location) => (
                  <div
                    key={location._id}
                    className="flex justify-between items-center bg-base-200 p-3 rounded-lg hover:shadow transition"
                  >
                    <div>
                      <h2 className="text-base font-semibold">{location.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {location.deviceCount ?? 0} {location.deviceCount === 1 ? "device" : "devices"}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => router.push(`/admin/dashboard/organizations/${location.organization?._id || location.organization}`)}
                    >
                      View Org
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
