import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <div className="bg-1e-black m-0 p-0">
      <Header />
      <Outlet className="m-0 p-0" />
      <Footer />
    </div>
  );
}
