import React from "react";
import "./alert.scss";

const AlertButton = props => {
  return (
    <button
      type="button"
      className={({ ...props.className }, `alertButton`)}
      {...props}
    >
      {props.children}
    </button>
  );
};

const Alert = ({ children, label, show, type }) => {
  const styles = show ? "show" : "hide";
  const types = {
    error: "alertError",
    success: "alertSuccess",
    facebook: "alertFacebook"
  };  
  return (
    <div className={`alert ${types[type] || ""} ${styles}`}>
      <div className="df fdr alic jc-sb height100">{children}</div>
    </div>
  );
};

export { Alert, AlertButton };
