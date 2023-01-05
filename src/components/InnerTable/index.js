import React from "react";
import "./innerTable.scss";
const Tr = ({ children }) => {
  return <div className="tr">{children}</div>;
};

const Td = ({ children, ...props }) => {
  return <div className={`td ${props.className || ""}`}>{children}</div>;
};

const Tbody = ({ children }) => {
  return <div className="tbody">{children}</div>;
};

const Thead = ({ children }) => {
  return <div className="thead">{children}</div>;
};

const InnerTable = ({ children }) => {
  return <div className="innerTable">{children}</div>;
};

export { InnerTable, Tr, Td, Tbody, Thead };
