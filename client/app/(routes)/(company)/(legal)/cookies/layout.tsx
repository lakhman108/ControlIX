import type { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Website | Cookies Policy",
  description: "Here's Website Cookies Policy Description",
};

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
