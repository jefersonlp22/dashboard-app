import React,{useEffect, useState} from 'react';

import List from "./List";

import gqlClient from "../../../services/GraphQlRequest";

import { VoidTemplate, Loader, CardIndicator, Row, Line, Icons, Filter } from "../../../components";

import "./styles.scss";


const Rescues = () => {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('');
    const [filterSchema, ] = useState({
      responsible: {
        label: "Responsável",
        type: "checkbox",
        values: [
          {
            label: "Todos",
            value: 'all'
          }
        ]
      },
      status: {
        label: "Status",
        type: "checkbox",
        values: [
          {
            label: "Todos",
            value: 'all'
          },
          {
            label: "Ativo",
            value: "active"
          },
          {
            label: "Trial",
            value: "trial"
          },
          {
            label: "Pendente",
            value: "pending"
          }
        ]
      },
      order: {
        label: "Ordenar",
        type: "radio",
        values: [
          {
            label: "Entrada (mais novos)",
            value: "asc"
          },
          {
            label: "Entrada (mais antigos)",
            value: "desc"
          },
          {
            label: "Faturamento (maior)",
            value: "eita"
          },
          {
            label: "Faturamento (menor)",
            value: "upa"
          },
          {
            label: "Pedidos (maior número)",
            value: "boom"
          },
          {
            label: "Pedidos (menor número)",
            value: "badabim"
          },
          {
            label: "Nome (ordem alfabética)",
            value: "samurai"
          },
          {
            label: "Últimos Pedidos",
            value: "muchacho"
          },
        ]
      }
    });


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
        <>
        <Filter title="Resgates" setFilter={setFilter} filterSchema={filterSchema}/>
        <Row>
            <CardIndicator
                number="R$ 2.878,00"
                title="Resgatados"
                information={
                    <div className="df fdr alic commissionCardInformation">
                        <Icons.people  fill="#6DC783" />
                        <div>R$ 1.439,00</div>
                    </div>
                }
            />

            <CardIndicator
                number="3"
                title="Transações em aberto"
                infoColor="#ff6f6f"
                information={
                    <div className="df fdr alic commissionCardInformation">
                        <Icons.people fill="#ff6f6f" />
                        <div>Menos de 1</div>
                    </div>
                }
            />
        </Row>
        <Line />
        <Row>
            {true ? (
                <List data={orders} />
            ) : (
            <VoidTemplate message="Nenhum Pedido foi feito ainda" />
        )}
        </Row>

      </>
    );
}

export default Rescues;
