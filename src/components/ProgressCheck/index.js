import React, { useState } from "react";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import { Manager, Reference, Popper } from "react-popper";
import { BlankCard } from "../BlankCard";
import "./styles.scss";
import { IconsSidebar } from "../IconsSidebar";

const BulletStep = ({ step, index }) => {
  const [isOpen, toggleOpen] = useState(false);
  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <div className={`progressCheck__content__step `} ref={ref}>
            <div
              className={`progressCheck__content__step--bullet ${step.status}`}
              onClick={() => toggleOpen(!isOpen)}
            ></div>
            <span className={`progressCheck__content__step--title`}>
              {step.title}
            </span>
            <span className={`progressCheck__content__step--subtitle`}>
              {step.subtitle}
            </span>
          </div>
        )}
      </Reference>
      {isOpen && step?.actions.length ? (
        <Popper placement="top">
          {({ ref, style, placement, arrowProps }) => (
            <div
              ref={ref}
              style={style}
              data-placement={placement}
              className={`progressCheck__popover ${
                placement === "bottom" ? "sideDown" : ""
              }`}
            >
              <StepPopoverItem text="Preencher status" title />
              
              {step?.actions.map((action, j) => (
                <StepPopoverItem
                  key={`stepsAction${j}`}
                  text={action.label}
                  action={action.action}
                />
              ))}

              <div className="progressCheck__popover--arrow"></div>
            </div>
          )}
        </Popper>
      ): null}
    </Manager>
  );
};

const StepPopoverItem = ({ action, text, title }) => {
  return (
    <div
      className={`progressCheck__popover--item ${
        title ? "title" : ""
      } df fdr alic jc-sb`}
      onClick={action}
    >
      <div>{text}</div>
      {title ?? <IconsSidebar.arrow_next />}
    </div>
  );
};

const ProgressCheck = ({ data, progress }) => {  

  return (
    <BlankCard className="progressCheck__wrapper">
      <div className="progressCheck__content">
        <ProgressBar percent={progress} filledBackground="#6dc783">
          {data.steps
            ? data.steps.map((step, i) => {
                return (
                  <Step key={`steps${i}`}>
                    {({ accomplished, index }) => (
                      <BulletStep step={step} index={index} />
                    )}
                  </Step>
                );
              })
            : null}
        </ProgressBar>
      </div>
    </BlankCard>
  );
};

export { ProgressCheck };
