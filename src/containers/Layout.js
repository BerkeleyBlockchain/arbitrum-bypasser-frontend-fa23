import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-1e-black m-0 p-0">
      <Header className="flex-shrink-0" />
      <Outlet className="flex-grow m-0 p-0" />
      <Footer className="flex-shrink-0" />
    </div>
  );
}
