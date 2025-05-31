"use client";

import Link from "next/link";
import ActiveLink from "./client/activeLink";
import { useSelector } from "react-redux";
import LoginOrSignupButton from "./client/LoginOrSignupButton";
import React from "react";
import { Settings, LogOut } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import { RootState } from "../_lib/store";
import ClientOnly from "./ClientOnly";

const Navbar = () => {
  const userState = useSelector((state: RootState) => state.auth);

  return (
    <div className="navbar bg-base-200 mb-5">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <ActiveLink slug="home" />
            </li>
            <li>
              <ActiveLink slug="devices" />
            </li>
            <li>
              <ActiveLink slug="pricing" />
            </li>
            <li>
              <ActiveLink slug="support" />
            </li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl">
          <img
            src="https://api.dicebear.com/9.x/initials/svg?seed=CX"
            className="img w-10 rounded-full"
          />{" "}
          ControlX
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <ActiveLink slug="home" />
          </li>
          <li>
            <ActiveLink slug="devices" />
          </li>
          <li>
            <ActiveLink slug="pricing" />
          </li>
          <li>
            <ActiveLink slug="support" />
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <ClientOnly fallback={
          <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
        }>
          {userState.userInfo == null ? (
            <LoginOrSignupButton />
          ) : (
            <div className="h-full">
              <ProfileDropdown
                user={{
                  name: userState.userInfo.name || "",
                  email: userState.userInfo.email || "",
                }}
                menuItems={[
                  {
                    id: "dashboard",
                    label: "Dashboard",
                    href: "/dashboard",
                    icon: <Settings className="h-4 w-4" />,
                    badge: "New",
                  },
                  {
                    id: "logout",
                    label: "Logout",
                    href: "/logout",
                    icon: <LogOut className="h-4 w-4" />,
                    variant: "error",
                  },
                ]}
              />
            </div>
          )}
        </ClientOnly>
      </div>
    </div>
  );
};

export default Navbar;
