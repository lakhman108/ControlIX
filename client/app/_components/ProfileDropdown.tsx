"use client";

import Link from "next/link";
import { ProfileDropdownProps } from "../_types/profile";

export default function ProfileDropdown({
  user,
  menuItems,
  className = "",
}: ProfileDropdownProps) {
  return (
    <div className={`dropdown dropdown-end ${className}`}>
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-sm btn-circle avatar ring-2 ring-offset-2 ring-base-300 ring-offset-base-200"
      >
        <div className="w-8 rounded-full">
          <img
            alt={`${user.name}'s avatar`}
            src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${user.email}`}
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52 gap-1"
      >
        {menuItems.map((item) => (
          <div key={item.id}>
            <li>
              <Link
                href={item.href}
                className={`flex items-center gap-2 ${
                  item.variant === "error" ? "text-error hover:text-error" : ""
                }`}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="badge badge-sm badge-primary">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
            {item.dividerAfter && <div className="divider my-1"></div>}
          </div>
        ))}
      </ul>
    </div>
  );
}
