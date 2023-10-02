import React from "react";

const Button = ({ name, onClick, style }) => {
  return (
    <div
      className="button"
      style={style}
      onClick={onClick}
    >
      {name}
    </div>
  );
};

export default Button;
