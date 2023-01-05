import React from "react";
import { VoidTemplate, Table } from "../../../components";
import { useHistory } from "react-router-dom";
import moment from 'moment';

function formatRow(item) {
  let converted = {
    code: item.id,
    user: item.user.name,
    data: moment(item.placed_at).format('DD/MM/YYYY HH:mm'),
    value: "R$ " + item.total_formatted,
    percent_commission: "12%",
    val_commission: "R$ 57,56"
  };
  let row = Object.entries(converted).map(([name, value], index) => (
    <Table.td key={`col-${name}-${index}`} name={name}>
      {value}
    </Table.td>
  ));

  return row;
}
const List = props => {
  const history = useHistory();

  return (
      <Table
        headers={[
          "Código",
          "Valor pedido",
          "Data",         
          "Vendido por",          
          "% Comissão",
          "Valor comissão",      
        ]}
        voidtemplate={
          <VoidTemplate
            message={
              <VoidTemplate.default
                message={
                  <>
                    Nenhum resgate foi
                    <br /> feito ainda.
                  </>
                }
              />
            }
          />
        }
      >
        {props.data
          ? props.data.map((item, rowIndex) => (
              <Table.tr
                key={`row${rowIndex}`}
                onClick={() => {
                  history.push({
                    pathname: `/movimentacoes/resgates/${item.external_id}`
                  });
                }}
              >
                {formatRow(item)}                
              </Table.tr>
            ))
          : null}
      </Table>
  );
};

export default List;
