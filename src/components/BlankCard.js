import React from "react";

const styles = {
  backgroundColor: "#FFFFFF",
  boxShadow: "1px 1px 5px 0 rgba(0, 0, 0, 0.1)",
  borderRadius: 5
};

function BlankCard({ children, onClick, className }) {
  return (
    <div style={styles} className={className} onClick={onClick}>
      {children}
    </div>
  );
}

export { BlankCard };
