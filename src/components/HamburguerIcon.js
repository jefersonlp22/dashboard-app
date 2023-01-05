import React from "react";

function HamburgerIcoin({ active }) {
  return (
    <div
      className={`hamburger ${active ? "hamburger--collapse is-active" : ""}`}
    >
      <div className="hamburger-box">
        <div className="hamburger-inner"></div>
      </div>
    </div>
  );
}

export default HamburgerIcoin;
