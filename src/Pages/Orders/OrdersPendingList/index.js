import React from 'react';

import List from "./List";

import { VoidTemplate, Row, Line, Icons, Breadcrumbs } from "../../../components";

import "./styles.scss";

const OrdersPendingList = ({ onBack, orders }) => {      
    return (
      <>
      <div className="expertOrderList">        
        <Breadcrumbs itens={["Pedidos", "Pendentes"]} />
        <div className="expertOrderList--board">
          <div className="expertOrderList--returnWrapper">
            <div
              className="expertOrderList--iconBack"
              onClick={onBack}
            >
              <Icons.back />
            </div>
          </div>
          <div>            
            <h1 className="expertOrderList--title">Pedidos pendentes</h1>            
            <Line />
          <Row>
            {true ? (
                <List data={orders}/>
            ) : (
            <VoidTemplate message="Nenhum Pedido foi feito ainda" />
            )}
        </Row>
       
        </div>
          </div>
        </div>
        </>
    );
}

export default OrdersPendingList;
