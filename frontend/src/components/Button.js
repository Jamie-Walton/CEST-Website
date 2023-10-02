import React from "react";

const Button = ({ name, onClick, style, className }) => {
  return (
    <div
      className={`button ${className}`}
      style={style}
      onClick={onClick}
    >
      {name}
    </div>
  );
};

export default Button;
