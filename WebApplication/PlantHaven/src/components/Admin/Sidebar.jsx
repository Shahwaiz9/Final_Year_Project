import React from 'react';
import { Link } from 'react-router-dom';
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsCartFill,
  BsFillGearFill
} from 'react-icons/bs';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const menuItems = [
    { icon: BsGrid1X2Fill, title: 'Dashboard', path: '/admin' },
    { icon: BsFillArchiveFill, title: 'Feature Requests', path: '/admin/feature-page' },
    { icon: BsFillGrid3X3GapFill, title: 'Feautured Products', path: '/admin/featured-products' },
    { icon: BsPeopleFill, title: 'Customers', path: '/admin/customer' },
    { icon: BsListCheck, title: 'Vendors', path: '/admin/vendor' },
    { icon: BsCartFill, title: 'Orders', path: '/admin/orders' },
    { icon: BsFillGearFill, title: 'Settings', path: '/settings' }
  ];

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <BsCart3 className='icon_header' /> SHOP
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='sidebar-list'>
        {menuItems.map((item, index) => (
          <li className='sidebar-list-item' key={index}>
            <Link
              to={item.path}
              className="sidebar-link"
              style={{ display: 'block', width: '100%' }}
            >
              <item.icon className='icon' /> {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;