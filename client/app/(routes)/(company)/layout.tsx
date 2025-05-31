import React from "react";
import Header from "../../_components/header";
import Footer from "../../_components/footer";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
