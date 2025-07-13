import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsCartFill,
  BsFillGearFill,
  BsReceiptCutoff,
} from "react-icons/bs";
import logo from "../../assets/PlantHavenLogo.png";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { icon: BsGrid1X2Fill, title: "Dashboard", path: "/admin" },
    {
      icon: BsFillArchiveFill,
      title: "Feature Requests",
      path: "/admin/feature-page",
    },
    {
      icon: BsFillGrid3X3GapFill,
      title: "Featured Products",
      path: "/admin/featured-products",
    },
    { icon: BsPeopleFill, title: "Customers", path: "/admin/customer" },
    { icon: BsListCheck, title: "Vendors", path: "/admin/vendor" },
    { icon: BsCartFill, title: "Orders", path: "/admin/orders" },
    { icon: BsReceiptCutoff, title: "Reports", path: "/admin/transactions" },
    { icon: BsFillGearFill, title: "Settings", path: "/admin/settings" },
  ];

  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <img
          src={logo}
          alt="Plant Haven Logo"
          className="h-20 transition-transform duration-300 hover:scale-105 drop-shadow-lg"
        />
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">
        {menuItems.map((item, index) => {
          const isActive =
            currentPath === item.path ||
            currentPath.startsWith(`${item.path}/`);

          return (
            <li
              className={`sidebar-list-item ${isActive ? "active" : ""}`}
              key={index}
            >
              <Link
                to={item.path}
                className={`sidebar-link ${isActive ? "active" : ""}`}
                style={{ display: "block", width: "100%" }}
              >
                <item.icon className="icon" /> {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;
