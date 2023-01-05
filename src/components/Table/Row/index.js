import React from "react";
const Row = props => {
  const { children, className } = props;

  return (
    <tr {...props} className={`table__row ${className ? className : ""}`}>
      {children}
    </tr>
  );
};

export default Row;
