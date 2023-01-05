import React from "react";
import "./PenButton.scss";
import PenIcon from "./penIcon.svg";
const PenButton = ({ props }) => {
  return (
    <button {...props} className="penButton">
      <img src={PenIcon} alt="" />
    </button>
  );
};

export default PenButton;
