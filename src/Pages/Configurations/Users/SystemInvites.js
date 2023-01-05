import React, { useState, useEffect } from "react";
import { useSystemInvites } from "../../../gqlEndpoints/queries";
import {
  GetCircleStatusInvite,
  VoidTemplate,
  Loader,
  Table,
  Button,
  Filter,
  Paginator
} from "../../../components";
import Tabs from "../../../Layouts/Tabs";
import ModalInvite from "./ModalInvite";

const items = [
  {
    url: "/configs/usuarios",
    title: "Usuários"
  },
  {
    url: "/configs/convites-do-sistema",
    title: "Convites"
  }
];

const userLevelLegend ={
  "admin": "Administrador",
  "owner": "Owner"
}

const SystemInvites = () => {
  const { systemInvites, loadSystemInvites, paginatorInfo } = useSystemInvites();
  const [loading, setLoading] = useState(false);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [invites, setInvites] = useState([]);
  const [invite, setInvite] = useState([]);
  const [filter, setFilter] = useState("");

  const [filterSchema] = useState({
    responsible: {
      label: "Responsável",
      type: "checkbox",
      values: [
        {
          label: "Exemplo",
          value: "exemplo"
        }
      ]
    }
  });

  const changePaginator = (first, page) => {
    loadSystemInvites({ first, page, search: "" });
  };

  function formatRow(item) {
    let converted = {
      code: item.code,
      name: item.name,
      level: userLevelLegend[item.level] || '--',
      email: item.email,
      status: (
        <GetCircleStatusInvite status_formatted={item.status_formatted} />
      ),
      pendeng: ">"
    };
    let row = Object.entries(converted).map(([name, value], index) => (
      <Table.td
        onClick={
          item.status_formatted === "pending"
            ? () => {
              setInvite(item);
              setModalVisibility(true);
            }
            : null
        }
        key={`col-${name}-${index}`}
        name={name}
      >
        {value}
      </Table.td>
    ));

    return row;
  }

  useEffect(() => {
    if (systemInvites) {
      setLoading(false);
      setInvites(systemInvites);
    }
  }, [systemInvites]);

  useEffect(() => {
    if (filter?.searchText !== "") {
      loadSystemInvites({ first: 5, page: 1, search: filter.searchText });
    } else {
      loadSystemInvites({ first: 5, page: 1, search: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);


  useEffect(() => {
    setLoading(true);
    loadSystemInvites({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ModalInvite
        invite={invite}
        toggle={modalVisibility}
        setToggle={setModalVisibility}
        setLoading={setLoading}
        onSaveEnd={() => loadSystemInvites({ first: 5, page: 1, search: "" })}
      />
      <Tabs items={items} />

      <Filter
        title="Convites"
        setFilter={setFilter}
        filterSchema={filterSchema}
        searchPlaceholder="Nome ou email"
        dateFilter={false}
        otherActions={
          <div style={{ marginLeft: 15 }}>
            <Button
              primary
              onClick={() => {
                setInvite(null);
                setModalVisibility(true);
              }}
            >
              Convidar
            </Button>
          </div>
        }
      />
      <Loader active={loading} />
      <div style={loading ? { display: "none" } : null}>
        <Table
          headers={[
            "Código",
            "Nome",
            "Nível",
            "Email",
            { text: "Status", className: "alignCenter" },
            ""
          ]}
          voidtemplate={
            <VoidTemplate
              message={
                <VoidTemplate.default
                  message={
                    <>
                      Sem convites enviados
                      <br /> por enquanto...
                    </>
                  }
                  onClick={() => {
                    setModalVisibility(true);
                  }}
                  buttonText="Convidar"
                />
              }
            />
          }
        >
          {invites && invites.length
            ? invites.map((item, rowIndex) => (
                <Table.tr key={`row${rowIndex}`}>{formatRow(item)}</Table.tr>
              ))
            : null}
        </Table>
      </div>
      <Paginator
        data={paginatorInfo}
        onChange={(first, page) => changePaginator(first, page)}
      />
    </>
  );
};

export { SystemInvites };
