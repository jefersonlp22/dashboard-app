import React from "react";
import "./grid.scss";

const Col = ({ children, className, ...props }) => {
  return (
    <div className={`col ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

const Grid = ({ children, className }) => {
  return <div className={`grid ${className || ""}`}>{children}</div>;
};

const Row = ({ children, className, vcenter, ...props }) => {
  return (
    <div
      className={`row ${className || ""}`}
      style={vcenter ? { alignItems: "center" } : {}}
    >
      {children}
    </div>
  );
};

const Line = ({ x, ...props }) => {
  let classes = "line";

  if (x) {
    classes += ` x${x}`;
  }

  return <div className={classes}>&nbsp;</div>;
};

export { Grid, Col, Row, Line };
