import React from "react";
import ShopLayout from "../index";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./style.office.scss";
import SectionHighlights from "./Highlights";
import SectionCollections from "./Collections";

const ShopOffice = () => {
  return (
    <ShopLayout.default>
      <br />
      <SectionHighlights />
      <br />
      <SectionCollections />
    </ShopLayout.default>
  );
};

export default ShopOffice;
