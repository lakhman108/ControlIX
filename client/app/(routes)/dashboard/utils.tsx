import React from "react";
import {
  // FileText,
  // Table,
  // MessageSquare,
  Settings,
  User,
  LogOut,
  File,
  Users,
  Calendar,
  Calculator,
  LayoutDashboard,
  DoorClosed,
  Laptop,
  PlusCircle,
} from "lucide-react";

// Types
export type SearchResult = {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
};

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export type ProfileMenuItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  variant?: "error" | "default";
  dividerAfter?: boolean;
};

// Navigation Configuration
export const navigationConfig = [
  {
    title: "Main",
    items: [
      {
        name: "Overview",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
      {
        name: "Locations",
        href: "/dashboard/locations",
        icon: <DoorClosed className="h-4 w-4" />,
      },
      {
        name: "Devices",
        href: "/dashboard/devices",
        icon: <Laptop className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Management",
    roles:["newbie","customer","manager"],
    items: [
      {
        name: "Add Location",
        href: "/dashboard/locations/new",
        icon: <PlusCircle className="h-4 w-4" />,
      },
      {
        name: "Add Device",
        href: "/dashboard/devices/new",
        icon: <PlusCircle className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        name: "Profile",
        href: "/dashboard/profile",
        icon: <User className="h-4 w-4" />,
      },
      {
        name: "Preferences",
        href: "/dashboard/preferences",
        icon: <Settings className="h-4 w-4" />,
      },
    ],
  },
];

// Profile Dropdown Menu Items
export const profileMenuItems: ProfileMenuItem[] = [
  {
    id: "profile",
    label: "Profile",
    href: "/dashboard/profile",
    icon: <User className="h-4 w-4" />,
    badge: "New",
  },
  {
    id: "preferences",
    label: "Preferences",
    href: "/dashboard/profile/preferences",
    icon: <Settings className="h-4 w-4" />,
    dividerAfter: true,
  },
  {
    id: "logout",
    label: "Logout",
    href: "/logout",
    icon: <LogOut className="h-4 w-4" />,
    variant: "error",
  },
];

// Sample Search Results
export const sampleSearchResults: SearchResult[] = [
  {
    id: 1,
    icon: <File className="h-4 w-4 text-blue-500" />,
    title: "Annual Report 2024",
    description: "Financial report and analysis for Q1 2024",
    link: "/dashboard/reports",
  },
  {
    id: 2,
    icon: <Users className="h-4 w-4 text-green-500" />,
    title: "Team Members",
    description: "View and manage team members",
    link: "/dashboard/team",
  },
  {
    id: 3,
    icon: <Calendar className="h-4 w-4 text-purple-500" />,
    title: "Project Timeline",
    description: "Project deadlines and milestones",
    link: "/dashboard/timeline",
  },
  {
    id: 4,
    icon: <Calculator className="h-4 w-4 text-orange-500" />,
    title: "Budget Calculator",
    description: "Calculate and manage project budgets",
    link: "/dashboard/calculator",
  },
];
