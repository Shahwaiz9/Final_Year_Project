import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/LoginPage/Login.jsx";
import SignupPage from "./components/SignupPage/SignupPage.jsx";
import Homepage from "./components/HomePage/homepage.jsx";
import VendorSignup from "./components/SignupPage/VendorSignup.jsx";
import Modelpage from "./components/ModelPage/Modelpage.jsx";
import MainLayout from "./components/MainLayout.jsx";
import PrivateRouteHandler from "./PrivateRouteHandler.jsx";
import { Navigate } from "react-router-dom";

const App = () => {
  const [isAuth, setIsAuth] = useState(null); 

  const PrivateRoute = ({ element }) => {
    setTimeout(()=>{
      return isAuth ? element : <Navigate to="/login" />;
    },1000)
  };

  return (
    <div>
      <PrivateRouteHandler setIsAuth={setIsAuth} />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Homepage />} />
          <Route path="model" element={<Modelpage />} />
          <Route path="checkinprivroute" element={<PrivateRoute element={<p>This is private route</p>} />} />
        </Route>

        <Route path="login" element={<Login />} />
        <Route path="signup/user" element={<SignupPage />} />
        <Route path="signup/vendor" element={<VendorSignup />} />
      </Routes>
    </div>
  );
};

export default App;
