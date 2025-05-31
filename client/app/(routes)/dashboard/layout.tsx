"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useState } from "react";

import { useSelector } from "react-redux";
// import { usePathname } from "next/navigation";
import { RootState } from "@/app/_lib/store";
import {
  Bell,
  Menu,
  ChevronDown,
  Boxes,
  LogOut,
  ChevronRight,
} from "lucide-react";
import SearchBar from "@/app/_components/SearchBar";
import ProfileDropdown from "@/app/_components/ProfileDropdown";
import {
  sampleSearchResults,
  type SearchResult,
  navigationConfig,
  profileMenuItems,
} from "./utils";
import { useRouter } from 'next/navigation';
import IneligiblePopup from "./_components/IneligiblePopup";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dashboardNotification = () => {
    toast("Coming Soon", {
      icon: "🚀",
    });
  };

  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [filteredResults, setFilteredResults] = useState(sampleSearchResults);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    Features: true,
    Settings: true,
    "Data Management": true,
    "User Management": true,
    "System Settings": true,
  });

  useEffect(() => {
    setIsClient(true);
    if (!userInfo) {
      router.push("/");
    }
    else if(userInfo.role == "admin" && !userInfo.organization){
      router.push("/admin/dashboard");
    }
  }, [userInfo, router.push]);

  if (!isClient) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if(userInfo?.role === "newbie"){
    return (
      <>
       <IneligiblePopup
          isOpen={true}
        />
      </>
    )
  }

  const handleSearch = (query: string) => {
    const filtered = sampleSearchResults.filter(
      (result: SearchResult) =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredResults(filtered);
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col min-h-screen">
        <div className="sticky top-0 z-20 navbar h-10 bg-base-200/50 backdrop-blur-sm border-l px-2">
          <div className="navbar gap-2">
            <div className="lg:invisible">
              <label
                tabIndex={0}
                role="button"
                htmlFor="my-drawer"
                className="btn btn-ghost btn-sm btn-circle drawer-button hover:bg-base-300"
              >
                <Menu className="h-5 w-5" />
              </label>
            </div>
            <Link
              className="btn btn-ghost btn-xs px-2 text-base gap-1 hover:bg-base-300"
              href="/dashboard"
            >
              <span className="hidden sm:inline">Welcome back,</span>
              {userInfo?.name}
              <span className="animate-bounce"> 🎉</span>
            </Link>
            <div className="relative flex-1 max-w-md mx-2">
              <SearchBar
                results={filteredResults}
                onSearch={handleSearch}
                className="w-full"
                maxResults={4}
              />
            </div>
          </div>
          <div className="navbar-end gap-4 mr-2">
            <button
              onClick={dashboardNotification}
              className="btn btn-ghost btn-sm btn-circle hover:bg-base-300"
            >
              <div className="indicator">
                <Bell className="h-5 w-5" />
                <span className="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>
            {userInfo ? (
              <ProfileDropdown
                user={{
                  name: userInfo.name || "",
                  email: userInfo.email || "",
                }}
                menuItems={profileMenuItems}
              />
            ) : null}
          </div>
        </div>
        <div className="flex-1 p-4">{children}</div>
      </div>
      <div className="drawer-side z-30">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <div className="menu p-3 w-64 min-h-full bg-base-200 text-base-content">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4 px-2">
              <Boxes className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">Dashboard</span>
            </div>

            <div className="space-y-1 flex-1">
              {navigationConfig.map((section) => {
                if(section?.roles && userInfo?.role && section?.roles.includes(userInfo.role))
                    return null;
                else {
                    return (
                <div key={section.title} className="mt-4">
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center px-3 py-2 text-base font-semibold text-gray-800 dark:text-white hover:opacity-100 transition"
                  >
                    {expandedSections[section.title] ? (
                      <ChevronDown className="h-5 w-5 mr-2" />
                    ) : (
                      <ChevronRight className="h-5 w-5 mr-2" />
                    )}
                    {section.title}
                  </button>

                  <div
                    className={`mt-1 pl-6 space-y-1 transition-all  duration-200 ${expandedSections[section.title] ? "block" : "hidden"
                      }`}
                  >
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex border-l border-gray-300 dark:border-gray-600 items-center w-full px-3 py-2 hover:bg-base-300 rounded-lg `}
                      >
                        <span className="mr-2">{item.icon}</span>
                        <span className="flex-1">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )
                }


              })}
            </div>

            <div className="border-t border-base-300 pt-2">
              <a
                href="/logout"
                className="flex items-center w-full px-3 py-2 hover:bg-base-300 rounded-lg text-error"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
