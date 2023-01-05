import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Manager, Reference, Popper } from "react-popper";
import IconClose from "./close";

const Button = styled.div`
  cursor: pointer;
  width: 20px;
  height: 20px;
`;

const PopperBaloon = styled.div`
  background-color: ${({theme}) => theme.colors.bombay};
  color: #fff;
  z-index: 999;
  border-radius: 5px;
  padding: 14px;  
  max-height: 100px;
  width: fit-content;

  ${(props) =>
    props.placement === "right" &&
    css`
      left: 8px !important;      
    `}

  ${(props) =>
    props.placement === "left" &&
    css`
      right: 8px !important;      
    `} 

  ${(props) =>
    props.placement === "top" &&
    css`
      top: -8px !important;      
    `}  

  ${(props) =>
    props.placement === "bottom" &&
    css`
      top: 8px !important;      
    `}
`;

const PopperBaloonContent = styled.div`
  display: flex;
  align-items: center;
  line-height: 100%;

  .iconClose{
    display: flex;
    height: 100%;
    padding: 5px 10px;
  }
`;

const PopperBaloonArrow = styled.div`
  content: "";
  width: 10px;
  height: 10px;
  border-right: solid 1px ${({theme}) => theme.colors.bombay};
  border-bottom: solid 1px ${({theme}) => theme.colors.bombay};
  background: ${({theme}) => theme.colors.bombay};
  position: absolute;

  ${(props) =>
    props.placement === "right" &&
    css`
      left: -5px !important;
      transform: rotate(135deg);
    `}

  ${(props) =>
    props.placement === "left" &&
    css`
      right: -5px !important;
      transform: rotate(-45deg);
    `} 

  ${(props) =>
    props.placement === "top" &&
    css`
      bottom: -5px !important;
      transform: rotate(45deg);
    `}  

  ${(props) =>
    props.placement === "bottom" &&
    css`
      top: -5px !important;
      transform: rotate(-135deg);
    `}
`;

export default ({ children, update, ...props  }) => {
  const [toggle, setToggle] = useState(false);
  
  useEffect(()=> setToggle(false),[update]);

  return (  
    <div {...props}>
    <Manager>
      <Reference>
        {({ ref }) => (
          <Button onClick={() => setToggle(!toggle)} ref={ref}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5ZM10 4C13.3137 4 16 6.68629 16 10C16 13.3137 13.3137 16 10 16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4ZM10.414 11.5519H9.25269C9.23118 11.4098 9.20968 11.2678 9.20968 11.1038C9.20968 10.5246 9.44624 9.98907 10.0591 9.51913L10.5753 9.12568C10.8978 8.88525 11.0376 8.59016 11.0376 8.26229C11.0376 7.75956 10.6828 7.27869 9.96237 7.27869C9.19893 7.27869 8.86559 7.90164 8.86559 8.51366C8.86559 8.64481 8.87634 8.76503 8.9086 8.86339L7.55376 8.80874C7.51075 8.65574 7.5 8.48087 7.5 8.31694C7.5 7.13661 8.37097 6 9.96237 6C11.629 6 12.5 7.07104 12.5 8.17486C12.5 9.03825 12.0699 9.65027 11.4355 10.1093L10.9946 10.4262C10.6183 10.6995 10.414 11.0383 10.414 11.4863V11.5519ZM9.00538 13.1366C9.00538 12.6557 9.38172 12.2623 9.85484 12.2623C10.328 12.2623 10.7151 12.6557 10.7151 13.1366C10.7151 13.6175 10.328 14 9.85484 14C9.38172 14 9.00538 13.6175 9.00538 13.1366Z"
                fill="#B2B2B3"
              />
            </svg>
          </Button>
        )}
      </Reference>
      {toggle ? (
        <Popper placement="auto">
          {({ ref, style, placement, arrowProps }) => (
            <PopperBaloon ref={ref} style={style} placement={placement}>
              <PopperBaloonContent>
                {children}
                <IconClose className="iconClose" onClick={() => setToggle(!toggle)} />
              </PopperBaloonContent>
              <PopperBaloonArrow
                placement={placement}
                ref={arrowProps.ref}
                style={arrowProps.style}
              />
            </PopperBaloon>
          )}
        </Popper>
      ) : null}
    </Manager>
    </div>  
  );
};
