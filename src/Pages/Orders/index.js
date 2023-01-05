import React, {useState, useEffect} from "react";
import "./styles.scss";
import List from "./List";
import {useHistory} from "react-router-dom";
import moment from 'moment';

import gqlClient from "../../services/GraphQlRequest";
import {useIndicators} from "../../gqlEndpoints/queries";

import {Paginator, Filter, VoidTemplate, Icons, Row, CardIndicator, Line, Loader} from "../../components";

import OrdersPendingList from './OrdersPendingList';

const NotifyPedingOrders = ({total, onClick}) => (
  <>
    <div className="notifyPendingOrders df fdr alic jc-sb" onClick={onClick}>
      <div>Existem {total || 0} pedidos pendentes de análise!</div>
      <Icons.next fill="#FFF"/>
    </div>
    <Line/>
  </>
);

const Orders = () => {
  const history = useHistory();
  const {indicators, loadIndicators, loadingIndicators} = useIndicators({})
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersPending, setOrdersPending] = useState([]);
  const [screen, setScreen] = useState('');
  const [filter, setFilter] = useState({});
  const [paginatorInfo, setPaginatorInfo] = useState(null);
  const [paginatorValues, setPaginatorValue] = useState(false);

  const [filterSchema] = useState({
    status: {
      label: "Status",
      type: "radio",
      values: [
        {
          label: "Aguardando aprovação",
          value: 'placed_at'
        },
      ]
    }
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getOrders = async ({
                             first,
                             page,
                             searchText = '',                             
                             from,
                             to
                           }) => {

    setLoading(true);

    let paginator_data = `
      paginatorInfo{
        count
        currentPage
        firstItem
        lastItem
        lastPage
        hasMorePages
        perPage
        total
      }`;

    let orders_data = `
      data{
        id
        code
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
      }`;

    const query = `query{
      orders(
        first: ${first},
        page: ${page}
        ${from !== '' && to !== '' ?
      ` ,filter:{
                AND: [
                    { 
                      OR: [
                        { column: APPROVED_AT, operator: IS_NOT_NULL  },
                        { column: CANCELED_AT, operator: IS_NOT_NULL  }
                      ] 
                    }
                    {
                      AND: [                        
                        { column: PLACED_AT, operator: BETWEEN, value: ["${from}","${to}"] }
                        ${searchText !== '' ? `,{
                            AND: [                              
                              { column: CODE, operator: EQ, value: "${searchText}" }
                            ]
                          }`
        : ''}

                      ]
                    }
                  ]
              }
            ` : ''}

        ){
        paginatorInfo{
          count
          currentPage
          total
        }
        ${paginator_data}
        ${orders_data}
      }
    }`;

    const query_pendings = `query{
      orders(
        first: 1000,
        filter:{
          AND: [
              { column: APPROVED_AT, operator: IS_NULL  },
              { column: CANCELED_AT, operator: IS_NULL  },
            ]
        }){
          ${orders_data}
      }
    }`;

    const results = await gqlClient().request(query);
    const resultsPending = await gqlClient().request(query_pendings);
    setOrdersPending(resultsPending.orders.data);
    setOrders(results.orders.data);
    setPaginatorInfo(results.orders.paginatorInfo);
    setLoading(false);
  };

  useEffect(() => {
    let first = paginatorValues?.first || 10;
    let page = paginatorValues?.page || 1;
    let from = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
    let to = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')

    if (filter?.startDate || filter?.endDate) {
      from = moment(filter.startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
      to = moment(filter.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }

    let orderParams = {first, page, from, to};
    let indicatorsParams = {from, to};

    if (filter?.searchText !== '') {
      orderParams.searchText = filter?.searchText;
    }

    getOrders(orderParams);
    loadIndicators(indicatorsParams);

    if (history?.location?.params?.from) {
      setScreen('ordersPending');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, paginatorValues]);

  return (
    <>
      {screen === 'ordersPending' ? <OrdersPendingList onBack={() => setScreen('')} orders={ordersPending}/> : null}
      <div className="orders__wrapper " style={screen !== '' ? {display: 'none'} : {}}>
        <Filter
          title="Pedidos"
          setFilter={setFilter}
          searchPlaceholder='Código'
          filterSchema={filterSchema}
        />
        <Row>
          <CardIndicator
            loading={loadingIndicators}
            number={`R$ ${indicators?.paid_orders?.sum_formatted || '0,00'}`}
            title="Pedidos pagos"
          />

          <CardIndicator
            loading={loadingIndicators}
            number={`R$ ${indicators?.paid_orders?.avg_formatted || '0,00'}`}
            title="Ticket médio"
          />

          <CardIndicator
            loading={loadingIndicators}
            number={`${indicators?.paid_orders?.quantity || '0'}`}
            title="Pedidos"
          />

          <CardIndicator
            loading={loadingIndicators}
            number={`${indicators?.waiting_pay_orders?.quantity || '0'} `}
            title="Pedidos aguardando pagamento"
          />

        </Row>
        <Line/>

        {
          ordersPending?.length ?
            <NotifyPedingOrders total={ordersPending?.length} onClick={() => setScreen('ordersPending')}/>
            : null
        }

        {
          loading ? <Loader active={loading}/> : <>
            {orders.length ? (
              <>
                <List data={orders}/>
              </>
            ) : (
              <VoidTemplate message="Nenhum pedido foi encontrado para o filtro selecionado"/>
            )}
          </>
        }
        {paginatorInfo &&
        <Paginator
          data={paginatorInfo}
          onChange={setPaginatorValue}
        />
        }
      </div>
    </>
  );
};

export default Orders;
