import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/PlantHavenLogo.png";

const navItems = [
  { id: 1, text: "Home", path: "/home" },
  { id: 2, text: "Detect Disease", path: "/model" },
  { id: 3, text: "MarketPlace", path: "/marketplace" },
  { id: 4, text: "My Orders", path: "/myorders" },
];

const TopNavbar = () => {
  const [nav, setNav] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = nav ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [nav]);

  const handleNav = () => setNav(!nav);
  const closeMobileMenu = () => setNav(false);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 h-24 backdrop-blur-lg bg-white/10 shadow-gray-800 shadow-md border-b-2 border-gray-400">
        <div className="relative flex justify-between items-center h-full mx-auto px-6 lg:px-10 xl:px-20">
          <Link to="/home" className="group">
            <img
              src={logo}
              alt="Plant Haven Logo"
              className="h-22 transition-transform duration-300 hover:scale-105 drop-shadow-lg"
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden sm:flex items-center gap-4 lg:gap-6">
            {navItems.map((item) => (
              <li key={item.id} className="list-none">
                <Link
                  to={item.path}
                  className={`px-5 py-2.5 rounded-lg transition-all duration-300 cursor-pointer border-b-3
                    ${
                      isActive(item.path)
                        ? "border-[#68d391] text-[#c6f6d5] bg-[#276749]"
                        : "border-transparent text-black hover:text-[#c6f6d5] hover:bg-[#276749]"
                    }
                    hover:border-[#68d391] font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#68d391]`}
                >
                  {item.text}
                </Link>
              </li>
            ))}

            {user ? (
              <li className="list-none relative" ref={dropdownRef}>
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#276749] cursor-pointer transition-all"
                  onClick={() => setProfileDropdown(!profileDropdown)}
                >
                  <img
                    src={
                      user.profilePic ||
                      "https://cdn-icons-png.flaticon.com/512/219/219970.png"
                    }
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <span className="font-medium text-black">{user.name}</span>
                </div>

                {/* Desktop Dropdown */}
                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-teal-700/50 backdrop-blur-lg rounded-lg shadow-lg py-4 z-50 border border-gray-400">
                    <div className="px-4 pb-4 flex flex-col items-center">
                      <div className="relative mb-3">
                        <img
                          src={
                            user.profilePic ||
                            "https://cdn-icons-png.flaticon.com/512/219/219970.png"
                          }
                          alt="Profile"
                          className="w-16 h-16 rounded-full object-cover mx-auto"
                        />
                        <button className="absolute bottom-0 right-0 bg-white/80 rounded-full p-1 shadow-md">
                          <Link to="/edit-profile">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-gray-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </Link>
                        </button>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 text-center">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-400 text-center">
                        {user.email}
                      </p>
                    </div>
                    <div className="border-t border-gray-400 pt-2">
                      <button
                        onClick={logout}
                        className="block w-full text-left px-6 py-3 text-sm text-gray-900 hover:bg-white/20"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ) : (
              <li className="list-none">
                <Link
                  to="/login"
                  className={`px-5 py-2.5 rounded-lg transition-all duration-300 cursor-pointer border-b-3
                    ${
                      isActive("/login")
                        ? "border-[#68d391] text-[#c6f6d5] bg-[#276749]"
                        : "border-transparent text-black hover:text-[#c6f6d5] hover:bg-[#276749]"
                    }
                    hover:border-[#68d391] font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#68d391]`}
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
            className="sm:hidden p-3 rounded-lg hover:bg-[#276749] transition-colors relative z-[70] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#68d391]"
          >
            <div className="flex flex-col gap-1.5 w-6">
              <span
                className={`h-0.5 bg-[#68d391] transition-all ${
                  nav ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`h-0.5 bg-[#68d391] transition-all ${
                  nav ? "opacity-0 -translate-x-4" : ""
                }`}
              />
              <span
                className={`h-0.5 bg-[#68d391] transition-all ${
                  nav ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 sm:hidden transition-all duration-500 backdrop-blur-lg bg-white/20 z-[60] 
        ${nav ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={closeMobileMenu}
      >
        <button
          onClick={handleNav}
          aria-label="Close navigation menu"
          className="absolute top-8 right-6 p-3 rounded-lg hover:bg-[#276749] transition-colors z-[70] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#68d391]"
        >
          <div className="flex flex-col gap-1.5 w-6">
            <span className="h-0.5 bg-[#68d391] rotate-45 translate-y-[7px]" />
            <span className="h-0.5 bg-[#68d391] -rotate-45 -translate-y-[7px]" />
          </div>
        </button>

        <div
          className="relative flex flex-col items-center pt-32 space-y-8 h-full"
          aria-hidden={!nav}
        >
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`text-2xl font-medium ${
                isActive(item.path)
                  ? "text-[#c6f6d5] bg-[#276749]"
                  : "text-gray-900 hover:text-[#c6f6d5]"
              } border-b-3 ${
                isActive(item.path) ? "border-[#68d391]" : "border-transparent"
              }
                transition-colors py-2.5 px-5 rounded-lg hover:bg-[#276749] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#68d391]`}
              onClick={closeMobileMenu}
            >
              {item.text}
            </Link>
          ))}

          {user ? (
            <div className="w-full px-6">
              <div className="flex flex-col items-center pb-6">
                <div className="relative mb-4">
                  <img
                    src={
                      user.profilePic ||
                      "https://cdn-icons-png.flaticon.com/512/219/219970.png"
                    }
                    alt="Profile"
                    className="w-15 h-15 rounded-full object-cover mx-auto"
                  />
                  <button className="absolute bottom-0 right-0 bg-white/80 rounded-full p-1 shadow-md">
                    <Link to="/edit-profile">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </Link>
                  </button>
                </div>
                <h3 className="text-xl font-medium text-gray-900 text-center mb-1">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  {user.email}
                </p>
              </div>
              <button
                onClick={logout}
                className="w-full py-4 border-t border-gray-400 text-lg font-medium text-gray-900 hover:text-[#68d391]"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`text-2xl font-medium ${
                isActive("/login")
                  ? "text-[#c6f6d5] bg-[#276749]"
                  : "text-gray-900 hover:text-[#c6f6d5]"
              } border-b-3 ${
                isActive("/login") ? "border-[#68d391]" : "border-transparent"
              }
                transition-colors py-2.5 px-5 rounded-lg hover:bg-[#276749] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#68d391]`}
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
