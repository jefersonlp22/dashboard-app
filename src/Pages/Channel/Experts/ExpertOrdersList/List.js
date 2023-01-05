import React from "react";
import { VoidTemplate, Table, GetCircleStatus } from "../../../../components";
import { useHistory } from "react-router-dom";
import moment from 'moment';

function formatRow(item) {
  let converted = {
    customer: item.customer.name,    
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
const List = ({network, expert, ...props}) => {
  const history = useHistory();
  return (
      <Table
        headers={[
          "Cliente",          
          "Data",         
          "Valor",          
          "Status",
          " ",      
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
                    pathname: `/pedidos/${item.external_id}`,
                    state: network ? {                      
                      networkId: network                      
                    }: {}
                  });
                }}
              >
                {formatRow(item)} 
                <Table.td>
                  >
                </Table.td>               
              </Table.tr>
            ))
          : null}
      </Table>
  );
};

export default List;
