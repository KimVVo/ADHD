import React from "react";
import PropTypes from "prop-types";
import { RiDashboardFill } from "react-icons/ri";
import { FaCalendarAlt } from "react-icons/fa";
import { FaReadme } from "react-icons/fa6";
import { MdQuiz } from "react-icons/md";
import { X } from "lucide-react";
import NavIcon from "./NavIcon";

const Nav = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Desktop Sidebar - Always visible on md and larger screens */}
      <div className="fixed left-0 top-0 h-full w-20 hidden md:flex flex-col bg-slate-800 justify-center p-0 m-0 rounded-r-sm shadow-sm shadow-neutral-600 glass-effect-sidenav z-10">
        <NavIcon to="/dashboard" icon={<RiDashboardFill size="30" />} text="Dashboard" />
        <NavIcon to="/calendar" icon={<FaCalendarAlt size="30" />} text="Calendar" />
        <NavIcon to="/study-mode" icon={<FaReadme size="30" />} text="Study Mode" />
        <NavIcon to="/detector" icon={<MdQuiz size="30" />} text="Detector" />
      </div>

      {/* Mobile Sidebar - Slides in from left when isOpen is true */}
      <div 
        className={`fixed left-0 top-0 h-full bg-slate-800 w-64 glass-effect-sidenav z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex justify-end p-4">
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-all"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex flex-col space-y-4 px-4 py-6">
          {/* Mobile menu items with both icon and text */}
          <MobileNavItem to="/dashboard" icon={<RiDashboardFill size="24" />} text="Dashboard" onClick={onClose} />
          <MobileNavItem to="/calendar" icon={<FaCalendarAlt size="24" />} text="Calendar" onClick={onClose} />
          <MobileNavItem to="/study-mode" icon={<FaReadme size="24" />} text="Study Mode" onClick={onClose} />
          <MobileNavItem to="/detector" icon={<MdQuiz size="24" />} text="Detector" onClick={onClose} />
        </div>
      </div>
    </>
  );
};

// Mobile navigation item component with both icon and text
const MobileNavItem = ({ to, icon, text, onClick }) => {
  return (
    <a 
      href={to} 
      className="flex items-center space-x-3 text-white hover:bg-slate-700 p-3 rounded-lg transition-colors"
      onClick={onClick}
    >
      <span className="text-white">{icon}</span>
      <span className="font-medium">{text}</span>
    </a>
  );
};

MobileNavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

Nav.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Nav;
