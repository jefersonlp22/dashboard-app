import React from "react";
import { VoidTemplate, Icons, Row, Breadcrumbs, GetCircleStatus } from "../../components";
import { Table } from "../../components/Table";
import { useHistory } from "react-router-dom";

import moment from 'moment';

const OrdersPendingList = ({onBack, orders, ...props}) => {
  const history = useHistory();

  return (
    <div>
      <div className="df fdr alic">
        <div onClick={()=>onBack()}><Icons.back /></div> <Breadcrumbs itens={["Pedidos", "Pendentes"]} />
      </div>
      <Row>
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
                message="Nenhum pedido pendente."
              />
            }
          />
        }
      >
        {orders?.length
          ? orders.map((item, rowIndex) => (
              <Table.tr
                key={`row${rowIndex}`}
                onClick={() => {
                  history.push({
                    pathname: `/pedidos/${item.external_id}`,
                    params:{
                      from: 'ordersPending'
                    }
                  });
                }}
              >
                <Table.td>{item?.code}</Table.td>
                <Table.td>{item?.user?.name}</Table.td>
                <Table.td>{item?.customer?.name}</Table.td>
                <Table.td>{moment(item?.placed_at).format('DD/MM/YYYY HH:mm')}</Table.td>
                <Table.td>{`R$ ${item?.total_formatted}`}</Table.td>
                <Table.td><GetCircleStatus item={item} /></Table.td>
                <Table.td><Icons.next fill="#4d4d4d" /></Table.td>
              </Table.tr>
            ))
          : null}
      </Table>
      </Row>
    </div>
  );
};

export default OrdersPendingList;
