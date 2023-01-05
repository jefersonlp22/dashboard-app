import React from "react";

import { Card, Line } from "../../components";
import ComingIcon from "../../assets/svg/mood-4.svg";

import "./styles.scss";

const ComingSoon = (props) => {
  return (
    <div>
      <div style={{ height: 40, display: "flex", alignItems: "center" }}>
        <h1>{props.pageTitle}</h1>
      </div>
      <Line />
      <Card>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
          }}
        >
          <img src={ComingIcon} alt="" />
          <div className="df fdc">
            <span className="commingTitle">
              {props?.title || "Segura a ansiedade!"}
            </span>
            {(
              <div style={{ width: 400 }} className="commingText">
                {props?.message}
              </div>
            ) || (
              <span className="commingText">
                Falta pouco para você conhecer esta nova área.
              </span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ComingSoon;
