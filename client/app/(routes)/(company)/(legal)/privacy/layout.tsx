import type { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Website | Privacy Policy",
  description: "Here's Website Privacy Policy Description",
};

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
