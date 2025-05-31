import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Reset Password | Website",
    description: "Reset Password to our Website",
  };
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div>
        {children}
    </div>
  );
}
