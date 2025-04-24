import React, { useState } from "react";
import PropTypes from "prop-types";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = ({
  userInfo,
  onSearchTask,
  handleclearSearch,
  showSearchBar,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="fixed top-0 w-screen bg-slate-800 flex items-center justify-between px-3 md:px-6 py-2 drop-shadow z-40">
      <div className="flex items-center">
        <img src="/favicon.png" alt="Logo" className="w-8 h-8 mr-2" />
        <h2 className="text-sm md:text-2xl font-bold text-white py-2 tracking-wide font-montserrat">ADHD Study Planner</h2>
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
        <ProfileInfo userInfo={userInfo} onLogout={onLogout} className="text-white" />
      </div>
    </div>
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
