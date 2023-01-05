import React from "react";
import "./Buttons.style.scss";
import PenButton from "./PenButton";
import CloseButton from "./CloseButton";

function Button({
  primary,
  secundary,
  disabled,
  loading,
  outline,
  success,
  cancel,
  text,
  children,
  className,
  ...props
}) {
  let style = "button";

  if (disabled) {
    style += " disabled";
  } else if (primary) {
    style += " primary";
  } else if (secundary) {
    style += " secondary";
  } else if (outline) {
    style += " outline";
  } else if (success) {
    style += " success";
  }else if (cancel) {
    style += " cancel";
  }

  return (
    <button
      disabled={disabled}
      className={`${style} ${className || ""}`}
      {...props}
    >
      {loading ? (
        <div className="buttonLoader"></div>
      ) : (
        <>{text ? text : children}</>
      )}
    </button>
  );
}

function InnerEdgeButton({
  primary,
  secundary,
  disabled,
  success,
  loading,
  outline,
  text,
  children,
  className,
  ...props
}) {
  let style = "button innerEdge";

  if (disabled) {
    style += " inactive";
  } else if (primary) {
    style += " primary";
  } else if (secundary) {
    style += " secondary";
  } else if (outline) {
    style += " outline";
  } else if (success) {
    style += " success";
  }

  return (
    <button
      disabled={disabled}
      className={`${style} ${className || ""}`}
      {...props}
    >
      <div>
        {loading ? (
          <div className="buttonLoader"></div>
        ) : (
          <>{text ? text : children}</>
        )}
      </div>
    </button>
  );
}

export { Button, PenButton, CloseButton, InnerEdgeButton };
