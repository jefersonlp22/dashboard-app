import React from "react";

const Column = props => {
  const { children, className } = props;

  return (
    <td {...props} className={`table__column ${className}`}>
      {children}
    </td>
  );
};

export default Column;
