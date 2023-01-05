import React,{useEffect, useState} from 'react';

import List from "./List";

import gqlClient from "../../../services/GraphQlRequest";

import { VoidTemplate, Loader, Row, Line, Icons, Breadcrumbs } from "../../../components";

import { useHistory, useRouteMatch }from 'react-router-dom';

import "./styles.scss";


const RescuesCommissionsList = () => {
    const history = useHistory();
    let match = useRouteMatch("/movimentacoes/resgates/bonificacao/:id");
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getOrders = async () => {
      setLoading(true);

      const query = `query{
        orders(first: 10){
          paginatorInfo{
            count
            currentPage
            total
          }
          data{
            id
            external_id
            user_id
            placed_at
            delivered_at
            paid_at
            approved_at
            billed_at
            canceled_at
            total_formatted
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
              discount
              total
            }
            user{
              name
            }

          }
        }
      }`;

      const results = await gqlClient().request(query);
      setOrders(results.orders.data);
      setLoading(false);
    };

    useEffect(() => {
      getOrders();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return loading ? (
      <Loader active={loading} />
    ) : (
      <div className="rescuesCommissionsList">
        <Breadcrumbs itens={["Movimentações", "Resgates", "Resgate # 0000"]} />

        <div className="rescuesCommissionsList--board">
          <div className="rescuesCommissionsList--returnWrapper">
            <div
              className="rescuesCommissionsList--iconBack"
              onClick={() => history.replace({ pathname: "/movimentacoes/resgates/"+ match.params.id})}
            >
              <Icons.back />
            </div>
          </div>
          <div>
            <p className="previus">Resgate #06</p>

            <h1 className="rescuesCommissionsList--title">Comissão: R$ 1.439,00</h1>
            <p className="subtitle">
              03 períodos selecionados
              <br />
              30 pedidos
            </p>
            <Line />
          <Row>
            {true ? (
                <List data={orders} />
            ) : (
            <VoidTemplate message="Nenhum Pedido foi feito ainda" />
            )}
        </Row>

        </div>
          </div>
        </div>
    );
}

export default RescuesCommissionsList;
