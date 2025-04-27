import React from 'react'
import { useState } from 'react'
import './AdminPanel.css'
import Header from './Header'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router'

function AdminPanel() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar}/>
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
      <Outlet />
    </div>
  )
}

export default AdminPanel