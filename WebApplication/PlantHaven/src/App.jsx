import React from "react";
import TopNavbar from "./components/TopNavbar";
import SimpleFooter from "./components/SimpleFooter";
import MainCarousel from "./components/MainCarousel";

const App = () => {
  return (
    <>
      {/* <SideNavbar />  this is working*/}
      <TopNavbar />
      <MainCarousel />
      <SimpleFooter />
    </>
  );
};

export default App;
