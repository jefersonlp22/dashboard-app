import React from "react";
import "./Status.scss";
const Status = ({ value, description }) => {
  return (
    <div className="status__container">
      <div className={`status status--${value}`}></div>
      {description ? (
        <div className="status__description">{description}</div>
      ) : (
        ""
      )}
    </div>
  );
};

export { Status };
