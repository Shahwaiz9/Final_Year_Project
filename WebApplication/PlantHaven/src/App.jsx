import React from "react";
import TopNavbar from "./components/TopNavbar";
import SimpleFooter from "./components/SimpleFooter";
import MainCarousel from "./components/MainCarousel";

const App = () => {
  return (
    <div>
      {/* <SideNavbar /> */}
      <TopNavbar />
      <MainCarousel />
      <SimpleFooter />
    </div>
  );
};

export default App;
