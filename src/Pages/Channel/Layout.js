import React from "react";
// import { Tab, TabItem } from "../components/Tab";

const Layout = ({ children }) => {
  return (
    <>
      {/* <Tab>
        <TabItem to={"/canal"} />
        <TabItem to={`/canal/convites`} title="Convites" />
      </Tab> */}
      {children}
    </>
  );
};

export default Layout;
