import React from "react";

const Toggle = ({ action }) => {

    var checked = false;
    const handleChange = event => {
        action(event.target.checked)
        }

  return (
    <label className="switch">
        <input type="checkbox" onChange={handleChange}/>
        <span className="slider"></span>
    </label>
  );
};

export default Toggle;
