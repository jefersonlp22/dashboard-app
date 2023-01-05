import React, { useEffect, useState } from "react";
import Tabs from "../../../Layouts/Tabs";
import { Filter, Table, VoidTemplate } from "../../../components";
// import { useHistory } from "react-router-dom";
import Layout from "../Layout";

import { useUserSegments } from '../../../gqlEndpoints/queries';

import moment from 'moment';

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

function formatRow(item) {
  let converted = {
    name: item.name,
    total_users: item.total_users,
    total_users_updated_at: moment(item.total_users_updated_at).format('DD/MM/YYYY')
  };
  let row = Object.entries(converted).map(([name, value], index) => (
    <Table.td key={`col-${name}-${index}`} name={name} style={index > 0 ? { textAlign: "center" } : {}}>
      {value}
    </Table.td>
  ));

  return row;
}

export default function Groups() {
  // const history = useHistory();
  const { loadUserSegments, userSegmentsResult } = useUserSegments();
  const [, setFilter] = useState("");
  const [loading,] = useState(false);

  const [groups, setGroups] = useState([]);

  const [filterSchema] = useState({
    responsible: {
      label: "Responsável",
      type: "checkbox",
      values: [
        {
          label: "Fulano",
          value: "fulano"
        },
        {
          label: "Cicrano",
          value: "cicrano"
        },
        {
          label: "Beltrano",
          value: "beltrano"
        }
      ]
    }
  });

  // const handleNewGroup = () => {
  //   history.push({ pathname: `/people/lovers/novo-grupo` });
  // };

  useEffect(() => {
    setGroups(userSegmentsResult);
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [userSegmentsResult]);

  useEffect(() => {
    loadUserSegments(10);
  // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Tabs items={items} />
      <Layout>
        <Filter
          date="none"
          title="Grupos"
          enabled={false}
          setFilter={setFilter}
          filterSchema={filterSchema}
          searchPlaceholder="Nome"

        />
        <div style={loading ? { display: "none" } : null}>
          <Table
            headers={[
              "Título",
              <div style={{ textAlign: "center" }}>Total de usuários</div>,
              <div style={{ textAlign: "center" }}>Última atualização</div>,
            ]}
            voidtemplate={
              <VoidTemplate
                message={
                  <VoidTemplate.default
                    message={
                      <>
                        Você ainda não possui
                        <br /> grupos definidos.
                      </>
                    }
                  />
                }
              />
            }
          >
            {groups && groups.length
              ? groups.map((item, rowIndex) => (
                <Table.tr key={`row${rowIndex}`}>{formatRow(item)}</Table.tr>
              ))
              : null}
          </Table>
        </div>
      </Layout>
    </div>
  );
}
