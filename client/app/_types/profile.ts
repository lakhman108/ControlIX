import { ReactNode } from "react";

export type ProfileMenuItem = {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: string;
  variant?: "default" | "error";
  dividerAfter?: boolean;
};

export type ProfileDropdownProps = {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  menuItems: ProfileMenuItem[];
  className?: string;
};
