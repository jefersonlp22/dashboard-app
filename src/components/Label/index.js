import React from "react";
import "./label.scss";
const Label = ({ children, className }) => {
  return <div className={`label ${className || ""}`}>{children}</div>;
};

export { Label };
