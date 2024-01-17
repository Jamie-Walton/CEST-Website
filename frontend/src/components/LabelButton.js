import React from "react";

const LabelButton = ({ name, color, selected, onClick, className }) => {
  console.log(color)
  return (
    <div 
        className={`label-button ${className}`} 
        style={selected ? {backgroundColor: "#d0dae6"} : {}} 
        onClick={onClick}
    >
        <svg height="20" width="20">
            <circle cx="10" cy="10" r="6" fill={color} />
        </svg>
        <p>{name}</p>
    </div>
  );
};

export default LabelButton;
