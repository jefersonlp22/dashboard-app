import React, { useEffect, useState } from "react";
import "./styles.scss";
import BackIcon from "../../../../assets/svg/icon-back.svg";

import { useHistory } from "react-router-dom";
import {
  Row,
  Line,
  Icons,
  BlankCard,
  Loader,
  Breadcrumbs,
  IconsSidebar
} from "../../../../components";
import Tabs from "../../../../Layouts/Tabs";

import ExpertOrdersList from "../ExpertOrdersList";
import ExpertRegister from "../ExpertRegister";

import moment from "moment";

import { useChannel } from "../../../../gqlEndpoints/queries";

import levels from "../levels";

const items = [
  {
    url: "/people/lovers",
    title: "Lista"
  },
  {
    url: "/people/lovers/grupos",
    title: "Grupos"
  }
];

const ExpertDetail = () => {
  const history = useHistory();
  const [loading] = useState(false);

  const [screen, setScreen] = useState("detail");

  const {
    getChannel,
    channelById: expert,
    getOrdersChannel,
    ordersChannel,
    loadOrders
  } = useChannel();

  useEffect(() => {
    if (expert && history?.location?.state?.backfor) {
      setScreen(history?.location?.state?.backfor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expert]);

  useEffect(() => {
    getChannel(history?.location?.state?.id);
    getOrdersChannel(history?.location?.state?.id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("loadOrders", loadOrders);

  return (
    <>
      {screen === "register" ? (
        <ExpertRegister
          expert={expert?.user}
          tabItems={items}
          breadcrumbs={[
            "People",
            "Lovers",
            "Lista",
            expert?.user?.name,
            "Pedidos"
          ]}
          onBack={() => setScreen("detail")}
        />
      ) : null}
      {screen === "orderList" ? (
        <ExpertOrdersList
          network={expert?.id}
          expert={expert?.user}
          orders={ordersChannel}
          setScreen={setScreen}
          tabItems={items}
          loading={loadOrders}
        />
      ) : null}
      {screen === "detail" ? (
        <>
          {loading ? <Loader active={loading} /> : null}
          <Tabs items={items} />
          <div className="expertDetail">
            <Breadcrumbs
              itens={["People", "Lovers", "Lista", expert?.user?.name]}
            />
            <Row className="expertDetail--board">
              <div className="expertDetail--returnWrapper">
                <div
                  className="expertDetail--iconBack"
                  onClick={() => {
                    if (history?.location?.state?.fromTo === "invites") {
                      history.replace({ pathname: "/people/convites" });
                    } else {
                      history.replace({ pathname: "/people/lovers" });
                    }
                  }}
                >
                  <img src={BackIcon} alt="Icone Retorno" />
                </div>
              </div>
              <Row className="fdr alic jc-start">
                <div className="expertDetail--picture">
                  {expert?.user?.picture_url ? (
                    <img src={expert?.user?.picture_url} alt="Avatar fulano" />
                  ) : (
                    <Icons.perfilSmall />
                  )}
                </div>
                <div>
                  <h1 className="expertDetail--name">{expert?.user?.name}</h1>
                  <div className={`expertDetail--level `}>
                    Nível: {levels[expert?.level]}
                  </div>
                  <div className={`expertDetail--responsible `}>
                    Responsável: {expert?.responsible?.user?.name}
                  </div>
                </div>
              </Row>

              <Line />

              <Row className="fdc">
                <span className="expertDetail--subtitle">Cadastro</span>
                <BlankCard
                  className="expertDetail--comissions df fdr alic jc-sb pointer"
                  onClick={() => setScreen("register")}
                >
                  <div className="df fdr">
                    <div className="df fdc expertDetail--since">
                      <span className="expertDetail--property">
                        Lover desde
                      </span>
                      <span className="expertDetail--value">
                        {expert?.user?.agreed_at
                          ? moment(expert?.user?.agreed_at).format("DD/MM/YYYY")
                          : "-"}
                      </span>
                    </div>
                    <div className="df fdc">
                      <span className="expertDetail--property">
                        Pessoa jurídica
                      </span>
                      <span className="expertDetail--value">
                        {expert?.user?.company_name || "-"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <IconsSidebar.arrow_next fill="#4d4d4d" />
                  </div>
                </BlankCard>
              </Row>

              <Row className="fdc">
                <span className="expertDetail--subtitle">Pedidos</span>
                <BlankCard
                  className="expertDetail--comissions df fdc pointer"
                  onClick={() => {
                    if (ordersChannel.length) {
                      setScreen("orderList");
                    }
                  }}
                >
                  {loadOrders ? (
                    <div className="cardIndicator--loader__wrapper">
                      <Loader
                        active={loadOrders}
                        color="#b2b2b3"
                        className="cardIndicator--loader"
                      />
                    </div>
                  ) : (
                    <div className="df fdr alic jc-sb ">
                      <div className="df fdc">
                        {ordersChannel.length ? (
                          <>
                            <span className="expertDetail--value">
                              {expert?.user?.name} possui {ordersChannel.length}{" "}
                              pedidos feitos.
                            </span>
                            <span className="expertDetail--property">
                              Último pedido dia{" "}
                              {moment(
                                ordersChannel[ordersChannel.length - 1]
                                  ?.placed_at
                              ).format("DD/MM/YYYY")}{" "}
                              {ordersChannel[ordersChannel.length - 1]
                                ?.total_formatted
                                ? `no valor de R$  ${
                                    ordersChannel[ordersChannel.length - 1]
                                      ?.total_formatted
                                  }`
                                : ""}
                              .
                            </span>
                          </>
                        ) : (
                          <span className="expertDetail--value">
                            {expert?.user?.name} não fez nenhum pedido este mês.
                          </span>
                        )}
                      </div>
                      {ordersChannel.length ? (
                        <div className="df fdr alic">
                          <IconsSidebar.arrow_next fill="#4d4d4d" />
                        </div>
                      ) : null}
                    </div>
                  )}
                </BlankCard>
              </Row>
            </Row>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ExpertDetail;
