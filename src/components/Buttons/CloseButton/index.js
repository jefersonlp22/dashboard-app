import React from "react";
import "./CloseButton.scss";
import CloseIcon from "./closeIcon.svg";

const CloseButton = props => {
  return (
    <button {...props} onClick={props.onClick} className="closeButton">
      <img src={CloseIcon} alt="" />
    </button>
  );
};

export default CloseButton;
