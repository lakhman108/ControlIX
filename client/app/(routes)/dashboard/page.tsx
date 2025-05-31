"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";
import CountUp from 'react-countup'
import { useSelector } from "react-redux";
import { RootState } from "@/app/_lib/store";
import {
  // BarChart3,
  // Users,
  // Mail,
  // Plus,
  // CheckCircle,
  AlertCircle,
  // Settings,
  DoorClosed,
  Laptop,
  PlusCircle,
  Battery,
  Zap,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";
import AnimatedProgressBar from "./_components/AnimatedProgressBar"
import IneligiblePopup from "./_components/IneligiblePopup";

const DashboardPage: React.FC = () => {
  const router = useRouter()
  const { userInfo } = useSelector((state: RootState) => state.auth);
  // Mock data - replace with real data later
  // const stats = {
  //   totalLeads: 1234,
  //   activeSequences: 5,
  //   emailsSent: 8567,
  //   responseRate: "23.4%",
  // };

  // const integrations = [
  //   { name: "Apollo", connected: true, icon: "/icons/apollo.png" },
  //   { name: "SmartLead", connected: true, icon: "/icons/smartlead.png" },
  //   { name: "Hunter.io", connected: false, icon: "/icons/hunter.png" },
  //   { name: "LinkedIn Sales", connected: false, icon: "/icons/linkedin.png" },
  // ];

  // Sample data - replace with actual data from your backend
  const energyData = [
    { name: "Jan", energy: 400 },
    { name: "Feb", energy: 300 },
    { name: "Mar", energy: 200 },
    { name: "Apr", energy: 278 },
    { name: "May", energy: 189 },
  ];

  //Sample data - devices (get top 3 from api)
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
    }
  ];

  //Sample data - locations (get top 3 from api)
  const locations = [
    {
      id: "room1",
      name: "Living Location",
      devices: [
        { id: "dev1", name: "Main Light", type: "bulb", status: "online", isOn: true },
        { id: "dev2", name: "AC", type: "ac", status: "online", isOn: false },
      ],
    },
    {
      id: "room2",
      name: "Master Bedroom",
      devices: [
        { id: "dev3", name: "Ceiling Light", type: "bulb", status: "online", isOn: true },
        { id: "dev4", name: "Fan", type: "fan", status: "offline", isOn: false },
      ],
    },
    {
      id: "room3",
      name: "Kitchen",
      devices: [
        { id: "dev5", name: "Strip Light", type: "bulb", status: "online", isOn: true },
      ],
    },
  ];

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "online":
  //       return "badge-success";
  //     case "offline":
  //       return "badge-error";
  //     default:
  //       return "badge-neutral";
  //   }
  // };

  const CountUpComponent = (props: any) => {
    return (
      <CountUp
        className="text-2xl font-bold"
        end={props.number}
        duration={5}
      ></CountUp>
    )
  }
  return (

    <div className="space-y-6">
      {userInfo?.role == 'newbie' &&
        <IneligiblePopup
          isOpen={true}
        />}
      {userInfo?.role != 'newbie' &&
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>

           {
            (userInfo?.role == 'admin' || userInfo?.role == 'helper') &&
             <Link href="/dashboard/devices/new">

           

              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Guest
              </Button>
            </Link>
           }
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Laptop className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium">Total Devices</p>
                  <CountUpComponent number={24} />
                  {/* <h3 className="text-2xl font-bold">24</h3> */}
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Battery className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Active Devices</p>
                  <CountUpComponent number={18} />
                  {/* <h3 className="text-2xl font-bold">18</h3> */}
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-8 w-8 text-error" />
                <div>
                  <p className="text-sm font-medium">Offline Devices</p>
                  <CountUpComponent number={8} />
                  {/* <h3 className="text-2xl font-bold">6</h3> */}
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2">
                <DoorClosed className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-sm font-medium">Total Locations</p>
                  <CountUpComponent number={12} />
                  {/* <h3 className="text-2xl font-bold">12</h3> */}
                </div>
              </div>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Energy Consumption</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="energy"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Energy Savings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span>Units Saved</span>
                  </div>
                  <span className="text-2xl font-bold">245 kWh</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-500" />
                    <span>Cost Saved</span>
                  </div>
                  <span className="text-2xl font-bold">$123.45</span>
                </div>
                <div className="mt-4">
                  <AnimatedProgressBar target={75} duration={1000} />
                  {/* <div className="flex justify-between mb-1">
                <span>Monthly Goal</span>
                <span>75%</span>
              </div>
              <progress
                className="progress progress-success w-full"
                value="75"
                max="100"
              ></progress> */}
                </div>
              </div>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Devices</h3>
                <Link href="/dashboard/devices">
                  <Button variant="ghost" size="sm">
                    View all
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className="flex justify-between items-center bg-base-200 p-3 rounded-lg hover:shadow cursor-pointer transition"
                    onClick={() => router.push(`/dashboard/devices/${device.id}`)}
                  >
                    <div>
                      <h2 className="text-base font-semibold">{device.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {device.type} — {device.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Power
                        className={`h-5 w-5 ${device.isOn ? "text-success" : "text-error"
                          }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Locations Overview</h3>
                <Link href="/dashboard/locations">
                  <Button variant="ghost" size="sm">
                    View all
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="flex justify-between items-center bg-base-200 p-3 rounded-lg hover:shadow cursor-pointer transition"
                    onClick={() => router.push(`/dashboard/locations/${location.id}`)}
                  >
                    <div>
                      <h2 className="text-base font-semibold">{location.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {location.devices.length} {location.devices.length === 1 ? "device" : "devices"}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>}

    </div>
  );
};

export default DashboardPage;
