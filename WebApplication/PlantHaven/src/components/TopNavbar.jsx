import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../assets/PlantHavenLogo.png";

const navItems = [
  { id: 1, text: "Home", path: "/" },
  { id: 2, text: "Detect Disease", path: "/model" },
  { id: 3, text: "MarketPlace", path: "/marketplace" },
  { id: 4, text: "My Orders", path: "/myorders" },
];

const TopNavbar = () => {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Moved inside component

  useEffect(() => {
    if (nav) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [nav]);

  const handleNav = () => {
    setNav(!nav);
  };

  const closeMobileMenu = () => {
    setNav(false);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    location.reload(); // Refresh the page to update the UI
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 h-24 backdrop-blur-lg bg-white/10 shadow-gray-800 shadow-md border-b-2 border-gray-400">
        <div className="relative flex justify-between items-center h-full mx-auto px-6 lg:px-10 xl:px-20">
          {/* Logo */}
          <Link to="/" className="group">
            <img
              src={logo}
              alt="Plant Haven Logo"
              className="h-22 transition-transform duration-300 
                       hover:scale-105 drop-shadow-lg"
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden sm:flex items-center gap-1 md:gap-4 lg:gap-6">
            {navItems.map((item) => (
              <li key={item.id} className="list-none">
                <Link
                  to={item.path}
                  className="px-5 py-2.5 rounded-lg hover:bg-[#276749] 
                           transition-all duration-300 cursor-pointer
                           border-b-3 border-transparent
                           hover:border-[#68d391] font-medium
                           text-black hover:text-[#c6f6d5]
                           focus:outline-none focus-visible:ring-2 
                           focus-visible:ring-[#68d391]"
                >
                  {item.text}
                </Link>
              </li>
            ))}
            {user ? (
              <li
                onClick={logout}
                className="list-none px-5 py-2.5 rounded-lg hover:bg-[#276749] 
                           transition-all duration-300 cursor-pointer
                           border-b-3 border-transparent
                           hover:border-[#68d391] font-medium
                           text-black hover:text-[#c6f6d5]
                           focus:outline-none focus-visible:ring-2 
                           focus-visible:ring-[#68d391]"
              >
                LogOut
              </li>
            ) : (
              <li className="list-none">
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-lg hover:bg-[#276749] 
                           transition-all duration-300 cursor-pointer
                           border-b-3 border-transparent
                           hover:border-[#68d391] font-medium
                           text-black hover:text-[#c6f6d5]
                           focus:outline-none focus-visible:ring-2 
                           focus-visible:ring-[#68d391]"
                >
                  LogIn
                </Link>
              </li>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={handleNav}
            aria-label="Toggle navigation menu"
            aria-expanded={nav}
            className="sm:hidden p-3 rounded-lg hover:bg-[#276749] 
                     transition-colors duration-300 relative z-[70]
                     focus:outline-none focus-visible:ring-2 
                     focus-visible:ring-[#68d391]"
          >
            <div className="flex flex-col gap-1.5 w-6">
              <span
                className={`h-0.5 bg-[#68d391] transition-all duration-300 ${
                  nav ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`h-0.5 bg-[#68d391] transition-all duration-300 ${
                  nav ? "opacity-0 -translate-x-4" : ""
                }`}
              />
              <span
                className={`h-0.5 bg-[#68d391] transition-all duration-300 ${
                  nav ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 sm:hidden transition-all duration-500 
                  backdrop-blur-lg bg-white/20 z-[60] ${
                    nav ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
        onClick={closeMobileMenu}
      >
        {/* Close Button */}
        <button
          onClick={handleNav}
          aria-label="Close navigation menu"
          className="absolute top-8 right-6 p-3 rounded-lg hover:bg-[#276749] 
                   transition-colors duration-300 z-[70]
                   focus:outline-none focus-visible:ring-2 
                   focus-visible:ring-[#68d391]"
        >
          <div className="flex flex-col gap-1.5 w-6">
            <span className="h-0.5 bg-[#68d391] rotate-45 translate-y-[7px]" />
            <span className="h-0.5 bg-[#68d391] -rotate-45 -translate-y-[7px]" />
          </div>
        </button>

        {/* Mobile Menu Items */}
        <div
          className="relative flex flex-col items-center pt-32 space-y-8 h-full"
          aria-hidden={!nav}
        >
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="text-2xl font-medium text-gray-900 hover:text-[#c6f6d5] border-b-3 border-transparent
                       transition-colors duration-300 py-2.5 px-5 rounded-lg
                       hover:bg-[#276749] hover:border-[#68d391] cursor-pointer
                       focus:outline-none focus-visible:ring-2 
                       focus-visible:ring-[#68d391]"
              onClick={closeMobileMenu}
            >
              {item.text}
            </Link>
          ))}

          {/* Mobile Login/Logout Button */}
          {user ? (
            <button
              onClick={() => {
                logout();
                closeMobileMenu();
              }}
              className="text-2xl font-medium text-gray-900 hover:text-[#c6f6d5] border-b-3 border-transparent
                       transition-colors duration-300 py-2.5 px-5 rounded-lg
                       hover:bg-[#276749] hover:border-[#68d391] cursor-pointer
                       focus:outline-none focus-visible:ring-2 
                       focus-visible:ring-[#68d391]"
            >
              LogOut
            </button>
          ) : (
            <Link
              to="/login"
              className="text-2xl font-medium text-gray-900 hover:text-[#c6f6d5] border-b-3 border-transparent
                       transition-colors duration-300 py-2.5 px-5 rounded-lg
                       hover:bg-[#276749] hover:border-[#68d391] cursor-pointer
                       focus:outline-none focus-visible:ring-2 
                       focus-visible:ring-[#68d391]"
              onClick={closeMobileMenu}
            >
              LogIn
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default TopNavbar;
