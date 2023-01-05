import React from "react";
import { CloseButton } from "../Buttons";
import "./Modal.scss";

const Modal = ({ children, visible, onClose, classes }) => {
  const visibleStyle = !visible ? { display: "none" } : {};

  return (
    <div className={ `modal ${classes}` } style={{ ...visibleStyle }}>
      <div className="modal__container">
        {onClose ? <CloseButton onClick={onClose} /> : null}
        {children}
      </div>
    </div>
  );
};

export { Modal };
