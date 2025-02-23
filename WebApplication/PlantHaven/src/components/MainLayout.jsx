import React from "react";
import SimpleFooter from "./SimpleFooter";
import TopNavbar from "./TopNavbar"
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <TopNavbar />
      <Outlet />
      <SimpleFooter />
    </>
  );
};

export default MainLayout;
