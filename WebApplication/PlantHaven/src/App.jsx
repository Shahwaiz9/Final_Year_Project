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
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("authToken")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("authToken"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : {};

  return (
    <div>
      <Routes>
        {!isAuthenticated && (
          <>
            <Route path="login" element={<Login />} />
            <Route path="signup/user" element={<SignupPage />} />
            <Route path="signup/vendor" element={<VendorSignup />} />

            <Route path="/admin" element={<AdminPanel />}>
              <Route index element={<Home />} />
              <Route path="feature-page" element={<FeatureRequestPage />} />
              <Route path="featured-products" element={<FeaturedProducts />} />
              <Route path="customer" element={<AdminCustomers />} />
              <Route path="vendor" element={<AdminVendor />} />
              <Route path="orders" element={<AdminOrder />} />
            </Route>

            <Route path="/" element={<MainLayout />}>
              <Route index element={<Homepage />} />
              <Route path="model" element={<Modelpage />} />
            </Route>
          </>
        )}

        {/* Protected Routes */}
        <Route element={<PrivateRouteHandler />}>
          <Route path="login" element={<Navigate to="/" />} />
          <Route path="signup/user" element={<Navigate to="/" />} />
          <Route path="signup/vendor" element={<VendorSignup />} />

          {parsedUser["role"] == "vendor" ? (
            <>
              <Route path="/" element={<Navigate to="/vendor-homepage" />} />
              <Route
                path="/vendor-homepage"
                element={
                  <VendorHomePage setIsAuthenticated={setIsAuthenticated} />
                }
              />
              <Route path="createlisting" element={<CreateListing />} />
              <Route path="/edit-product/:id" element={<CreateListing />} />
            </>
          ) : (
            <>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Homepage />} />
                <Route path="/edit-profile" element={<EditProfilePage />} />
                <Route path="model" element={<Modelpage />} />
                <Route path="marketplace" element={<MarketPlace />} />
                <Route path="Product/:id" element={<Product />} />
                <Route path="myorders" element={<UserOrders />} />
                <Route
                  path="/confirm-order/:id"
                  element={
                    <Elements stripe={stripePromise}>
                      <ConfirmOrder />
                    </Elements>
                  }
                />
                <Route path="vendor-homepage" element={<Navigate to="/" />} />
              </Route>
            </>
          )}
        </Route>
      </Routes>
    </div>
  );
};

export default App;
