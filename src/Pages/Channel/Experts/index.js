import React, { useEffect, useState, useMemo } from "react";
import Tabs from "../../../Layouts/Tabs";
import {
  Filter,
  Table,
  VoidTemplate,
  Loader,
  Paginator,
  Line,
  Row,
  CardIndicator,
  Icons,
} from "../../../components";
import { useHistory } from "react-router-dom";
import Layout from "../Layout";
import moment from "moment";
import { useChannel, useIndicators } from "../../../gqlEndpoints/queries";

import levels from "./levels";

const items = [
  {
    url: "/people/lovers",
    title: "Geral",
  },
  {
    url: "/people/lovers/grupos",
    title: "Grupos",
  },
];

export default function ExpertsIndex() {
  const history = useHistory();
  const {
    loadChannel,
    channel: channelResult,
    loading,
    paginatorInfo,
  } = useChannel();
  const { indicators, loadIndicators, loadingIndicators } = useIndicators({});
  const [filter, setFilter] = useState("");
  const [paginatorValues, setPaginatorValue] = useState(false);

  const percentActivity = useMemo(
    () =>
      (
        (indicators?.active_users?.quantity / indicators?.users?.quantity) *
        100
      ).toFixed(0),
    [indicators]
  );

  const totalUsers = useMemo(
    () => indicators?.trial_users?.quantity + indicators?.users?.quantity,
    [indicators]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const channel = useMemo(
    () =>
      channelResult
        ? channelResult.filter((item) => item?.user?.agreed_at)
        : [],
    [channelResult]
  );

  const [filterSchema] = useState({
    responsible: {
      label: "Responsável",
      type: "checkbox",
      values: [
        {
          label: "Fulano",
          value: "fulano",
        },
      ],
    },
  });

  useEffect(() => {
    let params = {
      from: moment().startOf("month").format("YYYY-MM-DD HH:mm:ss"),
      to: moment().endOf("month").format("YYYY-MM-DD HH:mm:ss"),
      first: filter?.searchText ? 20 : paginatorValues?.first || 10,
      page: filter?.searchText ? 1 : paginatorValues?.page,
    };

    if (filter?.startDate || filter?.endDate) {
      params.from = moment(filter.startDate)
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      params.to = moment(filter.endDate)
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
    }

    if (filter?.searchText !== "") {
      params.searchText = filter?.searchText;
    }

    loadChannel(params);
    console.log(' params',params);
    loadIndicators({ from: params.from, to: params.to });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginatorValues, filter]);

  // const handleNewGroup = () => {
  //   history.replace({ pathname: `/people/lovers/novo-grupo` });
  // };
  return (
    <div>
      <Tabs items={items} />
      <Layout>
        <Filter
          title="Seu canal"
          dateFilter={true}
          searchPlaceholder="Nome ou E-mail"
          setFilter={setFilter}
          filterSchema={filterSchema}
        />
        <Line />

        <Row>
          <CardIndicator
            loading={loadingIndicators}
            number={`${indicators?.users?.quantity || "0"}`}
            title="Lovers"
          />

          <CardIndicator
            loading={loadingIndicators}
            number={`${indicators?.active_users?.quantity || "0"}`}
            title="Ativos"
          />

          <CardIndicator
            loading={loadingIndicators}
            number={`${percentActivity > 0 ? percentActivity : "0"}%`}
            title="Percentual de atividade"
          />

          <CardIndicator
            loading={loadingIndicators}
            number={`${indicators?.inactive_users?.quantity || "0"}`}
            title="Inatívos"
          />
        </Row>

        <Line />
        <Row>
          <CardIndicator
            loading={loadingIndicators}
            number={`${indicators?.new_users?.quantity || "0"}`}
            title="Inícios"
          />

          <CardIndicator
            loading={loadingIndicators}
            number={`${indicators?.trial_users?.quantity || "0"}`}
            title="Trial"
          />

          <CardIndicator
            loading={loadingIndicators}
            number={`${totalUsers > 0 ? totalUsers : "0"}`}
            title="Lovers + Trial"
          />
        </Row>
        <Line />
        <div style={loading ? { display: "none" } : null}>
          <Table
            headers={["Nome", "E-mail", "Nível", "Responsável", ""]}
            voidtemplate={
              <VoidTemplate
                message={
                  <VoidTemplate.default
                    message={
                      <>
                        Você ainda não
                        <br /> possui lovers ativos.
                      </>
                    }
                  />
                }
              />
            }
          >
            {channel && channel.length
              ? channel.map((item, rowIndex) => (
                  <Table.tr
                    key={`row${rowIndex}`}
                    onClick={() => {
                      history.replace({
                        pathname: `/people/lovers/detalhes`,
                        state: { id: item.id },
                      });
                    }}
                  >
                    <Table.td>{item?.user?.name}</Table.td>
                    <Table.td>{item?.user?.email}</Table.td>
                    <Table.td>{levels[item.level]}</Table.td>
                    <Table.td>{item?.responsible?.user?.name}</Table.td>

                    <Table.td>
                      <div className="table__arrow">
                        <Icons.next fill="#4d4d4d" />
                      </div>
                    </Table.td>
                  </Table.tr>
                ))
              : null}
          </Table>
        </div>
        {loading ? <Loader active={loading} /> : null}
        {paginatorInfo && (
          <Paginator data={paginatorInfo} onChange={setPaginatorValue} />
        )}
      </Layout>
    </div>
  );
}
