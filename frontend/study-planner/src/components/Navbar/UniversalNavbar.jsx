import React from "react";
import PropTypes from "prop-types";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";

const UniversalNavbar = ({ userInfo, pageTitle }) => {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="fixed top-0 w-screen bg-slate-800 flex items-center justify-between px-6 py-2 drop-shadow z-50">
      <div className="flex items-center">
        <img src="/favicon.png" alt="Logo" className="w-8 h-8 mr-2" />
        <h2 className="text-2xl font-bold text-white py-2 tracking-wide font-montserrat">
          {pageTitle}
        </h2>
      </div>

      <div className="text-white">
        <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
      </div>
    </div>
  );
};

UniversalNavbar.propTypes = {
  userInfo: PropTypes.object.isRequired,
  pageTitle: PropTypes.string.isRequired,
};

export default UniversalNavbar;
