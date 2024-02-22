

import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleFormCreatorClick = () => {
    navigate("/");
  };

  const handleFormListClick = () => {
    navigate("/form-list");
  };

  return (
    <div className="sidebar">
      <button onClick={handleFormCreatorClick}>Form Creator</button>

      <button onClick={handleFormListClick}>Form List</button>
    </div>
  );
};

export default Sidebar;
