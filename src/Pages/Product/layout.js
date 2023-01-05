import React from "react";
import Tabs from "../../Layouts/Tabs";

const items = [
  {
    url: "/shop/produtos",
    title: "Produtos"
  },
  {
    url: "/shop/colecoes",
    title: "Coleções"
  }
];

const Shop = ({ children, style }) => {
  return (
    <div style={style}>
      <Tabs items={items}>{children}</Tabs>
    </div>
  );
};


Shop.default = ({ children, className }) => {
  return (
    <div
      className={className}    
    >
      {children}
    </div>
  );
};

Shop.content = ({ children, className }) => {
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

export default Shop;
