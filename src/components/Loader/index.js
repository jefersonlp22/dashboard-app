import React from "react";
import "./Loader.scss";
const Loader = ({ color, active, ...props }) => {
  return (
    <div
      className={`loader ${props.className || ""}`}
      style={{
        color: color ? color : "#0489cc",
        ...(!active ? { display: "none" } : "")
      }}
    >
      
    </div>
  );
};

const CircleLoader = ({ color, active, ...props }) => {
  return (
    <div
      className={`circleLoader ${props.className || ""}`}
      style={{
        color: color ? color : "#0489cc",
        ...(!active ? { display: "none" } : "")
      }}
    >
      
    </div>
  );
};

export { Loader, CircleLoader };
