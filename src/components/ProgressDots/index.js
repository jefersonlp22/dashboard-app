import React from "react";

import './styles.scss';

function ProgressDots(props) {
  let dots = [];

  for (let i = 1; i <= props.total; i++) {
    if (i === props.current) {
      dots.push(<div className="ProgressDots__dotActive" key={`pDot${i}`}></div>);
    } else {
      dots.push(<div className="ProgressDots__dotInactive" key={`pDot${i}`}></div>);
    }
  }
  return props &&
    props.hasOwnProperty("total") &&
    props.hasOwnProperty("current") ? (
    <div className="ProgressDots">{dots}</div>
  ) : null;
}
export { ProgressDots };
