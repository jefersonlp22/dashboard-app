import React from "react";
import ShopItens from "./Itens";
import ShopNewItens from "./Itens/update";
import ShopCollections from "./collections";
import ShopNewCollections from "./newCollections";
import ShopOffice from "./office/index";
import ShopProductVariations from "./Itens/generateVariations";
import ShopManageVariations from "./Itens/manageVariations";
import ShopManageAttributes from "./Itens/manageAttributes";
import ShopAttributes from "./attributes.js";
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

const Shop = ({ children }) => {
  return (
    <>
      <Tabs items={items}>{children}</Tabs>
    </>
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
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        padding: 80,
        border: "1px solid #e5e5e6"
      }}
    >
      {children}
    </div>
  );
};

export default Shop;

export {
  ShopItens,
  ShopCollections,
  ShopNewCollections,
  ShopOffice,
  ShopNewItens,
  ShopProductVariations,
  ShopManageVariations,
  ShopManageAttributes,
  ShopAttributes
};
