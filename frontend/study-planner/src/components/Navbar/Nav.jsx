import { NavLink } from "react-router-dom";
import { Home, Calendar, Timer, MessageCircle } from "lucide-react";
import { MdSpaceDashboard } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { FaReadme } from "react-icons/fa6";
import { TbMessageChatbotFilled } from "react-icons/tb";
import NavIcon from "./NavIcon";

const Nav = () => {
  return (
    <div className="navbox fixed left-0 h-screen w-20 flex flex-col bg-slate-800 justify-center p-0 m-0 rounded-r-sm shadow-sm shadow-neutral-600 glass-effect-sidenav">
      <NavIcon to="/dashboard" icon={<MdSpaceDashboard size="30"/>} text="Dashboard"/>
      {/* <div className="sidebox"></div> */}
      <NavIcon to="/calendar" icon={<FaCalendarAlt size="30"/>} text="Calendar"/>
      {/* <div className="sidebox"></div> */}
      <NavIcon to="/study-mode" icon={<FaReadme size="30"/>} text="Study Mode" />
      {/* <div className="sidebox"></div> */}
      <NavIcon to="/chatbot" icon={<TbMessageChatbotFilled size="30"/>} text="Chatbot"/>
      {/* <div className="sidebox"></div> */}
    </div>
  );
};

export default Nav;
