import React from "react";
import styled from "styled-components";

const Button = styled.div`
  cursor: ${(props) => (props.pointer ? "pointer" : "normal")};
`;

export default ({ toggle, pointer, ...props }) => (
  <Button pointer {...props} >
    <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M6.75029 5.35352L10.4006 9.00381L14.0514 5.35358L15.0475 6.34967L11.3967 9.99989L15.0475 13.6501L14.0514 14.6462L10.4006 10.996L6.75029 14.6463L5.75488 13.6501L9.40507 9.99989L5.75488 6.34971L6.75029 5.35352Z" fill="white"/>
    </svg>
  </Button>
);




