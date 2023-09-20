import React from "react";

const Button = ({ name, onClick }) => {
  return (
    <div
      className="roi-button"
      onClick={onClick}
    >
      {name}
    </div>
  );
};

export default Button;
