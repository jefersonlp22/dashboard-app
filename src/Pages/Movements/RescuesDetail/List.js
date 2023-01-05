import React from "react";
import { Table } from "../../components/Table";
// import { Status } from "../components/Status";
// import { PenButton } from "../components/Buttons";
// import { Checkbox } from "../components/Checkbox";
import VoidRegistersIcon from "./mood-3.svg";
import filterIcon from "../../assets/svg/icon-filter.svg";
import searchIcon from "../../assets/svg/icon-search.svg";
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link,
//   useRouteMatch,
//   useParams
// } from "react-router-dom";

const List = () => {
  // let match = useRouteMatch();

  const data = [
    {
      codigo: "ABC123",
      selled_buy: "Otávio Morais (Eduardo Reis)",
      client: "Nicolas Cardoso",
      date: "31/12/2019",
      value: "R$ 239,90",
      status: 1
    },
    {
      codigo: "ABC123",
      selled_buy: "Otávio Morais (Eduardo Reis)",
      client: "Nicolas Cardoso",
      date: "31/12/2019",
      value: "R$ 239,90",
      status: 1
    },
    {
      codigo: "ABC123",
      selled_buy: "Otávio Morais (Eduardo Reis)",
      client: "Nicolas Cardoso",
      date: "31/12/2019",
      value: "R$ 239,90",
      status: 1
    },
    {
      codigo: "ABC123",
      selled_buy: "Otávio Morais (Eduardo Reis)",
      client: "Nicolas Cardoso",
      date: "31/12/2019",
      value: "R$ 239,90",
      status: 1
    }
  ];

  return (
    <>
      <div className="orders__table--header df fdr">
        <h1>Seus Pedidos</h1>
        <div className="df fdr">
          <div className="df fdc search__input">
            <input type="text" placeholder="Código" />
            <img src={searchIcon} alt="Icone Busca" />
          </div>
          <img src={filterIcon} alt="Icone Filtro" />
        </div>
      </div>
      <Table
        headers={[
          "Código",
          "Vendido por",
          "Cliente",
          "Data",
          "Valor",
          "Status"
        ]}
        data={data}
      ></Table>
    </>
  );
};

export default List;
