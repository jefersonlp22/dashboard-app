import React from "react";
import { Tab, TabItem } from "../../components/Tab";

const Tabs = ({ items, children, className }) => {
  return (
    <div className={className} style={{width: '100%'}}>
      <Tab>
        {items.map((tab, index) => (
          <TabItem key={index} to={tab.url} title={tab.title} parent={tab.parent} />
        ))}
      </Tab>
      {children}
    </div>
  );
};

export default Tabs;
