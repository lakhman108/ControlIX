import type { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Website | Terms of Use",
  description: "Here's Website Terms of Use Description",
};

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
