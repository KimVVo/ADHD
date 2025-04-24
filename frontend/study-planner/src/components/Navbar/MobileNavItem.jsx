import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const MobileNavItem = ({ to, icon, text, onClick }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
          isActive 
            ? "bg-slate-700 text-white" 
            : "text-white hover:bg-slate-700 hover:bg-opacity-70"
        }`
      }
      onClick={onClick}
    >
      <span>{icon}</span>
      <span className="font-medium">{text}</span>
    </NavLink>
  );
};

MobileNavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default MobileNavItem;