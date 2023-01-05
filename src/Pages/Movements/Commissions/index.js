import React, { useState } from 'react';
import moment from 'moment';
import { useIndexBonus, useBonusRescuedList, useIndicatorsBonus, useBonusUnRescueList } from '../../../hooks-api/useBonification';
import { Filter } from "../../../components/FilterNew";
import Layout from './Layout';


const filterSchema = {
  approved_at: {
    label: "Data do pedido",
    type: "date",
    column: 'APPROVED_AT',
    operator: 'BETWEEN',
    values: {
      from: moment().startOf('month'),
      to: moment().endOf('month'),
    },
    editable: true,
    required: true
  },
  paid_at: {
    label: "Data de pagamento do pedido",
    type: "date",
    column: 'PAID_AT',
    operator: 'BETWEEN',
    editable: true,
  },
  level: {
    label: "Nível",
    type: "radio",
    values: [
      {
        label: "Todos",
        value: 'all'
      },
      {
        label: "Master",
        value: 1
      },
      {
        label: "Lover",
        value: 0
      }
    ]
  },
  status: {
    label: "Status",
    type: "radio",
    values: [
      {
        label: "Todos",
        value: 'all'
      },
      {
        label: "Resgate efetuado",
        value: 'IS_NOT_NULL'
      },
      {
        label: "Em aberto",
        value: 'IS_NULL'
      },
    ]
  },
};



export default () => {

  const [loading, setLoading] = useState(false);
  const { data, loading: loadingBonus, refetch } = useIndexBonus({
    hasOrder: {
      AND: [
        {
          column: 'APPROVED_AT',
          operator: 'BETWEEN',
          value: [
            moment().startOf('month').format('YYYY-MM-DD 00:00:00'),
            moment().endOf('month').format('YYYY-MM-DD 23:59:59')
          ]
        }
      ]
    }
  });

  const { data: indicators, loading: loadingIndicators, refetch: refetchIndicators } = useIndicatorsBonus({
    hasOrder: {
      AND: [
        {
          column: 'APPROVED_AT',
          operator: 'BETWEEN',
          value: [
            moment().startOf('month').format('YYYY-MM-DD 00:00:00'),
            moment().endOf('month').format('YYYY-MM-DD 23:59:59')
          ]
        }
      ]
    }
  });

  const [bonusRecuedList, { data: resultBonusRescued, loading: lodingBonusRescued } ] = useBonusRescuedList();
  const [bonusUnRescueList, { data: resultUnRescued } ] = useBonusUnRescueList();


  const handleLoadComissions = async ({filter, params}) => {
    setLoading(true);
    let variablesToQuery = {
      first: params?.first ? Number(params?.first) : 10,
      page: params?.page ? Number(params?.page) : 1,
    };

    if(filter){

      let FilterAND = [];
      let HasOrderAND = [];
      let HasUserOR = [];

      if (filter?.searchText && filter?.searchText !== '') {
        if(/^\d+$/.test(filter?.searchText)){
          variablesToQuery.hasOrder = {
            AND: [
              { column: 'CODE', operator: 'LIKE', value: `%${filter?.searchText}%` }
            ]
          };
          delete variablesToQuery.hasUser;
        }else{
          HasUserOR.push({
            column: 'NAME',
            operator: 'LIKE',
            value: `%${filter?.searchText }%`
          });
          delete variablesToQuery.hasOrder;
        }
      }else{
        delete variablesToQuery.hasUser;
        delete variablesToQuery.hasOrder;
      }

      if (filter?.level && filter?.level !== '' && filter?.level !== 'all') {
        FilterAND.push({
          column: 'DEPTH',
          operator: 'EQ',
          value: filter?.level.value,
        });
      }

      if (filter?.status && filter?.status.value !== '' && filter?.status.value !== 'all') {
        FilterAND.push({
          column: 'FULLY_RESCUED_AT',
          operator: filter?.status.value,
        });
      }

      if (filter?.paid_at) {
        HasOrderAND.push({
          column: 'PAID_AT',
          operator: 'BETWEEN',
          value: [
            moment(filter?.paid_at.from).format('YYYY-MM-DD 00:00:00'),
            moment(filter?.paid_at.to).format('YYYY-MM-DD 23:59:59')
          ]
        });
      }


      if (filter?.approved_at) {
        HasOrderAND.push({
          column: 'APPROVED_AT',
          operator: 'BETWEEN',
          value: [
            moment(filter?.approved_at.from).format('YYYY-MM-DD 00:00:00'),
            moment(filter?.approved_at.to).format('YYYY-MM-DD 23:59:59')
          ]
        });
      }

      variablesToQuery = {
        filter:{
          AND: FilterAND
        },
        hasUser:{
          OR: HasUserOR
        },
        hasOrder:{
          AND: HasOrderAND
        },
        ...variablesToQuery
      };

    }

    await refetch(variablesToQuery);
    await refetchIndicators(variablesToQuery);

    setLoading(false);
  }


  return(
    <Filter
      config={{
        title: "Bonificação",
        searchPlaceholder: "Nome ou Código",
        filterSchema: filterSchema,
        action: handleLoadComissions
      }}

    >
      <Layout
        data={data}
        indicators={indicators}
        loadingIndicators={loadingIndicators}
        loading={loadingBonus || loading || lodingBonusRescued}
        setLoading={setLoading}
        refetch={refetch}
        handleLoadComissions={handleLoadComissions}
        bonusRecuedList={bonusRecuedList}
        resultBonusRescued={resultBonusRescued}
        bonusUnRescueList={bonusUnRescueList}
        resultUnRescued={resultUnRescued}
      />
    </Filter>
  );
}
