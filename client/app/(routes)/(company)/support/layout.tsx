import type { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "ControlX | Support",
  description: "24/7 customer support for all your smart device needs",
};

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 