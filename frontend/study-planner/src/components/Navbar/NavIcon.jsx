import { NavLink } from "react-router-dom";

const NavIcon = ({ to = "#", icon, text = "tooltip" }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `sidebar-icon group ${
        isActive
          ? " text-white glass-effect-nav child:${icon} child:scale-110"
          : " text-neutral-400 hover:text-neutral-200"
      } transition-all duration-300 ease-in-out`
    }
  >
    {icon && <span className="fill-white">{icon}</span>}
    <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
  </NavLink>
);

export default NavIcon;
