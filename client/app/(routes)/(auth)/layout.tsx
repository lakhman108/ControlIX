"use client";
import React from "react";
import Footer from "@/app/_components/footer";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RootState } from "@/app/_lib/store";
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { replace } = useRouter();
  const userState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (userState.userInfo) {
      replace("/");
    }
  }, []);

  return (
    <>
      <div className="flex items-center justify-center mb-auto text-center">
        {children}
      </div>
      <Footer />
    </>
  );
}
