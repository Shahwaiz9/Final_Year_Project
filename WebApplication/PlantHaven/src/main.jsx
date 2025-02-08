import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 
{ createBrowserRouter, createRoutesFromElements, RouterProvider, Route } 
from 'react-router-dom'
import Login from './components/LoginPage/Login.jsx'
import SignupPage from './components/SignupPage/SignupPage.jsx'
import MainCarousel from './components/MainCarousel.jsx'
import VendorSignup from './components/SignupPage/VendorSignup.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
  <>
    <Route path="/" element={<App/>}>
    <Route path='' element={<MainCarousel/>}></Route>
    </Route>

     <Route path="login" element={<Login />} />
     <Route path="signup/user" element={<SignupPage />} />
     <Route path="signup/vendor" element={<VendorSignup />} />
  </>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)