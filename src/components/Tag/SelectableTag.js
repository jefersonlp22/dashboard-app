import React, { useState, useEffect } from "react";
import "./tag.scss";
import { Icons } from "../Icons";

const SelectableTag = ({
  color: colorProp,
  invert: invertProp,
  icon,
  selected,
  onSelect,
  onDelete,
  value,
  children,
  onKeyDown,
  onInput,
  onEnter,
  clickable,
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

  useEffect(() => {
    if (value && value !== currentValue) setCurrentValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);


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
          if(clickable !== false){
            if (!editable) {
              setInvert(!invert);
            }
          }
        }}
        // onMouseLeave={() => {
        //   if (editable) {
        //     handleCancelEdit();
        //   } else {
        //     console.log("não faz nada");
        //   }
        // }}
        suppressContentEditableWarning={editable}
        ref={editableRef}
        onKeyDown={e => handleKeyDown(e, props["data-id"])}
      >
        {currentValue}
      </span>

      {!editable ? (
        <Icons.pencil
          onClick={handleEditable}
          fill={invert ? colorProp : "#FFF"}
        />
      ) : (
        <>
          <Icons.check
            onClick={() => {
              handleCancelEdit();
            }}
            fill={invert ? colorProp : "#FFF"}
          />
          <Icons.delete
            onClick={() => {
              if (onDelete) onDelete(props["data-id"], changeEditableState);
            }}
            fill={invert ? colorProp : "#FFF"}
          />
        </>
      )}
    </div>
  );
};

export { SelectableTag };
