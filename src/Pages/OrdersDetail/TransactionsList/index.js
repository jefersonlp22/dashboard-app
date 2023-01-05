import React, { useState, useEffect } from "react";
import {
  VoidTemplate,
  Row,  
  Icons,
  Breadcrumbs,
  Table,
  GetCircleStatusOrderTransaction,
} from "../../../components";
import moment from "moment";
import _ from "lodash";
import "./styles.scss";

const TransactionsList = ({ onBack, transactions, breadcrumbs }) => {
  const [data, setTransactions] = useState([]);

  const paymentType = {
    "bank_slip": "Boleto",
    "credit_card": "Cartão de crédito"
  };
  
  useEffect(() => {
    let ordered = _.orderBy(transactions, ["id"], "desc");
    setTransactions(ordered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="df fdr alic">
        <div onClick={() => onBack()}><Icons.back /></div>
        <Breadcrumbs itens={[...breadcrumbs, "Faturas geradas"]} />
      </div>
      <Row>
        {data.length ? (
          <Table headers={["Vencimento", "Tipo de pagamento", "Status", " "]}>
            {data.map((item, rowIndex) => (
              <Table.tr
                key={`row${rowIndex}`}
                onClick={() => {
                  window.open(
                    process.env.REACT_APP_INVOICE_PATH +
                      `/fatura/${item.external_id}`,
                    "_blank"
                  );
                }}
              >
                <Table.td>
                  {moment(item.due_date).format("DD/MM/YYYY")}
                </Table.td>
                <Table.td>
                  {paymentType[item.payment_method] || ''}
                </Table.td>
                <Table.td>
                  <GetCircleStatusOrderTransaction status={item.status} />
                </Table.td>
                <Table.td>
                  <Icons.next fill="#4d4d4d" />
                </Table.td>
              </Table.tr>
            ))}
          </Table>
        ) : (
          <VoidTemplate message="Nenhum fatura gerada" />
        )}
      </Row>
    </div>
  );
};

export default TransactionsList;
