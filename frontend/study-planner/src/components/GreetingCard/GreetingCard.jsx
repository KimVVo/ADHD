import React from "react";
import PropTypes from "prop-types";

const GreetingCard = ({ username }) => {
  const getGreetingMessage = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good morning";
    } else if (currentHour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  return (
    <div className="bg-blue-100 p-3 rounded-lg shadow-md inline-block">
      <h1 className="text-2xl font-bold text-blue-800">
        {`${getGreetingMessage()}, ${username}!`}
      </h1>
    </div>
  );
};

GreetingCard.propTypes = {
  username: PropTypes.string.isRequired,
};

export default GreetingCard;
