import React, { useState, useRef } from "react";
import { Icons } from "../index";
import "./popover.scss";

const PopoverItem = ({ ...props }) => {
  return (
    <button className="popoverItem df fdr alic jc-sb" type="button" {...props}>
      {props.children}
    </button>
  );
};

const Popover = ({
  searchOnChange,
  headerSearch,
  customHeader,
  searchSubmit,
  closeReference,
  footer,
  top,
  showCloseButton,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  const visibilityClass = open ? "showPopover" : "hidePopover";

  const inputSearch = useRef(null);

  return (
    <div className={({ ...props.className }, `popover`)} {...props}>
      <div
        className={`popoverList ${top ? "popTop" : " "} ${visibilityClass} `}
      >
        <div className="triangle-wrapper">
          <div className="triangle"></div>
        </div>

        <div className="title df fdr alic jc-sb">
          {headerSearch ? (
            <div className="df fdr popover__headerSearch">
              <Icons.searchSmall
                fill="#b2b2b3"
                onClick={() => inputSearch.current.focus()}
              />
              <input
                ref={inputSearch}
                type="text"
                placeholder="Pesquisar"
                onChange={() => searchOnChange(inputSearch)}
              />
              <Icons.closeSmall fill="#4a4a4a" onClick={() => setOpen(false)} />
            </div>
          ) : null}

          {props.hasOwnProperty("title") ? (
            <div className="title--text">{props.title}</div>
          ) : null}

          {showCloseButton ? (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
              }}
              style={{ padding: "20px" }}
            >
              x
            </button>
          ) : null}

          {customHeader ? (
            <div className="df fdr popover__headerSearch">
              {customHeader}
              <Icons.closeSmall fill="#4a4a4a" onClick={() => setOpen(false)} />
            </div>
          ) : null}
        </div>
        <div className="popoverItems">{props.content}</div>

        {footer ? footer : null}
      </div>
      <button type="button" onClick={() => setOpen(!open)}>
        {props.children}
      </button>
    </div>
  );
};

export { Popover, PopoverItem };
