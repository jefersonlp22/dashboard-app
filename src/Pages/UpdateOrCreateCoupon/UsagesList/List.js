import React from "react";
import { VoidTemplate, Table } from "../../../components";
import moment from 'moment';

const List = ({data, recipientType}) => {
  const headerTb = recipientType === "customer" ?
  [
    "Beneficiário",
    "Email",
    "Embaixador",
    { text: "Utilizações", className: "alignCenter" },
    { text: "Status", className: "alignCenter" },
    { text: "Última utilização", className: "alignCenter" }
  ] :
  [
    "Beneficiário",
    "Email",
    { text: "Utilizações", className: "alignCenter" },
    { text: "Status", className: "alignCenter" },
    { text: "Última utilização", className: "alignCenter" }
  ];

  return (
      <Table
        headers={headerTb}
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
        {data
          ? data.map((item, rowIndex) => {
            console.log(item);
            return(
              <Table.tr key={`col-Usage${item}-${rowIndex}`}>
                <Table.td>
                  {item?.name}
                </Table.td>
                <Table.td>
                  {item?.email}
                </Table.td>

                {item?.lover &&
                  <Table.td>
                  {item?.lover?.name}
                  </Table.td>
                }

                <Table.td  style={{textAlign:'center'}}>
                  {item?.used_times}
                </Table.td>
                <Table.td  style={{textAlign:'center'}}>
                  {item?.avaible ? "Disponível" : "Indisponível"}
                </Table.td>
                <Table.td style={{textAlign:'center'}}>
                  { item?.used_times > 0 ? moment(item?.updated_at).format('DD/MM/YYYY HH:mm') : '-'}
                </Table.td>

              </Table.tr>
            )})
          : null}
      </Table>
  );
};

export default List;
