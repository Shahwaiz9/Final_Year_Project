import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/LoginPage/Login.jsx";
import SignupPage from "./components/SignupPage/SignupPage.jsx";
import EditProfilePage from "./components/EditProfile/EditProfilePage.jsx";
import Homepage from "./components/HomePage/homepage.jsx";
import VendorSignup from "./components/SignupPage/VendorSignup.jsx";
import Modelpage from "./components/ModelPage/Modelpage.jsx";
import MainLayout from "./components/MainLayout.jsx";
import PrivateRouteHandler from "./PrivateRouteHandler.jsx";
import VendorHomePage from "./components/VendorPages/VendorHomePage.jsx";
import CreateListing from "./components/VendorPages/CreateListing.jsx";
import MarketPlace from "./components/MarketPlace/Marketplace.jsx";
import Product from "./components/ProductPage/Product.jsx";
import ConfirmOrder from "./components/ConfirmOrder/ConfirmOrder.jsx";
import UserOrders from "./components/UserOrders/UserOrders.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AdminPanel from "./components/Admin/AdminPanel.jsx";
import Home from "./components/Admin/Home.jsx";
import FeatureRequestPage from "./components/Admin/FeatureRequestPage.jsx";
import FeaturedProducts from "./components/Admin/FeaturedProducts.jsx";
import AdminCustomers from "./components/Admin/Admin_Customers.jsx";
import AdminVendor from "./components/Admin/Admin_Vendor.jsx";
import AdminOrder from "./components/Admin/Admin_Orders.jsx";
import PlantHavenLanding from "./components/LandingPage/LandingPage.jsx";
import AdminLogin from "./components/Admin/Login/AdminLogin.jsx";
import TransactionReports from "./components/Admin/Transactions.jsx";
import SettingsPage from "./components/Admin/Setting/EditPassword.jsx";

const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("authToken")
  );

  const [user, setUser] = useState(() => localStorage.getItem("user") || "{}");
  const [parsedUser, setParsedUser] = useState(() => JSON.parse(user));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("authToken"));
      const newUser = localStorage.getItem("user") || "{}";
      setUser(newUser);
      setParsedUser(JSON.parse(newUser));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Routes>
      {/* === Landing page with redirect for signed-in users */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/home" /> : <PlantHavenLanding />
        }
      />

      {!isAuthenticated && (
        <>
          <Route element={<MainLayout />}>
            <Route path="home" element={<Homepage />} />
            <Route path="model" element={<Modelpage />} />
          </Route>

          <Route path="login" element={<Login />} />
          <Route path="signup/user" element={<SignupPage />} />
          <Route path="signup/vendor" element={<VendorSignup />} />
          <Route path="login/admin" element={<AdminLogin />} />
          <Route path="/admin" element={<Navigate to="/login/admin" />} />
          <Route path="admin/feature-page" element={<Navigate to="/login/admin" />} />
                <Route path="admin/featured-products" element={<Navigate to="/login/admin" />} />
                <Route path="admin/customer" element={<Navigate to="/login/admin" />} />
                <Route path="admin/vendor" element={<Navigate to="/login/admin" />} />
                <Route path="admin/orders" element={<Navigate to="/login/admin" />} />
        </>
      )}

      {/* === Protected Routes */}
      <Route element={<PrivateRouteHandler />}>
        <Route path="login" element={<Navigate to="/home" />} />
        <Route path="signup/user" element={<Navigate to="/home" />} />
        <Route path="signup/vendor" element={<VendorSignup />} />

        {parsedUser["role"] === "vendor" ? (
      <>
        <Route path="/home" element={<Navigate to="/vendor-homepage" />} />
        <Route
          path="/vendor-homepage"
          element={<VendorHomePage setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="createlisting" element={<CreateListing />} />
        <Route path="/edit-product/:id" element={<CreateListing />} />
      </>
    ) : parsedUser["role"] === "admin" ? (
     
      <>  
        <Route path="/home" element={<Navigate to="/admin" />} />
        <Route path="/login/admin" element={<Navigate to="/admin" />} />

      <Route path="/admin" element={<AdminPanel />}>
                <Route index element={<Home />} />
                <Route path="feature-page" element={<FeatureRequestPage />} />
                <Route path="featured-products" element={<FeaturedProducts />} />
                <Route path="customer" element={<AdminCustomers />} />
                <Route path="vendor" element={<AdminVendor />} />
                <Route path="orders" element={<AdminOrder />} />
                <Route path="transactions" element={<TransactionReports />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
      </>
    ) : (
      <Route element={<MainLayout />}>
        <Route path="home" element={<Homepage />} />
        <Route path="model" element={<Modelpage />} />
        <Route path="marketplace" element={<MarketPlace />} />
        <Route path="Product/:id" element={<Product />} />
        <Route path="myorders" element={<UserOrders />} />
        <Route path="edit-profile" element={<EditProfilePage />} />
        <Route path="vendor-homepage" element={<Navigate to="/home" />} />
        <Route
          path="confirm-order/:id"
          element={
            <Elements stripe={stripePromise}>
              <ConfirmOrder />
            </Elements>
          }
        />
  </Route>
)}

      </Route>
    </Routes>
  );
};

export default App;
