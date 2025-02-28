import React from 'react'
import { Navigate, Outlet } from 'react-router'

function PrivateRouteHandler() {
  const token=localStorage.getItem('authToken')
  
  return token?<Outlet/>:<Navigate to="login"/>
}

export default PrivateRouteHandler