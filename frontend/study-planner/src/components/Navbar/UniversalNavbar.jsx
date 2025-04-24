import React, { useState } from "react";
import PropTypes from "prop-types";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import Nav from "./Nav";

const UniversalNavbar = ({ userInfo, pageTitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <>
      <div className="fixed top-0 w-screen bg-slate-800 flex items-center justify-between px-3 md:px-6 py-2 drop-shadow z-50">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="mr-3 text-white hover:text-gray-300 md:hidden transition-all"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          
          <img src="/favicon.png" alt="Logo" className="w-8 h-8 mr-2" />
          <h2 className="text-md md:text-2xl font-bold text-white py-2 tracking-wide font-montserrat">
            {pageTitle}
          </h2>
        </div>

        <div className="text-white">
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </div>
      </div>

      <Nav isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

UniversalNavbar.propTypes = {
  userInfo: PropTypes.object.isRequired,
  pageTitle: PropTypes.string.isRequired,
};

export default UniversalNavbar;
