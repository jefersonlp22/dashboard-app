import React, { useEffect, useContext, useState } from "react";
import moment from "moment";
import { useIndexCoupons, useCouponIndicators } from "../../hooks-api/useCoupon";
import { Filter ,  FilterContext } from "../../components/FilterNew";
import { Button } from "../../components/Buttons";
import { useHistory } from "react-router-dom";
import { CouponContext } from "../../contexts/Coupon.ctx";
import Layout from "./Layout";
import TotalStorage from "total-storage";
import _ from "lodash";

const [TENANT_LIST, TENANT_ID] = TotalStorage.get([
  "TENANT_LIST",
  "@Auth:tenant"
]);

let isWine;

if (TENANT_ID) {
  let activeTenant = _.findIndex(TENANT_LIST, {
    external_id: TENANT_ID,
  });
  isWine = TENANT_LIST[activeTenant]
}

const filterSchema = {
  start_at: {
    label: "Início vigência",
    type: "date",
    column: "START_AT",
    operator: "BETWEEN",
    date_type: "SINGLE_DATE",
    values: {
      from: moment().startOf("month")
    },
    editable: true,
    required: true
  },

  end_at: {
    label: "Final vigência",
    type: "date",
    column: "END_AT",
    operator: "BETWEEN",
    date_type: "SINGLE_DATE",
    values: {
      from: moment().endOf("month")
    },
    editable: true,
    required: false
  },

  status: {
    label: "Status",
    type: "checkbox",
    values: [
      {
        label: "Publicados",
        value: "published"
      },
      {
        label: "Expirados",
        value: "expired"
      },
      {
        label: "Cancelados",
        value: "closed"
      },
      {
        label: "Não-publicados",
        value: "draft"
      },
    ]
  },

  type_value: {
    label: "Tipo de desconto",
    type: "radio",
    values: [
      {
        label: "Todos",
        value: "all"
      },
      {
        label: "Valor",
        value: "PRICE"
      },
      {
        label: "Percentual",
        value: "PERCENTAGE"
      },
    ]
  },

  recipient: {
    label: "Benecificário",
    type: "radio",
    values: [
      {
        label: "Todos",
        value: "all"
      },
      {
        label: isWine?.id === '6' ? "Embaixador" : "Lover",
        value: "AMBASSADOR"
      },
      {
        label: "Cliente Final",
        value: "CUSTOMER"
      },
    ]
  },
  channel: {
    label: "Canal",
    type: "radio",
    values: [
      {
        label: "APP",
        value: "OFFICE"
      },
      {
        label: "Lojinha",
        value: "STORE"
      },
      {
        label: "Ambos",
        value: "ANY"
      },
    ]
  },
};

export default () => {
  const [loading, setLoading] = useState(false);
  const [screen, setScreen] = useState("");
  const { filter : stateFilter, setFilter } = useContext(FilterContext);
  const history = useHistory();
  const {data: indicators, loading: loadingIndicators, refetch: refetchIndicators} = useCouponIndicators();

  // useEffect(() => {
  //   if (TENANT_ID) {
  //     let activeTenant = _.findIndex(TENANT_LIST, {
  //       external_id: TENANT_ID,
  //     });
  //     setTenant(TENANT_LIST[activeTenant]);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [TENANT_ID]);

  const { couponClear }  = useContext(CouponContext);
  const {
    data: coupons,
    loading: loadingCoupons,
    refetch: refetchCoupons
  } = useIndexCoupons({
    filter: {
      AND: [
        {
          column: "START_AT",
          operator: "BETWEEN",
          value: [
            moment()
              .startOf("month")
              .format("YYYY-MM-DD 00:00:00"),
            moment()
              .startOf("month")
              .format("YYYY-MM-DD 23:59:59")
          ]
        },
          {
            column: "END_AT",
            operator: "BETWEEN",
            value: [
              moment()
                .endOf("month")
                .format("YYYY-MM-DD 00:00:00"),
              moment()
                .endOf("month")
                .format("YYYY-MM-DD 23:59:59")
            ]
          }
      ]
    }
  });

  const handleLoadData = async ({ filter, params }) => {
    console.log('params', params )
    setLoading(true);
    let variablesToQuery = {
      first: params?.first ? Number(params?.first) : 10,
      page: params?.page ? Number(params?.page) : 1
    };


    console.log('variablesToQuery', variablesToQuery )
    if (filter) {
      let FilterAND = [];
      console.log('filterfilter',filter)

      // CUPOM VIGENTE
      if (filter?.start_at) {
        FilterAND.push({
          column: "START_AT",
          operator: "GTE",
          value:
            moment(filter?.start_at.from).format("YYYY-MM-DD 00:00:00"),
            //moment().endOf("year")
            //moment(filter?.end_at.from).format("YYYY-MM-DD 23:59:59"),

        });
      }

        // CUPOM VIGENTE
        if (filter?.end_at) {
          FilterAND.push({
            column: "END_AT",
            operator: "LTE",
          value:
            //moment(filter?.start_at.from).format("YYYY-MM-DD 23:59:59"),
            moment(filter?.end_at.from).format("YYYY-MM-DD 23:59:59"),
            //moment().endOf("month")

          });
        }

      // CUPOM VIGENTE
      if (filter?.expired_at) {
        FilterAND.push({
          column: "EXPIRED_AT",
          operator: "BETWEEN",
          value: [
            moment(filter?.expired_at.from).format("YYYY-MM-DD 00:00:00"),
            moment(filter?.expired_at.to).format("YYYY-MM-DD 23:59:59"),
          ],
        });
      }

      // CUPOM STATUS
      if (filter?.status && filter?.status.length) {
        let filterStattus  =  filter?.status.map(status => status.value);
        FilterAND.push({
          column: "STATUS",
          operator: "IN",
          value: filterStattus,
        });
      }

      // CUPOM SEARCH
      if (stateFilter?.searchText) {
        FilterAND.push({
          column: "CODE",
          operator: "LIKE",
          value: `%${stateFilter?.searchText}%`,
        });
      }

      // COUPON TYPE VALUE
      if (
        filter?.type_value &&
        filter?.type_value.value !== "" &&
        filter?.type_value.value !== "all"
      ) {
        FilterAND.push({
          column: "TYPE_VALUE",
          operator: "EQ",
          value: filter?.type_value.value,
        });
      }

      // CUPOM RECIPIENT
      if (
        filter?.recipient &&
        filter?.recipient.value !== "" &&
        filter?.recipient.value !== "all"
      ) {
        FilterAND.push({
          column: "RECIPIENT",
          operator: "EQ",
          value: filter?.recipient.value,
        });
      }
      // CUPOM CHANNEL
      if (
        filter?.channel
      ) {
        FilterAND.push({
          column: "CHANNEL",
          operator: "EQ",
          value: filter?.channel?.value,
        });
      }

      variablesToQuery = {
        ...variablesToQuery,
        filter: {
          AND: FilterAND
        },
      };
    }
    // console.log("variables TO Query: ", variablesToQuery?.filter);


    await refetchCoupons(variablesToQuery);
    setLoading(false);
  };

  // useEffect(() => {
  //     handleLoadData(filterSchema, null)
  // }, [filterSchema]);


  return (
    <>
      <Filter
        config={{
          title: "Promoções",
          searchPlaceholder: "Código do cupom",
          filterSchema: filterSchema,
          action: handleLoadData,
          otherActions:
            <Button primary onClick={() => {
              couponClear();
              history.replace({
                pathname: `/shop/cupom`
              });
            }} style={{ marginLeft: 15, marginRight: 10 }}>
              Novo
            </Button>
        }}
        style={screen !== "" ? { display: "none" } : {}}
      >
        <Layout
          results={indicators?.couponIndicators}
          coupons={coupons?.coupons?.data}
          ordersPending={coupons?.coupons?.data}
          paginatorInfo={coupons?.coupons?.paginatorInfo}
          loading={loadingCoupons}
          screen={screen}
          setScreen={setScreen}
          handleLoadData={handleLoadData}
        />
      </Filter>
    </>
  );
};
