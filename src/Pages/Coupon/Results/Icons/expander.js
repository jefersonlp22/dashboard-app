import React from "react";
import styled from "styled-components";

const path = {
  close: {
    top:
      "M11.659 6.16357L11.659 5.22507L8.60208 5.22507L12.1636 1.66357L11.5001 1.00005L7.93855 4.56155L7.93856 1.5046L7.00005 1.5046L7.00005 6.16357L11.659 6.16357Z",
    down:
      "M1.50455 7V7.9385H4.5615L1 11.5L1.66352 12.1635L5.22502 8.60203L5.22502 11.659H6.16352L6.16352 7L1.50455 7Z",
  },
  open: {
    top:
      "M7.50455 1V1.9385H10.5615L7 5.5L7.66352 6.16352L11.225 2.60203V5.65897H12.1635V1H7.50455Z",
    down:
      "M5.65902 12.1636L5.65902 11.2251L2.60208 11.2251L6.16357 7.66357L5.50005 7.00005L1.93855 10.5615L1.93856 7.5046L1.00005 7.5046L1.00005 12.1636L5.65902 12.1636Z",
  },
};

const Button = styled.div`
  cursor: ${(props) => (props.pointer ? "pointer" : "normal")};
`;

export default ({ toggle, pointer }) => (
  <Button pointer>
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path
        d={path[toggle ? "close" : "open"].top}
        fill="#4D4D4D"
        stroke="#4D4D4D"
        strokeWidth="0.5"
      />
      <path
        d={path[toggle ? "close" : "open"].down}
        fill="#4D4D4D"
        stroke="#4D4D4D"
        strokeWidth="0.5"
      />
    </svg>
  </Button>
);
