import React, { useContext } from "react";
import { VoidTemplate, Icons } from "../../components";
import { Table } from "../../components/Table";
import { useHistory } from "react-router-dom";

import { CouponContext } from '../../contexts/Coupon.ctx';

import moment from 'moment';

const List = props => {
  const history = useHistory();
  const { couponClear } = useContext(CouponContext);

  const getStattus = status => {

    if (status === 'draft') {
      return "Não-publicado";

    } else if (status === 'published') {
      return "Publicado";

    } else if (status === 'expired') {
      return "Expirado";

    } else if (status === 'closed') {
      return "Cancelado";
    }
    return "Não-publicado";
  }

  return (
    <>
      <Table
        headers={[
          "Código",
          "Nome",
          "Utilização",
          "Vigência",
          "Desconto",
          "Total concedido",
          { text: "Status", className: "alignCenter" },
          ""
        ]}
        voidtemplate={
          <VoidTemplate
            message={
              <VoidTemplate.default
                message={
                  <>
                    Nenhum cupom foi
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
                  couponClear(item);
                  history.replace({
                    pathname: `/shop/cupom/${item.external_id}`
                  });
                }}
              >
                <Table.td>{item?.code}</Table.td>
                <Table.td>{item?.title}</Table.td>
                <Table.td>{item?.usage_limit ? `${item?.used_times}/${item?.usage_limit}` : '∞'} </Table.td>
                <Table.td>{moment(item?.start_at).format('DD/MM/YYYY')} - {moment(item?.end_at).format('DD/MM/YYYY')}</Table.td>
                <Table.td>{`${item?.type_value === "PERCENTAGE" ? `${item?.discount_formatted} %` :  `R$ ${item?.discount_formatted}`}`}</Table.td>
                <Table.td>R$ {item?.discount_granted_formatted}</Table.td>
                <Table.td>{getStattus(item.status)}</Table.td>
                <Table.td><Icons.next fill="#4d4d4d" /></Table.td>
              </Table.tr>
            ))
          : null}
      </Table>
    </>
  );
};

export default List;
