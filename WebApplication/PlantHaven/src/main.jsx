import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Login from "./components/LoginPage/Login.jsx";
import SignupPage from "./components/SignupPage/SignupPage.jsx";
import Homepage from "./components/HomePage/homepage.jsx";
import VendorSignup from "./components/SignupPage/VendorSignup.jsx";
import Modelpage from "./components/ModelPage/Modelpage.jsx";
import TopNavbar from "./components/TopNavbar.jsx";
import SimpleFooter from "./components/SimpleFooter.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="" element={<Homepage />}></Route>
        <Route path="model" element={<Modelpage />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="signup/user" element={<SignupPage />} />
      <Route path="signup/vendor" element={<VendorSignup />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
