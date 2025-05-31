"use client";
import React from "react";
// import { opun_medium } from "../_fonts/FontMaster";
import { store } from "../_lib/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { CookiesProvider } from 'react-cookie';

export default function RouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ${opun_medium.variable} font-opun-medium

  return (


    <>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>

        <Provider store={store}>{children}</Provider>
      </CookiesProvider>
      <Toaster position="top-center" />
    </>

  );
}
