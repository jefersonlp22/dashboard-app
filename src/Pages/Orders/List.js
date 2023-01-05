import React from "react";
import { VoidTemplate, Icons } from "../../components";
import { Table } from "../../components/Table";
import { GetCircleStatus } from "../../components";
import { useHistory } from "react-router-dom";

import moment from 'moment';

function formatRow(item) {
  let converted = {
    code: item?.code,
    user: item?.user?.name,
    customer: item?.customer?.name,
    data: moment(item.placed_at).format('DD/MM/YYYY HH:mm'),
    value: "R$ " + item?.total_formatted,
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
    <>
      <Table
        headers={[
          "Código",
          "Vendido por",
          "Cliente",
          "Data do pedido",
          "Valor",
          { text: "Status", className: "alignCenter" },
          ""
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
                    pathname: `/pedidos/${item.external_id}`
                  });
                }}
              >
                {formatRow(item)}

                <Table.td>
                  <div className="table__arrow">
                    <Icons.next fill="#4d4d4d"/>
                  </div>  
                </Table.td>
              </Table.tr>
            ))
          : null}
      </Table>
    </>
  );
};

export default List;
