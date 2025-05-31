"use client";

import dynamic from "next/dynamic";
import React,{ ComponentType } from "react";

interface NoSSRProps {
  children: React.ReactNode;
  _fallback?: React.ReactNode;
}

// This component will only render on the client side
const NoSSR: ComponentType<NoSSRProps> = ({ children, _fallback = null }) => {
  return <>{children}</>;
};

// Export a dynamically imported version that disables SSR
export default dynamic(() => Promise.resolve(NoSSR), {
  ssr: false,
  loading: () => null,
});
