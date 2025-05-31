import type { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "ControlX | Smart Devices",
  description: "Explore our range of smart home automation devices available for rent",
};

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 