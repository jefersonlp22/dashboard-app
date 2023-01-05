import React from "react";

import List from "./List";

import {
  Row,
  Line,
  Icons,
  Breadcrumbs,
  Loader
} from "../../../../components";

import Tabs from "../../../../Layouts/Tabs";

import "./styles.scss";

const ExpertOrdersList = ({
  setScreen,
  network,
  expert,
  orders,
  tabItems,
  loading
}) => {
  return (
    <>
      <Tabs items={tabItems} />
      <div className="expertOrderList">
        <Breadcrumbs
          itens={["Canal", "People", "Lista", expert?.name, "Pedidos"]}
        />

        <div className="expertOrderList--board">
          <div className="expertOrderList--returnWrapper">
            <div
              className="expertOrderList--iconBack"
              onClick={() => setScreen("detail")}
            >
              <Icons.back />
            </div>
          </div>
          <div>
            <p className="previus">{expert?.name}</p>

            <h1 className="expertOrderList--title">Pedidos</h1>
            <Line />
            <Row>
              {loading ? (
                <Loader
                  active={loading}
                  color="#b2b2b3"
                  className="cardIndicator--loader"
                />
              ) : (
                <List data={orders} network={network} expert={expert} />
              )}
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpertOrdersList;
