import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import ProfileInfo from "../Cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";
import Nav from "../Navbar/Nav";

const Navbar = ({
  userInfo,
  onSearchTask,
  handleclearSearch,
  showSearchBar,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchTask(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleclearSearch();
  };

  return (
    <>
      <div className="fixed top-0 w-screen bg-slate-800 flex items-center justify-between px-3 md:px-6 py-2 drop-shadow z-40">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="mr-4 md:hidden text-white hover:scale-110 transition"
          >
            <Menu size={28} />
          </button>
          <img src="/favicon.png" alt="Logo" className="w-8 h-8 mr-2" />
          <h2 className="text-sm md:text-2xl font-bold text-white py-2 tracking-wide font-montserrat">
            ADHD Study Planner
          </h2>
        </div>

        {showSearchBar && (
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => {
              setSearchQuery(target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
        )}

        <div className="text-white">
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </div>
      </div>

      <Nav isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

Navbar.propTypes = {
  userInfo: PropTypes.object.isRequired,
  onSearchTask: PropTypes.func.isRequired,
  handleclearSearch: PropTypes.func.isRequired,
  showSearchBar: PropTypes.bool,
};

Navbar.defaultProps = {
  showSearchBar: true,
};

export default Navbar;
