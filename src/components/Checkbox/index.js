import React, { useState } from "react";
import "./Checkbox.scss";

const Checkbox = ({ label, value, onClick }) => {
  const [active, setActive] = useState(true);

  return (
    <button
      onClick={() => {
        setActive(!active);
      }}
      className="checkboxButton"
    >
      <input type="checkbox" value={value} checked={active} />
      <label>{label}</label>
    </button>
  );
};

export { Checkbox };
