import type { Metadata } from "next";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ControlX | Home",
  description: "Smart Home Automation by ControlX",
  icons: {
    icon: "https://api.dicebear.com/9.x/initials/svg?seed=CX",
    apple: "https://api.dicebear.com/9.x/initials/svg?seed=CX",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body
        className={`flex flex-col h-screen`}
        suppressHydrationWarning
      >{children}</body>
    </html>
  );
}
