import React from "react";
import { Link } from "react-router-dom";
import { AiFillHome, AiFillCalendar, AiFillClockCircle } from "react-icons/ai"; // Import the icons

const Sidebar = () => {
  return (
    <aside className="fixed top-50 left-0 h-[calc(100%-64px)] w-16 bg-white border-r-white ">
      <nav className="h-full flex flex-col items-center py-4">
        <ul className="flex-1 space-y-8">
          <li className="group relative">
            <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">
              <AiFillHome size={32} />
              <span className="absolute left-full ml-2 w-max opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-700 text-white text-xs rounded py-1 px-2">
                Home
              </span>
            </Link>
          </li>
          <li className="group relative">
            <Link to="/calendar" className="text-gray-700 hover:text-gray-900">
              <AiFillCalendar size={32} />
              <span className="absolute left-full ml-2 w-max opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-700 text-white text-xs rounded py-1 px-2">
                Calendar
              </span>
            </Link>
          </li>
          <li className="group relative">
            <Link to="/study-mode" className="text-gray-700 hover:text-gray-900">
              <AiFillClockCircle size={32} />
              <span className="absolute left-full ml-2 w-max opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-700 text-white text-xs rounded py-1 px-2">
                Study Mode
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
