import React, { useState } from "react";

import { Icons } from "../Icons";

import "./style.scss";

const Tooltip = ({
  searchOnChange,

  closeReference,

  top,
  showCloseButton,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  const visibilityClass = open ? "showPopover" : "hidePopover";

  return (
    <div className={({ ...props.className }, `tooltip`)} {...props}>
      <div
        className={`tooltipList ${
          top ? "tooltipTop" : " "
        } ${visibilityClass} `}
      >
        <div className="triangle-wrapper">
          <div className="triangle"></div>
        </div>

        <div className="df fdr jc-c alic">
          <div className="tooltipContent">{props.content}</div>
          <div>
            <Icons.close fill="#FFF" onClick={() => setOpen(!open)} />
          </div>
        </div>
      </div>
      <button type="button" onClick={() => setOpen(!open)}>
        {props.children}
      </button>
    </div>
  );
};

export { Tooltip };
