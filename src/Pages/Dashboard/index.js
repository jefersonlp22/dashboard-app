import React, { useEffect, useContext, useState, useMemo } from "react";

import { CardIndicator, Row, Filter, Line } from "../../components";

import { useQueryIndicators } from '../../hooks-api/useIndicators';
import { SessionContext } from '../../contexts/Session.ctx';

import moment from 'moment';

let dateTime = {
  from: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
  to: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')
};

const Dashboard = () => {
  const { Session  } = useContext(SessionContext);
  const { data, loading, refetch } = useQueryIndicators(dateTime);

  const [reLoading, setReLoading] = useState(false);

  // const percentActivity = useMemo(() => (data?.indicators?.active_users?.quantity / data?.indicators?.users?.quantity * 100).toFixed(0), [data]);
  const totalUsers = useMemo(() => (data?.indicators?.trial_users?.quantity + data?.indicators?.users?.quantity), [data]);

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
    }
  });

  async function handleRefetch(){
    setReLoading(true);
    let params = dateTime;
    if (filter?.startDate || filter?.endDate) {
      params = {
        from: moment(filter.startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        to: moment(filter.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss')
      };
    }
    await refetch(params);
    setReLoading(false);
  }

  useEffect(() => {
    handleRefetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Session, filter]);

  return (
    <>
      <Filter
        title="Resultados gerais"
        // enabled={false}
        dateFilter={true}
        textFilter={false}
        setFilter={setFilter}
        filterSchema={filterSchema}
        searchPlaceholder='Indicador'
      />
      <Line />

      <div className="df fdr jc-start alic">
        <h1>Lovers</h1>
      </div>
      <Line />
      <Row>
        <CardIndicator
          loading={loading || reLoading}
          number={`${data?.indicators?.users?.quantity || '0'}`}
          title="Lovers"
        />

        <CardIndicator
          loading={loading || reLoading}
          number={`${data?.indicators?.active_users?.quantity || '0'}`}
          title="Ativos"
        />

        <CardIndicator
          loading={loading || reLoading}
          number={`${data?.indicators?.active_users?.quantity && data?.indicators?.users?.quantity ? ((data?.indicators?.active_users?.quantity*100)/data.indicators.users.quantity).toFixed(2) : '0'}%`}
          title="Percentual de atividade"
        />

        <CardIndicator
          loading={loading || reLoading}
          number={`${data?.indicators?.inactive_users?.quantity || '0'}`}
          title="Inativos"
        />

      </Row>

      <Line />
      <Row>
        <CardIndicator
          loading={loading || reLoading}
          number={`${data?.indicators?.new_users?.quantity || '0'}`}
          title="Inícios"
        />

        <CardIndicator
          loading={loading || reLoading}
          number={`${data?.indicators?.trial_users?.quantity || '0'}`}
          title="Trial"
        />

        <CardIndicator
          loading={loading || reLoading}
          number={`${totalUsers > 0 ? totalUsers : '0'}`}
          title="Lovers + Trial"
        />

      </Row>

      <Line />

      <div className="df fdr jc-start alic">
        <h1>Pedidos</h1>
      </div>
      <Line />
      <Row>
        <CardIndicator
          loading={loading || reLoading}
          number={`R$ ${data?.indicators?.orders?.sum_formatted || '0,00'}`}
          title="Total"
        />

        <CardIndicator
          loading={loading || reLoading}
          number={`${data?.indicators?.orders?.quantity || '0'}`}
          title="Qtd. Transações"
        />

        <CardIndicator
          loading={loading || reLoading}
          number={`R$ ${data?.indicators?.orders?.avg_formatted || '0,00'}`}
          title="Ticket médio"
        />
      </Row>
      <Line />

      <div className="df fdr jc-start alic">
        <h1>Pedidos Pagos</h1>
      </div>
      <Line />
      <Row>
        <CardIndicator
          loading={loading || reLoading}
          number={`R$ ${data?.indicators?.paid_orders?.sum_formatted || '0,00'}`}
          title="Total"
        />

        <CardIndicator
          loading={loading || reLoading}
          number={`${data?.indicators?.paid_orders?.quantity || '0'}`}
          title="Qtd. Transações"
        />

        <CardIndicator
          loading={loading || reLoading}
          number={`R$ ${data?.indicators?.paid_orders?.avg_formatted || '0,00'}`}
          title="Ticket médio"
        />
      </Row>
      <Line />

      <div className="df fdr jc-start alic">
        <h1>Pedidos aguardando pagamento</h1>
      </div>
      <Line />
      <Row>
        <CardIndicator
          loading={loading || reLoading}
          number={`R$ ${data?.indicators?.waiting_pay_orders?.sum_formatted || '0,00'}`}
          title="Total"
        />

        <CardIndicator
          loading={loading || reLoading}
          number={`${data?.indicators?.waiting_pay_orders?.quantity || '0'} `}
          title="Qtd. Transações"
        />

        <CardIndicator
          loading={loading || reLoading}
          number={`R$ ${data?.indicators?.waiting_pay_orders?.avg_formatted || '0,00'}`}
          title="Ticket médio"
        />
      </Row>
      <Line />

      <div className="df fdr jc-start alic">
        <h1>Pedidos Cancelados</h1>
      </div>
      <Line />
      <Row>
        <CardIndicator
          loading={loading || reLoading}
          number={`R$ ${data?.indicators?.canceled_orders?.sum_formatted || '0,00'}`}
          title="Total"
        />

        <CardIndicator
          loading={loading || reLoading}
          number={`${data?.indicators?.canceled_orders?.quantity || '0'}`}
          title="Qtd. Transações"
        />

        <CardIndicator
          loading={loading || reLoading}
          number={`R$ ${data?.indicators?.canceled_orders?.avg_formatted || '0,00'}`}
          title="Ticket médio"
        />
      </Row>
      <Line />
    </>
  );
};

export default Dashboard;
