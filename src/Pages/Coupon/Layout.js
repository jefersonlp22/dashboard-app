import React, { useState, useEffect, useContext } from "react";
import "./styles.scss";
import List from "./List";
import { FilterContext } from "../../components/FilterNew";
import IconInfo from "./Results/Icons/info";
import { IconDelivery } from "./Results/Icons/delivery";
import {
  Paginator,
  VoidTemplate,
  Icons,
  Row,
  Line,
  Loader,
} from "../../components";

import { ResultBox, ResultCard, CardsDescription, ItemDescription, TrackCounter } from './Results';


const Orders = ({ results, coupons, loading, ordersPending, screen, setScreen, indicators, paginatorInfo, ...props }) => {

  const { filter } = useContext(FilterContext);
  const [paginatorValues, setPaginatorValue] = useState(false);

  useEffect(() => {
    if (props.handleLoadData) {
      console.log('paginatorValues',paginatorValues)
      console.log(filter);
      props.handleLoadData({
        filter, params: {
          first: paginatorValues?.first,
          page: paginatorValues?.page,
        }
      });
    }
    // eslint-disable-next-line
  }, [paginatorValues]);

  return (
    <>
      <div
        className="orders__wrapper "
      >
        <Row>
          <ResultBox columnExp={4}>
            <ResultCard
              columnExp={4}
              key="card1Result1"
              id="card1Result1"
              loading={loading}
              value={results?.published?.quantity || 0}
              title="Publicados"
              expansorHidden={true}
            //  info="Pedidos que ainda estão aguardando a aprovação para envio do link de pagamento"
            //  delivery
            >
              <CardsDescription>
                <ItemDescription className="item" color="#FFAD33">
                  <p>{results?.published?.quantity || 0}</p>
                  <span>Publicados</span>
                </ItemDescription>
                <ItemDescription className="item" color="#81A5FF">
                  <p>{results?.published?.quantity || 0}</p>
                  <span>Distribuidos</span>
                </ItemDescription>
                <ItemDescription className="item" color="#81A5FF">
                  <p>{results?.published?.quantity || 0}</p>
                  <span>Pedidos Pagos</span>
                </ItemDescription>
                <ItemDescription className="item" color="#6DC783">
                  <p>{results?.published?.quantity || 0}</p>
                  <span>Vencidos</span>
                </ItemDescription>
                <ItemDescription className="item" color="#FF6F6F">
                  <p>{results?.published?.quantity || 0}</p>
                  <span>Taxa de conversão</span>
                </ItemDescription>
              </CardsDescription>

              <TrackCounter
                data={{
                  total: 114000.0,
                  variants: [
                    { color: "#FFAD33", value: 20000.0 },
                    { color: "#81A5FF", value: 30000.0 },
                    { color: "#81A5FF", value: 50000.0 },
                    { color: "#6DC783", value: 10000.0 },
                    { color: "#FF6F6F", value: 4000.0 },
                  ],
                }}
              />

            </ResultCard>
            <ResultCard
              columnExp={4}
              key="card2Result2"
              id="card2Result2"
              loading={loading}
              value={results?.expired?.quantity || 0}
              title="Expirados"
              expansorHidden={true}
            //  info="Quantidade total de pedidos"
            //  delivery
            />
            <ResultCard
              columnExp={4}
              key="card3Result3"
              id="card3Result3"
              loading={loading}
              value={results?.canceled?.quantity || 0}
              title="Cancelados"
              expansorHidden={true}
            //  info="Ticket médio"
            //  delivery
            />
            <ResultCard
              columnExp={4}
              key="card3Result4"
              id="card3Result4"
              loading={loading}
              value={results?.not_published?.quantity || 0}
              title="Não publicados"
              expansorHidden={true}
            //  info="Ticket médio"
            //  delivery
            />
          </ResultBox>
        </Row>
        <Line />

        {loading ? (
          <Loader active={true} />
        ) : (
          <>
            {coupons?.length ? (
              <>
                <List data={coupons} />
              </>
            ) : (
              <VoidTemplate message="Nenhum cupom foi encontrado para o filtro selecionado" />
            )}
          </>
        )}
        <Paginator
          data={paginatorInfo}
          onChange={setPaginatorValue}
        />
      </div>
    </>
  );
};

export default Orders;
