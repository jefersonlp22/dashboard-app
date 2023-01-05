import React, { useState, useEffect } from "react";
import "./tag.scss";

const SimpleTag = ({
  children,
  color,
  invert,
  onInput,
  editable,
  icon,
  onClick,
  onKeyPress,
  onEnter,
  onDelete,
  onBlur,
  className,
  controls,
  remove,
  edit,
  value,
  ...props
}) => {
  const [contentSize, setContentSize] = useState(0);
  const [editableStyle, setEditableStyle] = useState({});

  let style = {
    background: color,
    border: `1px solid ${color}`,
    color: `white`
  };

  if (invert) {
    style.background = "white";
    style.color = color;
  }

  useEffect(() => {
    if (value) {
      setEditableStyle({
        color: style.color
      });
      return;
    }
    if (editable && contentSize === 0) {
      setEditableStyle({
        minWidth: 40,
        maxWidth: 200,
        // boxShadow: `0px 0px 3px ${style.color}`,
        color: style.color
      });
    } else {
      setEditableStyle({
        color: style.color
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`tag df fdr alic jc-sb ${className}`}
      style={style}
      onClick={onClick}
    >
      <div
        style={editableStyle}
        onKeyDown={e => {
          const content = e.currentTarget.textContent;

          if (e.key === "Enter") {
            e.preventDefault();
            if (onEnter) {
              onEnter(content.trim(), e, props["data-id"]);
              setEditableStyle({
                width: "100px",
                color: style.color
              });
            }
          } else {
            setContentSize(content.trim().length);
            if (onInput) onInput(content.trim(), e);
          }         

        }}
        onInput={e => {
          const content = e.currentTarget.textContent;

          if (e.key === "Enter") {
            e.preventDefault();
            if (onEnter) {
              onEnter(content, e, props);
            }
          } else {
            setContentSize(content.length);
            if (onInput) onInput(content, e);
          }
        }}
        onBlur={e => {
          if(onBlur){            
            onBlur(e.currentTarget.textContent.trim(), e, props["data-id"]);
          }
          // setEditableStyle({
          //   width: "100px",
          //   color: style.color
          // });
        }}
        contentEditable={editable}
        spellCheck="false"
        suppressContentEditableWarning={editable}
      >
        {children || value}
      </div>

      {icon ? icon : ""}
    </div>
  );
};

export { SimpleTag };
