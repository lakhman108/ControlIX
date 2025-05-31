"use client";
import { useSelector } from "react-redux";
import React from "react";
import Link from "next/link";
import { RootState } from "../../_lib/store";
import ClientOnly from "../ClientOnly";

const ButtonDisplayWhenNotLoggedIn = () => {
  const userState = useSelector((state: RootState) => state.auth);

  return (
    <ClientOnly fallback={
      <div className="btn btn-sm animate-pulse bg-gray-200"></div>
    }>
      {userState.userInfo == null ? (
        <Link href="/signup" className="btn btn-sm">
          Get Started 🚀
        </Link>
      ) : (
        <Link href="/dashboard" className="btn btn-sm">
          Your Profile 👮🏻‍♂️
        </Link>
      )}
    </ClientOnly>
  );
};

export default ButtonDisplayWhenNotLoggedIn;
