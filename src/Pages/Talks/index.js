import React from "react";

const TalksLayout = ({ className, children }) => {
  return (
    <div className={className}>
      {/* <Tabs className={className} items={items}> */}
        {children}
      {/* </Tabs> */}
    </div>
  );
};

TalksLayout.default = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

TalksLayout.content = ({ children, className }) => {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "row",
        minHeight: "50vh",
        backgroundColor: "#fafafa",
        borderRadius: 10,
        padding: 80
      }}
    >
      {children}
    </div>
  );
};

export default TalksLayout;
export * from "./Talks";
export * from "./UpdateTalk";
export * from "./CreateNew";
export * from "./ChoosePublic";
export * from "./ChooseGroup";
