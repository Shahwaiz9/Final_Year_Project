import React from "react";
import TopNavbar from "./components/TopNavbar";
import SimpleFooter from "./components/SimpleFooter";
import {Outlet} from "react-router-dom"

const App = () => {
  return (
    <>
      {/* <SideNavbar /> */}
      <TopNavbar />
      <Outlet/>
      <SimpleFooter />
    </>
  );
};

export default App;
