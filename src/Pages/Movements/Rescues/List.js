import React from "react";
import { VoidTemplate } from "../../../components";
import { Table } from "../../../components/Table";
import { GetCircleStatus } from "../../../components";
import { useHistory } from "react-router-dom";
import moment from 'moment';

function formatRow(item) {
  let converted = {
    code: item.id,
    user: item.user.name,
    data: moment(item.placed_at).format('DD/MM/YYYY HH:mm'),
    value: "R$ " + item.total_formatted,
    status: <GetCircleStatus item={item} />
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
          "Beneficiário",
          "Valor comissão",         
          "Valor da nota",          
          { text: "Status", className: "alignCenter" },
          "",
      
        ]}
        voidtemplate={
          <VoidTemplate
            message={
              <VoidTemplate.default
                message={
                  <>
                    Nenhum pedido foi
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

                <Table.td>></Table.td>
              </Table.tr>
            ))
          : null}
      </Table>
  );
};

export default List;
