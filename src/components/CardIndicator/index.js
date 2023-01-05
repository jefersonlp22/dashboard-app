import React from "react";
import "./card.scss";
import { Loader } from '../Loader';

const CardIndicator = ({ children, className, loading, ...props }) => {
  return (
    <div className={`cardIndicator ${className || ""}`}>
      {loading ? <div className="cardIndicator--loader__wrapper"> 
        <Loader active={loading} color="#b2b2b3"  className="cardIndicator--loader" />
      </div>: (
        <>
          {props.icon? (<div className="cardIndicator--icon">{props.icon}</div>) : null }
          <div className="cardIndicator--number">{props.number}</div>
          <div className="cardIndicator--title">{props.title}</div>
          <div className="cardIndicator--information" style={{color: props.infoColor}}>{props.information}</div>
        </>
      )}
    </div>

  );
};

export { CardIndicator };
