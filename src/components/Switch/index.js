import React from "react";
import "./switch.scss";

const Switch = ({
  isOn = true,
  handleToggle,
  label,
  multipleKey,
  switchLabelClassName = " ",
  style,
  ...props
}) => {
  return (
    <div className="df fdr " style={style}>
      {label ? (
        <div className={"switch__label df fdc "+switchLabelClassName}>
          <div className="switch__title">{label}</div>

          <div>
            {isOn ? (
              <span style={{ color: "#6dc783" }}>
                {props.activeStateLabel || "Ativo"}
              </span>
            ) : (
              <span style={{ color: "#b2b2b3" }}>
                {props.inactiveStateLabel || "Inativo"}
              </span>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      <div>
        <label
          className="react-switch-label"
          style={{ background: isOn ? "#6dc783" : null}}
        >
          <input
            checked={isOn}
            value={multipleKey}
            data-xablaw={multipleKey}
            onChange={e => handleToggle(e, multipleKey)}
            className="react-switch-checkbox"
            type="checkbox"
          />
          <span className={`react-switch-button`} />
        </label>
      </div>
    </div>
  );
};

export { Switch };
