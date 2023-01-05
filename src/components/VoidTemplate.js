import React from "react";
import { Link } from "react-router-dom";
import VoidRegistersIcon from "../assets/svg/mood-3.svg";

const VoidTemplate = ({ message }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        backgroundColor: "#fafafa",
        width: '100%'
      }}
    >
      <img src={VoidRegistersIcon} alt="" />
      <div style={{ fontSize: "2rem", wordWrap: "true", lineHeight: '30px' }}>{message}</div>
    </div>
  );
};

VoidTemplate.default = ({ to, buttonText, message, onClick }) => (
  <div className="df fdc jc-sb collections__voidTemplate">
    <span className="collections__voidTemplate--message">{message}</span>
    {to || onClick || buttonText ? (
      <Link className="button primary" to={to||'#'} onClick={onClick}>
        {buttonText}
      </Link>
    ) : null}
  </div>
);

export { VoidTemplate };
