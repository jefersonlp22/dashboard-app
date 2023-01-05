import React from "react";
import styled from "styled-components";

const IcSizes = {
  sm: 20,
  md: 30,
  lg: 40  
};

const SvgContainer = styled.div` 
  display: flex;
  align-items: center;
  svg{
    width: ${({ size }) => `${IcSizes[size]}px` || "20px"};
    height: ${({ size }) => `${IcSizes[size]}px` || "20px"};
  }  
`;

/**
 * @name BaseIcon
 * @description Cria um icone svg
 * @param Name Nome do icone a ser criado
 */
export function BaseIcon(path, props) {
  return (
    <SvgContainer size={props.boxsize || props.size}>
      {React.createElement(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          stroke: "currentColor",
          fill: "none",
          fillRule:"evenodd",
          clipRule:"evenodd",
          strokeWidth: "0",
          viewBox: `0 0 ${ Number(props?.boxsize) || 40} ${ Number(props?.boxsize) || 40}`,
          height: props?.boxsize || 40,
          width: props?.boxsize || 40,
          ...props,
        },
        React.createElement("path", { d: path })
      )}
    </SvgContainer>
  );
}
