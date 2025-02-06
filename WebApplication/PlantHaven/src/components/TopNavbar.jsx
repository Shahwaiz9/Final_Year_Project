import React, { useState } from "react";
import logo from "../assets/PlantHavenLogo.png";

const TopNavbar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const closeMobileMenu = () => {
    setNav(false);
  };

  const navItems = [
    { id: 1, text: "Home" },
    { id: 2, text: "Company" },
    { id: 3, text: "Resources" },
    { id: 4, text: "About" },
    { id: 5, text: "Contact" },
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-50 h-24 bg-gradient-to-r from-[rgba(56,161,105,0.97)] to-[rgba(47,133,90,0.97)] shadow-lg">
      <div className="relative flex justify-between items-center h-full mx-auto px-6 xl:px-16">
        {/* Logo */}
        <div className="group">
          <img
            src={logo}
            alt="Logo"
            className="h-23 transition-transform duration-300 
                     hover:scale-105 drop-shadow-lg"
          />
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <li
              key={item.id}
              className="px-6 py-3 rounded-lg hover:bg-[#276749] 
                       transition-all duration-300 cursor-pointer
                       border-b-2 border-transparent
                       hover:border-[#68d391] font-medium
                       text-white hover:text-[#c6f6d5]"
            >
              {item.text}
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={handleNav}
          className="md:hidden p-3 rounded-lg hover:bg-[#276749] 
                   transition-colors duration-300 relative z-50"
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

        {/* Mobile Menu */}
        <div
          className={`fixed md:hidden inset-0 bg-[#38a169]/95 transition-all duration-500 ${
            nav ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          {/* Close Button Backdrop */}
          <div className="absolute inset-0 z-40" onClick={closeMobileMenu} />

          <div className="relative flex flex-col items-center pt-32 space-y-8 z-50">
            {navItems.map((item) => (
              <a
                key={item.id}
                className="text-2xl font-medium text-white hover:text-[#c6f6d5] 
                         transition-colors duration-300 py-3 px-6 rounded-lg
                         hover:bg-[#276749]"
                onClick={closeMobileMenu}
              >
                {item.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
