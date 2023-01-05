import React from "react";
import "./TabItem.scss";

const TabItem = props => {
  const { children, active } = props;
  const activeCheck = !active ? { display: "none" } : {};

  return (
    <div {...props} className="tab__item" style={activeCheck}>
      <h2>{children}</h2>
    </div>
  );
};

export default TabItem;
