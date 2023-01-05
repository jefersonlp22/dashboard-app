import React from "react";
import { Table } from "../components/Table";
import VoidRegistersIcon from "../assets/svg/mood-3.svg";

const List = () => {
  const data = [
    {
      nome: "Teste",
      sobrenome: "Sobrenome",
      teste: "teste"
    },
    {
      nome: "Teste",
      sobrenome: "Sobrenome",
      teste: "teste"
    }
  ];

  return (
    <>
      <h1>Seu Canal</h1>
      <Table
        headers={["Coluna 1", "Coluna 2", "Coluna 3"]}
        data={data}
        voidtemplate={
          <VoidTemplate message={`Sem clientes cadastrados por enquanto`} />
        }
      ></Table>
    </>
  );
};

const VoidTemplate = ({ message }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh"
      }}
    >
      <img src={VoidRegistersIcon} alt="" />
      <p style={{ fontSize: "2rem", wordWrap: "true" }}>{message}</p>
    </div>
  );
};

export default List;
