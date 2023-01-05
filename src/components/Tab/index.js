import React from "react";

import { useDispatch } from "react-redux";
import TabItem from "./TabItem";
import "./Tab.scss";
import { Link, useLocation } from "react-router-dom";

const Tab = props => {
  let location = useLocation();
  const dispatch = useDispatch();

  const { children, className } = props;

  return (
    <div {...props} className={`tab ${className}`}>
      <div className="tab__list">
        {children && children.length
          ? children.map((item, index) =>
              item.props.hasOwnProperty("title") ? (
                <Link
                  to={item.props.to}
                  key={index}
                  onClick={() => {
                    dispatch({ type: "RESET_PRODUCT" });
                  }}
                  className={`tab__selection ${
                    location.pathname === item.props.to || location.pathname.includes(item.props.parent)
                      ? "tab__selection--active"
                      : ""
                  }`}
                >
                  {item.props.title}
                </Link>
              ) : (
                ""
              )
            )
          : ""}
      </div>

      {props.children}
    </div>
  );
};

export { Tab, TabItem };
