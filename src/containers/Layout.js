import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function Layout() {
  return (
    <div className="bg-1e-black">
      <Header />
      <Outlet />
    </div>
  );
}
