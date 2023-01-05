import React from "react";
import { IcNext } from "../../components/OnawaIcon";

const Breadcrumbs = ({ itens }) => {
  return (
    <div style={{ margin: "20px 0 20px 0", display: 'flex' }}>
      {itens.map((item, index) => {
        const checkIfFirst = index !== 0;
        const checkIfLast = index !== itens.length - 1;
        return (
          <span key={index} style={{display: 'flex', alignItems: 'center'}}>
            {checkIfFirst ? (
              <span><IcNext size="sm" boxsize={20} fill="silver" /></span>
            ) : (
              ""
            )}{" "}
            {checkIfLast ? (
              <span style={{ color: "silver" }}>&nbsp;{item}</span>
            ) : (
              <span style={{ color: "var(--primaryClient)" }}>
                &nbsp;{item}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
};

export { Breadcrumbs };
