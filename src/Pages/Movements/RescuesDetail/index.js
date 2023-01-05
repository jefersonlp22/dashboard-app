import React, { useEffect, useState } from "react";
import "./styles.scss";
import BackIcon from "../../../assets/svg/icon-back.svg";
import PeopleIcon from "../../../assets/svg/icon-people.svg";
import CurrencyIcon from "../../../assets/svg/icon-currency.svg";
import { useHistory, useRouteMatch } from "react-router-dom";
import { ProgressCheck, BlankCard, Loader, Breadcrumbs, Icons } from "../../../components";

import gqlClient from "../../../services/GraphQlRequest";
import { useApproveOrder } from "../../../gqlEndpoints/mutations";


import moment from 'moment';
import Swal from "sweetalert2";

const swalStyled = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success"
  },
  buttonsStyling: true
});

function paymentMethod(transaction) {
  if (transaction.payment_method === "credit") {
    return "Cartão de crédito";
  } else if (transaction.payment_method === "slip_bank") {
    return "Boleto";
  }

  return null;
}
const RescuesDetail = () => {

  let match = useRouteMatch("/movimentacoes/resgates/:id");

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [orderDetail, setOrderDetail] = useState({});
  const { orderApproved, orderCanceled } = useApproveOrder();

  const [orderSteps, setOrderSteps] = useState({});

  const getOrders = async () => {
    setLoading(true);

    const query = `query{
      order(id: "${match.params.id}"){
        id
        external_id
        user_id
        user{
          name
        }
        placed_at
        delivered_at
        paid_at
        approved_at
        billed_at
        canceled_at
        total_formatted
        quantity
        customer{
          id
          name
        }
        items{
          id
          order_id
          name
          quantity
          subtotal
          subtotal_formatted
          discount
          total_formatted
          total
          product_variant{
            product{
              description
              featured_asset{
                url
              }
            }
          }
        }
        transactions{
          payment_method
          due_date
          status
        }
      }
    }`;

    const result = await gqlClient().request(query);
    let stepsDefined = {
      steps: [
        {
          title: 'Resgate solicitado',
          subtitle: moment(result.order.placed_at).format('DD/MM/YYYY'),
          status: result.order.placed_at ? 'success' : 'waiting', // current | success | canceled | waiting
        },
        {
          title: 'Resgate aprovado',
          subtitle:  moment(result.order.approved_at).format('DD/MM/YYYY'),
          status: result.order.approved_at ? 'success' : 'waiting', // current | success | canceled | waiting
        },
        {
          title: 'Pagamento enviado',
          subtitle:  moment(result.order.paid_at).format('DD/MM/YYYY'),
          status: result.order.paid_at ? 'success' : 'waiting', // current | success | canceled | waiting
        },
        {
          title: 'Resgate completo',
          subtitle:  moment(result.order.billed_at).format('DD/MM/YYYY'),
          status: result.order.billed_at ? 'success' : 'waiting', // current | success | canceled | waiting
        },

      ]};

    setOrderSteps(stepsDefined);
    setOrderDetail(result.order);
    setLoading(false);
  };

  useEffect(() => {
    if (
      (Object.entries(orderApproved).length !== 0 &&
        orderApproved.constructor === Object) ||
      (Object.entries(orderCanceled).length !== 0 &&
        orderCanceled.constructor === Object)
    ) {
      let action = "";

      if (Object.entries(orderApproved).length !== 0) {
        action = "liberada";
      }

      if (Object.entries(orderCanceled).length !== 0) {
        action = "reprovada";
      }

      swalStyled
        .fire({
          title: `Solicitação ${action}!`,
          icon: "success",
          showCloseButton: true
        })
        .then(result => {
          setLoading(false);
          history.push({ pathname: `/empty` });
          history.replace({ pathname: `/pedidos` });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderApproved, orderCanceled]);

  useEffect(() => {
    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let identifyStatus = "Aguardando aprovação";

    if (orderDetail.approved_at) {
      identifyStatus = "aprovado";
    }
    if (orderDetail.canceled_at) {
      identifyStatus = "cancelado";
    }

    if (orderDetail.paid_at) {
      identifyStatus = "pago";
    }
    setStatus(identifyStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderDetail]);



  return loading ? (
    <Loader active={loading} />
  ) : (
    <div className="ordersDetail">
      <Breadcrumbs itens={["Movimentações", "Resgates", "Resgate"]} />


      <div className="ordersDetail--board">
        <div className="ordersDetail--returnWrapper">
          <div
            className="ordersDetail--iconBack"
            onClick={() => history.replace({ pathname: "/movimentacoes/resgates" })}
          >
            <img src={BackIcon} alt="Icone Retorno" />
          </div>
        </div>
        <div>
          <h1 className="ordersDetail--title">Resgates #{orderDetail.id}</h1>
          {}
          <h4 className={`ordersDetail--status ${status}`}>Status: {status}</h4>
          <br />

          <ProgressCheck data={orderSteps}/>

          <div className="df fdr">
            <div className="ordersDetail--details col-left">
              <h3 className="ordersDetail--details__title">Detalhes</h3>

              <BlankCard className="ordersDetail--details__item df fdr">
                <div className="df fdr alic">
                  <img src={PeopleIcon} alt="Icone Cliente" />
                  <div className="item__title">
                    Beneficiário: { orderDetail?.customer?.name || ""}
                  </div>
                </div>
                {/* <img src={ArrowNextIcon} alt="Icone Próximo" /> */}
              </BlankCard>

              <BlankCard className="ordersDetail--details__payment df fdc">
                <div className="df fdr alic jc-sb">
                  <div className="df fdr alic">
                    <img src={CurrencyIcon} alt="Icone Moeda" />
                    <div className="item__title">Conta: Principal</div>
                  </div>
                  {/* <img src={ArrowNextIcon} alt="Icone Próximo" /> */}
                </div>

                <div className="ordersDetail--details__payment--types">
                  <p className="ordersDetail--details__payment--title">
                    {orderDetail?.transactions?.length && orderDetail?.transactions[0]?.due_date
                      ? paymentMethod(orderDetail.transactions[0])
                      : null}
                  </p>
                  <p className="ordersDetail--details__payment--title">
                    Vencimento:{" "}
                    {orderDetail?.transactions?.length &&
                    orderDetail?.transactions[0]?.due_date
                      ? moment(orderDetail.transactions[0].due_date).format('DD/MM/YYYY')
                      : "   --/--/----"}
                  </p>
                </div>
              </BlankCard>

              <BlankCard className="ordersDetail--details__payment df fdc">
                <div className="df fdr alic jc-sb">
                  <div className="df fdr alic">
                    <Icons.downloadFile />
                    <div className="item__title">Nota fiscal</div>
                  </div>
                  <Icons.next />
                </div>
              </BlankCard>
            </div>

            <div className="ordersDetail--details col-right">
              <h3 className="ordersDetail--details__title">
                Referente à
              </h3>

              <BlankCard className="ordersDetail--details__payment df fdc" onClick={()=>{
                console.log('eita nós')
                history.replace({pathname: "/movimentacoes/resgates/bonificacao/"+match.params.id})

                }}>
                <div className="df fdr alic jc-sb">
                  <div className="df fdr alic">
                    <Icons.starSmall />
                    <div className="item__title">Comissão: R$ 1.439,00</div>
                  </div>
                  <Icons.next />
                </div>

                <div className="ordersDetail--details__payment--types">
                  <p className="ordersDetail--details__payment--title">
                      10 períodos selecionados
                  </p>
                  <p className="ordersDetail--details__payment--title">
                      30 pedidos
                  </p>
                </div>
              </BlankCard>

              <BlankCard className="ordersDetail--details__totalSale df fdc">
                <div className="ordersDetail--details__totalSale--taxes">
                  Taxas: R$ 160,00
                </div>

                <div className="ordersDetail--details__totalSale--total">
                  Valor total da nota: R$ {orderDetail ? orderDetail.total_formatted : ""}
                </div>
              </BlankCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescuesDetail;
