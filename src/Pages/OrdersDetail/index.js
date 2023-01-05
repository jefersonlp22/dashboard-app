import React, { useEffect, useState } from "react";
import "./styles.scss";
import BackIcon from "../../assets/svg/icon-back.svg";
import CurrencyIcon from "../../assets/svg/icon-currency.svg";
import imageProductDefault from "../../assets/images/productDefault.png";

import modalImageIcon1 from "../../assets/svg/01.svg";
import modalImageIcon2 from "../../assets/svg/02.svg";
import modalImageIcon3 from "../../assets/svg/03.svg";
import modalImageIcon4 from "../../assets/images/04.png";
import modalImageIcon5 from "../../assets/images/05.png";
import modalImageIcon6 from "../../assets/images/06.png";
import modalImageIcon7 from "../../assets/images/07.png";
import modalImageIcon8 from "../../assets/images/08.png";
import modalImageIcon9 from "../../assets/images/09.png";
import modalImageIcon10 from "../../assets/images/10.png";

import imageInfo from "../../assets/images/icon-info.png";

import { useParams, useHistory, useRouteMatch } from "react-router-dom";
import VMasker from "vanilla-masker";
import {
  ProgressCheck,
  BlankCard,
  Modal,
  Loader,
  Icons,
  Breadcrumbs
} from "../../components";

import gqlClient from "../../services/GraphQlRequest";
import { useApproveOrder } from "../../gqlEndpoints/mutations";
import moment from "moment";
import ClientRegister from "../Crm/ClientRegister";
import ExpertRegister from "../Channel/Experts/ExpertRegister";
import TransactionsList from "./TransactionsList";
import _ from "lodash";
import orderStatus from "./orderStatus";
import TotalStorage from "total-storage";
import Swal from "sweetalert2";

const swalStyled = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success"
  },
  buttonsStyling: true
});

function paymentMethod(transactions) {
  let newer = _.maxBy(transactions, "id");
  return moment(newer?.due_date).format("DD/MM/YYYY");
}

function bonusTotal(bonus = [],type=''){
  let b = 0;
  (bonus).forEach(function(obj){
    b = b + obj.total;
  });
  return ( type === 'formatted' ? value_formatted(b) : b );
}

function value_formatted(value){
  return (value/100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}



const OrdersDetail = () => {
  let user = TotalStorage.get("USER")
  let { id } = useParams();
  let match = useRouteMatch("/pedidos/:id");
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [toogleModal, setToogleModal] = useState(false);
  const [status, setStatus] = useState("");
  const [orderDetail, setOrderDetail] = useState({});
  const {
    approveOrder,
    reproveOrder,
    shippedOrder,
    deliveredOrder
  } = useApproveOrder();
  const [orderSteps, setOrderSteps] = useState({});
  const [stepsProgress, setStepProgress] = useState(0);
  const [currentScreen, toogleScreen] = useState("");

  const approve = async id => {
    const result = await approveOrder(id);
    if (result) {
      swalStyled.fire("Aprovado!", "Pedido aprovado com sucesso", "success");
    } else {
      console.log("Ocorreu um erro ao aprovar seu pedido");
    }
    setLoading(false);
    window.location.reload();
  };

  const handleApprove = async id => {
    swalStyled
      .fire({
        title: "Deseja aprovar esse pedido?",
        text: "Você não poderá reverter isso.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, Aprovar!",
        cancelButtonText: "Não, cancelar!",
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          setLoading(true);
          approve(id);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalStyled.fire("Cancelado", "Pedido não aprovado!", "error");
        }
      });
  };

  const reprove = async id => {
    swalStyled
      .fire({
        title: "Diga o motivo ",
        input: "text",
        inputAttributes: {
          autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "Reprovar",
        cancelButtonText: "Cancelar",
        preConfirm: reason => {
          if (reason === "") {
            swalStyled.showValidationMessage(`Campo obrigatório`);
          } else {
            setLoading(true);
            return reproveOrder(id, reason)
              .then(response => {
                if (!response.ok) {
                  throw new Error(response.statusText);
                }
                return response.json();
              })
              .catch(error => {
                setLoading(false);
                console.log("Ocorreu um erro ao reprovar o pedido", error);
              });
          }
        },
        allowOutsideClick: () => !swalStyled.isLoading()
      })
      .then(result => {
        if (result.value) {
          window.location.reload();
        }
      });
  };

  const handleReprove = async id => {
    swalStyled
      .fire({
        title: "Deseja reprovar esse pedido?",
        text: "Você não poderá reverter isso.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, Reprovar!",
        cancelButtonText: "Não, cancelar!",
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          reprove(id);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalStyled.fire("Cancelado", "Pedido não aprovado!", "error");
        }
      });
  };

  const handleShipment = async id => {
    swalStyled
      .fire({
        title: "Deseja confirmar o envio do pedido?",
        text: "Você não poderá reverter essa ação.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, confirmar!",
        cancelButtonText: "Não quero confirmar",
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          confirmShipment(id);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalStyled.fire("Cancelado", "Envio não aprovado!", "error");
        }
      });
  };

  const ship = async (id, shipping_code, track_url) => {
    const result = await shippedOrder(id, shipping_code, track_url);
    if (result) {
      swalStyled.fire("Confirmado!", "Envio confirmado", "success");
    } else {
      console.log("Ocorreu um erro ao confirmar o envio do pedido");
    }
    setLoading(false);
    window.location.reload();
  };

  const confirmShipment = async id => {
    swalStyled
      .fire({
        title: "Caso queira, você pode complementar com dados opcionais abaixo",
        html:
          '<label>Código de envio<input id="swal-input1" class="swal2-input"></label>' +
          '<label>URL de acompanhamento<input id="swal-input2" class="swal2-input"></label>',
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        preConfirm: () => {
          return [
            document.getElementById("swal-input1").value,
            document.getElementById("swal-input2").value
          ];
        }
      })
      .then(result => {
        if (result.value) {
          setLoading(true);
          ship(id, result.value[0] || "", result.value[1] || "");
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalStyled.fire("Cancelado", "Envio não confirmado!", "error");
        }
      });
  };

  const delivery = async id => {
    const result = await deliveredOrder(id);
    if (result) {
      swalStyled.fire("Confirmado!", "Entrega confirmada", "success");
    } else {
      console.log("Ocorreu um erro ao confirmar a entrega do pedido");
    }
    setLoading(false);
    window.location.reload();
  };

  const handleDelivery = async id => {
    swalStyled
      .fire({
        title: "Deseja confirmar a entrega do pedido?",
        text: "Você não poderá reverter essa ação",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, confirmar!",
        cancelButtonText: "Não quero confirmar",
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          setLoading(true);
          delivery(id);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalStyled.fire("Cancelado", "Pedido não foi entregue!", "error");
        }
      });
  };

  const getOrders = async () => {
    setLoading(true);

    const query = `query{
      order(id: "${id || match.params.id}"){
        id
        code
        external_id
        user_id
        coupon_discount
        coupon_discount_formatted
        coupon{
          code
          type_value
          discount_formatted
        }
        bonus{
          total
          total_formatted
        }
        user{
          id
          name
          email
          phone
          birthday
          document
          picture_url
          company_name
          company_trade_name
          company_document
          company_state_registration
          company_legal_nature
          company_tax_regime
          agreed_at

          accounts {
            id
            account_type
            person_type
            bank_number
            bank_account
            bank_agency
            bank_name
            account_name
            account_document
          }

          company_address{
            id
            name
            postal_code
            addressee
            address
            number
            district
            complement
            city
            state
            city_code
            local_reference
          }

          address{
            id
            name
            postal_code
            addressee
            address
            number
            district
            complement
            city
            state
            city_code
            local_reference
          }

          orders{
            id
            channel
            external_id
            placed_at
            approved_at
            canceled_at
            total_formatted
            customer{
              name
            }
          }
        }
        channel
        placed_at
        delivered_at
        shipped_at
        paid_at
        approved_at
        billed_at
        canceled_at
        subtotal_formatted
        discount
        discount_formatted
        total
        total_formatted
        quantity
        shipping
        customer{
          id
          name
          email
          phone
          document
          birthday
          company_name
          company_document
          company_state_registration
          type
        }
        shippings {
          desired_delivery_at
          delivery_estimate
          shipping_method
          shipping_price
          working_days
        }
        delivery_address{
          id
          name
          postal_code
          addressee
          address
          number
          complement
          district
          city
          state
          city_code
          local_reference
        }
        items{
          id
          sku
          order_id
          name
          quantity
          subtotal
          subtotal_formatted
          total_formatted
          total
          product_variant{
            type
            quantity_items
            product{
              description
              featured_asset{
                url
              }
            }
            values{
              name
              option{
                name
              }
            }
          }
        }
        transactions{
          id
          external_id
          external_url
          payment_method
          due_date
          data
          created_at
          status
        }
      }
    }`;

    const result = await gqlClient().request(query);
    const {
      placed_at,
      approved_at,
      paid_at,
      shipped_at,
      delivered_at,
      canceled_at
    } = result.order;

    let stepsDefined = {
      steps: [
        {
          title: "Pedido solicitado",
          subtitle: placed_at
            ? moment(placed_at).format("DD/MM/YYYY HH:mm")
            : "",
          status: orderStatus(result?.order, "placed_at"),
          actions: []
        },
        {
          title:
            approved_at && !canceled_at
              ? "Pedido liberado"
              : canceled_at
              ? "Reprovado"
              : "Aguardando",
          subtitle: approved_at
            ? moment(approved_at).format("DD/MM/YYYY HH:mm")
            : "",
          status: orderStatus(result?.order, "approved_at"), // current | success | canceled | waiting
          actions:  user?.network?.level === 'master'  || user?.network?.level === 'ambassador' ? [] :
            orderStatus(result?.order, "approved_at") === "current"
              ? [
                  {
                    label: "Aprovar",
                    action: () => handleApprove(result?.order?.external_id)
                  },
                  {
                    label: "Reprovar",
                    action: () => handleReprove(result?.order?.external_id)
                  }
                ]
              : []
        },
        {
          title: "Pagamento confirmado",
          subtitle: paid_at ? moment(paid_at).format("DD/MM/YYYY HH:mm") : "",
          status: orderStatus(result?.order, "paid_at"), // current | success | canceled | waiting
          actions: []
        },
        {
          title: "Pedido enviado",
          subtitle: shipped_at
            ? moment(shipped_at).format("DD/MM/YYYY HH:mm")
            : "",
          status: orderStatus(result?.order, "shipped_at"), // current | success | canceled | waiting
          actions:  user?.network?.level === 'master' ? [] :
            orderStatus(result?.order, "shipped_at") === "current" &&
            approved_at &&
            !canceled_at &&
            paid_at
              ? [
                  {
                    label: "Confirmar envio",
                    action: () => handleShipment(result?.order?.external_id)
                  }
                ]
              : []
        },
        {
          title: "Pedido entregue",
          subtitle: delivered_at
            ? moment(delivered_at).format("DD/MM/YYYY HH:mm")
            : "",
          status: orderStatus(result?.order, "delivered_at"), // current | success | canceled | waiting
          actions:  user?.network?.level === 'master' ? [] :
            orderStatus(result?.order, "delivered_at") === "current" &&
            approved_at &&
            !canceled_at &&
            paid_at &&
            shipped_at
              ? [
                  {
                    label: "Confirmar entrega",
                    action: () => handleDelivery(result?.order?.external_id)
                  }
                ]
              : []
        }
      ]
    };

    if (stepsDefined.steps.length) {
      let findProgress = stepsDefined.steps.filter(
        step => step.status === "success"
      );
      let total = (findProgress.length - 1) * 25;
      setStepProgress(total);
    }

    setOrderSteps(stepsDefined);
    setOrderDetail(result.order);
    setLoading(false);
  };

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

  return (
    <>
      {loading ? <Loader active={loading} /> : null}
      {currentScreen === "client" ? (
        <ClientRegister
          breadcrumbs={["Pedidos", `Pedido #${orderDetail.code}`]}
          onBack={() => toogleScreen("")}
          expert={orderDetail?.customer}
        />
      ) : null}
      {currentScreen === "expert" ? (
        <ExpertRegister
          breadcrumbs={["Pedidos", `Pedido #${orderDetail.code}`]}
          onBack={() => toogleScreen("")}
          expert={orderDetail?.user}
        />
      ) : null}
      {currentScreen === "transactionsList" ? (
        <TransactionsList
          breadcrumbs={["Pedidos", `Pedido #${orderDetail.code}`]}
          onBack={() => toogleScreen("")}
          transactions={orderDetail?.transactions}
        />
      ) : null}
      <div
        className="ordersDetail"
        style={loading || currentScreen !== "" ? { display: "none" } : {}}
      >
        <div className="ordersDetail--breadcrumbs">
          <Breadcrumbs itens={["Pedidos", `Pedido #${orderDetail.code}`]} />
        </div>

        <div className="ordersDetail--board">
          <div className="ordersDetail--returnWrapper">
            <div
              className="ordersDetail--iconBack"
              onClick={() => {
                if (history?.location?.state?.networkId) {
                  history.replace({
                    pathname: "/people/lovers/detalhes",
                    state: {
                      id: history?.location?.state?.networkId,
                      backfor: "orderList"
                    }
                  });
                } else if (history?.location?.params?.backTo) {
                  history.replace({
                    pathname: history?.location?.params?.backTo
                  });
                } else if (history?.location?.params?.from) {
                  history.replace({
                    pathname: "/pedidos",
                    params: { from: "details" }
                  });
                } else {
                  history.replace({ pathname: "/pedidos" });
                }
              }}
            >
              <img src={BackIcon} alt="Icone Retorno" />
            </div>
          </div>
          {true ? (
            <div>
              <h1 className="ordersDetail--title">
                Pedido #{orderDetail.code}
              </h1>
              <h4 className={`ordersDetail--status ${status}`}>
                Status: {status}
              </h4>

              <br />
              <ProgressCheck data={orderSteps} progress={stepsProgress} />
              <div className="df fdr">
                <div className="ordersDetail--details col-left">
                  <h3 className="ordersDetail--details__title">Detalhes</h3>

                  <BlankCard className="ordersDetail--details__item df fdr">
                    <div className="df fdr alic">
                      <Icons.cartSmall fill="#0489cc" />
                      <div className="item__title">
                        Vendido em:{" "}
                        {orderDetail?.channel === "store" ? `Lojinha` : `App`}
                      </div>
                    </div>
                  </BlankCard>

                  <BlankCard
                    className="ordersDetail--details__item df fdr pointer"
                    onClick={() => toogleScreen("expert")}
                  >
                    <div className="df fdr alic">
                      <Icons.clients fill="#0489cc" />
                      <div className="item__title">
                        Vendido por:{" "}
                        {orderDetail.user ? orderDetail.user.name : ""}
                      </div>
                    </div>
                    <Icons.next />
                  </BlankCard>

                  <BlankCard
                    className="ordersDetail--details__item df fdr pointer"
                    onClick={() => toogleScreen("client")}
                  >
                    <div className="df fdr alic">
                      <Icons.clients fill="#0489cc" />
                      <div className="item__title">
                        Cliente:{" "}
                        {orderDetail.customer ? orderDetail.customer.name : ""}
                      </div>
                    </div>
                    <Icons.next />
                  </BlankCard>

                  {orderDetail?.delivery_address ? (
                    <BlankCard className="ordersDetail--details__payment df fdc">
                      <div className="df fdr alic jc-sb">
                        <div className="df fdr alic">
                          <Icons.pingMap fill="#0489cc" />
                          <div className="item__title">
                            Endereço para entrega:
                          </div>
                        </div>
                      </div>
                      <div className="ordersDetail--details__payment--types">
                        <p className="ordersDetail--details__payment--title">
                          CEP: {orderDetail?.delivery_address?.postal_code}
                        </p>
                        <p className="ordersDetail--details__payment--title">
                          {orderDetail?.delivery_address?.address},&nbsp;
                          {orderDetail?.delivery_address?.number} -&nbsp;
                          {orderDetail?.delivery_address?.complement}&nbsp;
                          {orderDetail?.delivery_address?.district},&nbsp;
                          {orderDetail?.delivery_address?.city} -&nbsp;
                          {orderDetail?.delivery_address?.state}
                        </p>
                      </div>
                    </BlankCard>
                  ) : null}
                  {orderDetail?.shippings?.length ? (
                    <>
                      <BlankCard className="ordersDetail--details__payment df fdc">
                        <div className="df fdr alic jc-sb">
                          <div className="df fdr alic">
                            <Icons.delivery fill="#0489cc" />
                            <div className="item__title">
                              Entrega:{" "}
                              {orderDetail?.shippings[0]?.shipping_method}
                            </div>
                          </div>
                        </div>
                        <div className="ordersDetail--details__payment--types">

                          {orderDetail?.shipping !== "" && orderDetail?.shipping !== "0" ?
                            <p className="ordersDetail--details__payment--title">
                              Valor: R$ { Number(orderDetail?.shipping) / 100 }
                            </p>
                          :null}

                          {orderDetail?.shippings[0]?.working_days && orderDetail?.shippings[0]?.working_days > 0? (
                            <p className="ordersDetail--details__payment--title">
                              Previsão:{" "}
                              {orderDetail?.shippings[0]?.working_days} dias úteis após confirmação do pagamento
                            </p>
                            ) : <>
                              {orderDetail?.shippings[0]?.delivery_estimate? (
                                <p className="ordersDetail--details__payment--title">
                                  Previsão:{" "}
                                  {moment(
                                    orderDetail?.shippings[0]?.delivery_estimate
                                  ).format("DD/MM/YYYY")}
                                </p>
                              ) : null}
                            </>}
                        </div>
                      </BlankCard>

                      {orderDetail?.shippings[0]?.desired_delivery_at ? (
                        <BlankCard className="ordersDetail--details__payment df fdc">
                          <div className="df fdr alic jc-sb">
                            <div className="df fdr alic">
                              <Icons.calendar fill="#0489cc" />
                              <div className="item__title">
                                Data do Evento:{" "}
                                {moment(
                                  orderDetail?.shippings[0]?.desired_delivery_at
                                ).format("DD/MM/YYYY")}
                              </div>
                            </div>
                          </div>
                        </BlankCard>
                      ) : null}
                    </>
                  ) : null}

                  {orderDetail?.transactions?.length ? (
                    <BlankCard
                      onClick={() => toogleScreen("transactionsList")}
                      className="ordersDetail--details__payment df fdc"
                    >
                      <div className="df fdr alic jc-sb">
                        <div
                          className="df fdr alic jc-sb"
                          style={{ width: "100%" }}
                        >
                          <div className="df fdr alic">
                            <img src={CurrencyIcon} alt="Icone Moeda" />
                            <div className="item__title">Fatura</div>
                          </div>
                          <Icons.next />
                        </div>
                      </div>

                      <div className="ordersDetail--details__payment--types">
                        <p className="ordersDetail--details__payment--title">
                          Vencimento:{" "}
                          {orderDetail?.transactions?.length
                            ? paymentMethod(orderDetail?.transactions)
                            : "--"}
                        </p>
                      </div>
                    </BlankCard>
                  ) : null}
                </div>

                <div className="ordersDetail--details col-right">
                  <h3 className="ordersDetail--details__title">
                    {orderDetail.quantity}{" "}
                    {orderDetail.quantity === 1 ? "Item" : "Itens"}
                  </h3>

                  {orderDetail.items
                    ? orderDetail.items.map((item, index) => {
                        return (
                          <BlankCard
                            key={`itens${index}`}
                            className="ordersDetail--details__item df fdr"
                          >
                            <div className="df fdr">
                              <img
                                src={
                                  item?.product_variant?.product?.featured_asset
                                    ?.url || imageProductDefault
                                }
                                className="ordersDetail--details__item--img"
                                alt=""
                              />
                              <div className="df fdc">
                                <span className="ordersDetail--details__item--description">
                                  Cod. {item.sku}
                                </span>
                                <span className="ordersDetail--details__item--title">
                                  {item.name}
                                  {item?.product_variant?.quantity_items > 0
                                    ? ` (${item?.product_variant?.quantity_items} unidades)`
                                    : ""}
                                </span>
                                <span className="ordersDetail--details__item--description">
                                  Quantidade: {item.quantity}
                                </span>
                                <span className="ordersDetail--details__item--description">
                                  {item?.product_variant?.values.map(
                                    (item, index) => {
                                      let suffix = "";
                                      if (
                                        index > 1 &&
                                        index <
                                          item?.product_variant?.values.length
                                      ) {
                                        suffix = ", ";
                                      }
                                      return (
                                        item.option.name +
                                        " " +
                                        item.name +
                                        suffix
                                      );
                                    }
                                  )}
                                </span>
                                <span className="ordersDetail--details__item--description">
                                  Preço unitário R$ {item.subtotal_formatted}
                                </span>
                                <span className="ordersDetail--details__item--total">
                                  Total item R$ {item.total_formatted}
                                </span>
                              </div>
                            </div>
                          </BlankCard>
                        );
                      })
                    : null}

                    {orderDetail?.coupon ? (
                      <div style={{marginBottom: 10}}>
                  <BlankCard className="ordersDetail--details__totalSale df fdc">
                  <div className="ordersDetail--details__totalSale--total"  style={{marginBottom: 7}}>
                           Cupom utilizado
                          </div>
                        <div className="ordersDetail--details__totalSale--title" >
                            Código : {orderDetail?.coupon?.code}
                        </div>
                    <div className="ordersDetail--details__item--subtotal">
                    Desconto: {orderDetail?.coupon?.type_value === "PERCENTAGE" ? `${orderDetail?.coupon?.discount_formatted} %` : `R$ ${orderDetail?.coupon_discount_formatted}`}

                          </div>
                  </BlankCard></div>) : null}

                  <BlankCard className="ordersDetail--details__totalSale df fdc">

                  {orderDetail?.discount > 0  || orderDetail?.coupon_discount > 0 ? (<div className="ordersDetail--details__totalSale--subtotal" style={{marginBottom: 7}}>
                      Subtotal: R$ {orderDetail?.subtotal_formatted}
                    </div>
                    ) : null}

                    {orderDetail?.discount > 0 ? (
                      <>
                        <div className="ordersDetail--details__totalSale--discount">
                          Desconto: R$ {orderDetail?.discount_formatted}
                        </div>
                      </>
                    ) : null}

                    {orderDetail?.coupon_discount > 0 ? (
                      <>
                        <div className="ordersDetail--details__totalSale--discount">
                          Cupom: R$ {orderDetail?.coupon_discount_formatted}
                        </div>
                      </>
                    ) : null}


                      {orderDetail?.shipping != "" && orderDetail?.shipping != "0"  ?
                        <>
                          <div className="ordersDetail--details__item--title" style={{marginBottom: 7}}>
                            Frete: R$ { VMasker.toMoney(Number(orderDetail?.shipping))}
                          </div>
                          <div className="ordersDetail--details__totalSale--total">
                            Total: R$ {orderDetail?.total_formatted}
                          </div>
                        </>
                      :
                      <div className="ordersDetail--details__totalSale--total">
                        Total: R$ {orderDetail?.total_formatted}
                      </div>}


                  </BlankCard>

                  <BlankCard className="ordersDetail--details__taxInformation df fdc">
                    <div className="ordersDetail--details__taxInformation--total">
                        <div className="ordersDetail--details__taxInformation--title">
                          Informações fiscais
								      <img onClick={()=>setToogleModal(!toogleModal)} src={imageInfo} alt="Informações Fiscais" />
                        </div>

								{ orderDetail?.bonus && Object.keys(orderDetail.bonus).length > 0 ? (
									<>
										<div className="ordersDetail--details__taxInformation--content">
										Bonificação Lover: {bonusTotal(orderDetail.bonus,'formatted')} (recibo já emitido automaticamente)
										</div>
                      		</>
								) : null}

                        <div className="ordersDetail--details__taxInformation--content" >
                          Valor NF da venda: { value_formatted( orderDetail ? ( orderDetail.total - (orderDetail.bonus ? bonusTotal(orderDetail.bonus) : 0)) : "" ) }
                        </div>
                    </div>
                  </BlankCard>

                  <Modal classes="ordersDetail--details__modal" visible={toogleModal} onClose={()=>setToogleModal(!toogleModal)}>

                     <p className="ordersDetail--details__modal--title_info">Mais informações</p>

							<div className="ordersDetail--details__modal--box_info">
								<p className="ordersDetail--details__modal--box_info__subtitle">
									Entenda como funciona o fluxo fiscal e financeiro de suas vendas para clientes Pessoa Física no People Commerce
								</p>
								<p className="ordersDetail--details__modal--box_info__info">Para te apoiar, criamos um exemplo considerando uma  venda de R$100, comissão do Lover de 10% e taxa Onawa de 3,5%, sem considerar a incidência de frete. Confira:</p>
							</div>
							<div>

								<div>
									<div className="ordersDetail--details__modal--time_line">
											<div className="ordersDetail--details__modal--time_line__stepp">
												<p>01</p>
											</div>
											<div className="ordersDetail--details__modal--time_line__icons">
												<div className="ordersDetail--details__modal--time_line__icons--img">
													<img src={modalImageIcon7} alt=" "/>
												</div>
												<div className="verticalline"></div>
											</div>
											<div className="ordersDetail--details__modal--time_line__text">
												<p>Venda é registrada no app pelo Lover.</p>
											</div>
									</div>

									<div className="ordersDetail--details__modal--time_line">
											<div className="ordersDetail--details__modal--time_line__stepp">
												<p>02</p>
											</div>
											<div className="ordersDetail--details__modal--time_line__icons">
												<div className="ordersDetail--details__modal--time_line__icons--img">
													<img src={modalImageIcon6} alt=" "/>
												</div>
												<div className="verticalline"></div>
											</div>
											<div className="ordersDetail--details__modal--time_line__text">
												<p>Cliente final recebe fatura por e-mail e efetua o pagamento.</p>
											</div>
									</div>

									<div className="ordersDetail--details__modal--time_line">
											<div className="ordersDetail--details__modal--time_line__stepp">
												<p>03</p>
											</div>
											<div className="ordersDetail--details__modal--time_line__icons">
												<div className="ordersDetail--details__modal--time_line__icons--img">
													<img src={modalImageIcon5} alt=" "/>
												</div>
											</div>
											<div className="ordersDetail--details__modal--time_line__text">
												<p>Splitpayment acontece e valor é dividido* entre:</p>
											</div>
									</div>
								</div>


								<div className="ordersDetail--details__modal--row">
									<div className="ordersDetail--details__modal--row__col">
										<div className="ordersDetail--details__modal--row__col--img">
											<img src={modalImageIcon1} alt=" " />
										</div>
										<h2>Lover</h2>
										<p>
											Comissão % de acordo com o plano People Commerce
										</p>
										<p className="ordersDetail--details__modal--row__col--info">
											10%<br />
											R$ 10,00
										</p>
									</div>
									<div className="ordersDetail--details__modal--row__col">
										<div className="ordersDetail--details__modal--row__col--img">
											<img src={modalImageIcon2} alt=" " />
										</div>
										<h2>Onawa</h2>
										<p>
										Taxa % de acordo com o plano People Commerce
										</p>
										<p className="ordersDetail--details__modal--row__col--info">
											3,5%<br />
											R$ 3,50
										</p>
									</div>
									<div className="ordersDetail--details__modal--row__col">
										<div className="ordersDetail--details__modal--row__col--img">
											<img src={modalImageIcon3} alt=" " />
										</div>
										<h2>Marca</h2>
										<p>
											Valor da compra menos a taxa e menos a comissão
										</p>
										<p className="ordersDetail--details__modal--row__col--info">
											100,00 - 10,00 - 3,50<br />
											= R$ 86,50
										</p>
									</div>
								</div>


								<div>
									<div className="ordersDetail--details__modal--time_line">
											<div className="ordersDetail--details__modal--time_line__stepp">
												<p>04</p>
											</div>
											<div className="ordersDetail--details__modal--time_line__icons">
												<div className="ordersDetail--details__modal--time_line__icons--img">
													<img src={modalImageIcon4} alt=" "/>
												</div>
												<div className="verticalline extended"></div>
											</div>
											<div className="ordersDetail--details__modal--time_line__text">
												<div className="ordersDetail--details__modal--time_line__text--textSup" >
													<div className="ordersDetail--details__modal--time_line__text--textSup__img">
														<img src={modalImageIcon10} alt=" "/>
														<img src={modalImageIcon8} alt=" "/>
													</div>
													<span>Recibo Simples - Resumo da transação (sem valor fiscal)</span>
												</div>
												<p>Confirmado o pagamento, o Cliente Final recebe, por email da plataforma People Commerce, recibo, sem valor fiscal, no valor integral de sua compra.</p>
											</div>
									</div>

									<div className="ordersDetail--details__modal--time_line">
											<div className="ordersDetail--details__modal--time_line__stepp">
												<p>05</p>
											</div>
											<div className="ordersDetail--details__modal--time_line__icons">
												<div className="ordersDetail--details__modal--time_line__icons--img">
													<img src={modalImageIcon4} alt=" "/>
												</div>
												<div className="verticalline extended"></div>
											</div>
											<div className="ordersDetail--details__modal--time_line__text">
												<div className="ordersDetail--details__modal--time_line__text--textSup" >
													<div className="ordersDetail--details__modal--time_line__text--textSup__img">
														<img src={modalImageIcon10} alt=" "/>
														<img src={modalImageIcon9} alt=" "/>
													</div>
													<span>NF Taxa Onawa</span>
												</div>
												<p>Todo primeiro dia útil do mês, o adquirente financeiro, envia para Marca, a NF com o valor consolidado da taxa Onawa, de acordo com o Plano People Commece contratado, referente às transações do mês anterior.</p>
											</div>
									</div>

									<div className="ordersDetail--details__modal--time_line">
											<div className="ordersDetail--details__modal--time_line__stepp">
												<p>06</p>
											</div>
											<div className="ordersDetail--details__modal--time_line__icons">
												<div className="ordersDetail--details__modal--time_line__icons--img">
													<img src={modalImageIcon4} alt=" "/>
												</div>
											</div>
											<div className="ordersDetail--details__modal--time_line__text">
												<div className="ordersDetail--details__modal--time_line__text--textSup" >
													<div className="ordersDetail--details__modal--time_line__text--textSup__img">
														<img src={modalImageIcon9} alt=" "/>
														<img src={modalImageIcon8} alt=" "/>
													</div>
													<span>NF Produtos ou Serviços</span>
												</div>
												<p>Ao receber seus produtos/serviços, o Cliente Final também receberá a NF equivalente ao valor de sua compra menos o valor de comissão do Lover.</p>
											</div>
									</div>
								</div>

								<p className="ordersDetail--details__modal--info">*Valor disponível em 5 dias para pagamento em boleto ou em 32 dias para cartão</p>

							</div>
                  </Modal>


                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default OrdersDetail;
