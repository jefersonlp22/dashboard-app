import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./tag.scss";
import { Icons } from "../Icons";
import { Button } from "../Buttons";
import { SimpleTag } from "./SimpleTag";
import { SelectableTag } from "./SelectableTag";

const Tag = ({
  children,
  color,
  invert,
  onInput,
  editable,
  iconEdit,
  onClick,
  onKeyPress,
  onEnter,
  onDelete,
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
        contentEditable={editable}
        spellCheck="false"
        suppressContentEditableWarning={editable}
      >
        {children || value}
      </div>
      {onDelete ? (
        <button
          style={{ color: style.color }}
          onClick={() => onDelete(props["data-id"])}
        >
          <Icons.delete style={{ marginLeft: 10 }} fill={style.color} />
        </button>
      ) : (
        ""
      )}

      {iconEdit ? (
        <Icons.pencil style={{ marginLeft: 10 }} fill={"#FFF"} />
      ) : (
        ""
      )}
    </div>
  );
};

const TagButton = ({ color, invert, children, ...props }) => {
  let style = {
    background: color,
    border: `1px solid ${color}`,
    color: `white`,
    cursor: "pointer"
  };

  if (invert) {
    style.background = "white";
    style.color = color;
  }

  return (
    <button {...props} className={`tag df fdr alic jc-sb`} style={style}>
      {children}
    </button>
  );
};

const TagSelectable = ({
  color: colorProp,
  invert: invertProp,
  selected,
  onSelect,
  onDelete,
  value,
  children,
  onKeyDown,
  onInput,
  onEnter,
  ...props
}) => {
  const enabledStyle = {
    cursor: "pointer",
    outline: 0
  };

  const disabledStyle = {
    background: "white",
    color: colorProp,
    border: `1px solid ${colorProp}`,
    cursor: "pointer",
    outline: 0
  };

  const [style, setStyle] = useState(enabledStyle);
  const [invert, setInvert] = useState(!selected);
  const [editable, setEditable] = useState(false);
  const [status, setStatus] = useState(selected);
  const [count, setCount] = useState(0);
  const [currentValue, setCurrentValue] = useState(children || value);

  useEffect(() => {
    if (invert) setStyle(disabledStyle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {}, [status]);

  useEffect(() => {
    if (count > 0) {
      if (invert) {
        setStyle(disabledStyle);
        if (editable) setStatus(true);
        if (onSelect) onSelect({ selected: false, ...props });
      } else {
        if (onSelect) onSelect({ selected: true, ...props });
        setStyle(enabledStyle);
      }
    } else {
      setCount(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invert]);

  const editableRef = React.createRef();

  const handleEditable = () => {
    if (!invert) setStatus(true);
    else setStatus(false);

    setEditable(true);
    var node = editableRef.current;
    setTimeout(() => {
      node.focus(node);
    }, 300);
  };

  const handleCancelEdit = () => {
    editableRef.current.innerHTML = value;
    setCurrentValue(value);
    setEditable(false);
  };

  const changeEditableState = () => {
    setEditable(false);
  };

  const handleKeyDown = (e, id) => {
    const content = e.currentTarget.textContent;

    if (e.key === "Enter") {
      e.preventDefault();

      setInvert(!status);
      if (onEnter) onEnter({ content, changeEditableState, id });
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdit();
    }

    if (onKeyDown) onKeyDown();
    if (onInput) onInput();
  };

  const editableBtnStyle = {
    padding: 0,
    margin: 0,
    width: "inherit",
    height: "inherit"
  };

  return (
    <div
      {...props}
      className={`tag df fdr alic jc-sb`}
      style={{
        ...style,
        border: `1px solid ${colorProp}`,
        color: !invert ? "#FFF" : colorProp,
        background: invert ? "#FFF" : colorProp
      }}
    >
      <span
        contentEditable={editable}
        spellCheck="false"
        onClick={() => {
          if (!editable) {
            setInvert(!invert);
          }
        }}
        onBlur={() => {
          handleCancelEdit();
        }}
        suppressContentEditableWarning={editable}
        ref={editableRef}
        onKeyDown={e => handleKeyDown(e, props["data-id"])}
      >
        {currentValue}
      </span>

      {!editable ? (
        <Button
          onClick={handleEditable}
          style={editableBtnStyle}
          className="tagIconButton"
        >
          <Icons.pencil fill={invert ? colorProp : "#FFF"} />
        </Button>
      ) : (
        <Button
          onClick={() => {
            if (onDelete) onDelete(props["data-id"]);
          }}
          className="tagIconButton"
        >
          <Icons.delete fill={invert ? colorProp : "#FFF"} />
        </Button>
      )}
    </div>
  );
};

TagButton.propTypes = {
  invert: PropTypes.bool,
  color: PropTypes.string
};

Tag.propTypes = {
  invert: PropTypes.bool,
  color: PropTypes.string
};

export { Tag, TagButton, TagSelectable, SimpleTag, SelectableTag };
