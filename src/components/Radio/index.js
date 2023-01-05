import React from "react";
import "./radio.scss";

function Radio({ children, checked, onClick, onChange, style, ...props }) {
  return (
    <label className="control control-radio" onClick={onClick} style={style}>
      {children}
      <input
        type="radio"
        name="radio"
        value={props.value}
        checked={checked}
        onChange={onChange}
      />
      <div className="control_indicator"></div>
    </label>
  );
}

export { Radio };
