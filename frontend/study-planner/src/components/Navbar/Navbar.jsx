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

  // Navigate to the login page when the user clicked the Logout button
  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
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
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">Study Planner</h2>

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

      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
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
