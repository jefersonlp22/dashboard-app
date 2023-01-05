import React, { useState, useEffect } from "react";
import "./style.scss";

function SimpleSlider(props) {
  const [current, setCurrent] = useState(0);
  const length = props.children.length;
  const [dots, setDots] = useState([]);

  useEffect(() => {
    let auxDots = [];
    for (let i = 0; i < length; i++) {
      auxDots.push({ active: i === current ? "activeDot" : "" });
    }
    setDots(auxDots);

    // eslint-disable-next-line
  }, [current]);

  const prev = () => {
    let indexCurrent = current;

    if (indexCurrent === 0) {
      setCurrent(length - 1);
    } else {
      indexCurrent--;
      setCurrent(indexCurrent);
    }
  };

  const next = () => {
    let indexCurrent = current;
    if (indexCurrent >= length - 1) {
      setCurrent(0);
    } else {
      indexCurrent++;
      setCurrent(indexCurrent);
    }
  };

  return (
    <div>
      <div>{props.children[current]}</div>
      <div className="df fdr jc-sb mTop20">
        <div className="simpleSliderArrows" onClick={prev}>
          {"<"} Anterior
        </div>

        <div className="simpleSliderDotsWrapper">
          {dots.map((dot, i) => (
            <span
              key={`dot${i}`}
              className={`simpleSliderDots ${dot.active}`}
            ></span>
          ))}
        </div>

        <div className="simpleSliderArrows" onClick={next}>
          Próximo {">"}
        </div>
      </div>
    </div>
  );
}

export { SimpleSlider };
