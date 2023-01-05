import React from "react";
import Row from "./Row";
import Column from "./Column";
import "./Table.scss";

const Table = props => {
  const { children, className, voidtemplate } = props;

  const dataExists =
    props.hasOwnProperty("data") && props.data.length > 0 ? props.data : null;

  return (
    <>
      {dataExists || children ? (
        <table
          {...props}
          className={`table ${className ? className : ""}`}
          cellSpacing="0"
        >
          {props.headers ? (
            <thead>
              <Row>
                {props.headers.map((item, index) => (
                  <Column key={index} className={item.className || ""}>
                    {item.text || item}
                  </Column>
                ))}
              </Row>
            </thead>
          ) : null}
          <tbody>
            {dataExists ? (
              props.data.map((item, rowIndex) => (
                <Row key={`row${rowIndex}`}>
                  {Object.entries(item).map(([name, value], colIndex) => (
                    <Column key={`col${rowIndex}-${colIndex}`} name={name}>
                      {value}
                    </Column>
                  ))}
                </Row>
              ))
            ) : (
              <></>
            )}
            {children}
          </tbody>
        </table>
      ) : (
        voidtemplate
      )}
    </>
  );
};

Table.tr = Row;
Table.td = Column;

export { Table };
