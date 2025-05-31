import type { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "ControlX | Pricing Plans",
  description: "Flexible rental plans for smart home automation devices",
};

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 