import React, { useState, useEffect, useMemo } from "react";

import {
  VoidTemplate,
  Loader,
  Table,
  Button,
  GetCircleStatusInvite,
  Filter,
  Paginator,
  Icons
} from "../../components";
import Tabs from "../../Layouts/Tabs";

import {
  useInvites,
  useResponsibles,
  useIndications
} from "../../gqlEndpoints/queries";

import { useHistory } from "react-router-dom";
import Layout from "./Layout";

import levels from "./Experts/levels";

import ModalInvite from "./ModalInvite";

import Swal from "sweetalert2";
const swalStyled = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success"
  },
  buttonsStyling: true
});

const Invite = ({ className }) => {
  const history = useHistory();
  const { responsibles, loadResponsibles } = useResponsibles();
  const { invites, loadInvites, searched, paginatorInfo } = useInvites();
  const { indications, getIndications } = useIndications();
  const [modalVisibility, setModalVisibility] = useState(false);
  const [invite, setInvite] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [paginatorValues, setPaginatorValue] = useState(false);

  const indicationsPending = useMemo(() => {
    return indications.length
      ? indications.filter(
          indication => indication.status_formatted === "Aguardando análise"
        )
      : [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indications]);

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

  useEffect(() => {
    if ((invites, responsibles)) {
      setLoading(false);
    }
  }, [invites, responsibles]);

  useEffect(() => {
    setLoading(true);
    let first = paginatorValues?.first || 10;
    let page = paginatorValues?.page || 1;
    let params = { first, page, search: "" };

    if (filter?.searchText !== "") {
      params.search = filter.searchText;
    }

    loadResponsibles(2000);
    getIndications({});
    loadInvites(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, paginatorValues]);

  function formatRow(item) {
    let converted = {
      code: item.code,
      name: item.name,
      level: levels[item.level],
      email: item.email,
      responsible: item.responsibleUser ? item.responsibleUser.name : "-",
      status: (
        <GetCircleStatusInvite status_formatted={item.status_formatted} />
      ),
      pending: <Icons.next fill="#4d4d4d" />
    };
    let row = Object.entries(converted).map(([name, value], index) => (
      <Table.td key={`col-${name}-${index}`} name={name}>
        {value}
      </Table.td>
    ));

    return row;
  }

  const items = [
    {
      url: "/people/convites",
      title: "Convites"
    },
    {
      url: "/people/convites-landings",
      title: "Landing"
    },
    {
      url: "/people/indicacoes",
      title: "Indicações"
    }
  ];

  return (
    <>
      <ModalInvite
        responsibles={responsibles}
        invite={invite}
        toggle={modalVisibility}
        setToggle={setModalVisibility}
        setLoading={setLoading}
        onSaveEnd={() => loadInvites({ first: 10, page: 1, search: "" })}
      />
      <Tabs items={items} />

      <Layout>
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
          <div
            onClick={() =>
              history.replace({
                pathname: "/people/indicacoes",
                state: {
                  indications: indicationsPending,
                  fromTo: "invites"
                }
              })
            }
            className="fdr alic jc-sb width100 cursorPointer"
            style={{
              height: "50px",
              backgroundColor: "#ff6f6f",
              borderRadius: "5px",
              paddingLeft: "25px",
              paddingRight: "15px",
              marginBottom: "20px",
              color: "#fff",
              display: indicationsPending.length === 0 ? "none" : "flex"
            }}
          >
            <div>
              {indicationsPending.length > 1
                ? `Existem ${indicationsPending.length} indicações pendentes de
              análise!`
                : `Existe ${indicationsPending.length} indicação pendente de
              análise!`}
            </div>{" "}
            <div>{<Icons.next fill="#fff" />}</div>
          </div>
          <Table
            headers={[
              "Código",
              "Nome",
              "Nível",
              "Email",
              "Responsável",
              { text: "Status", className: "alignCenter" },
              ""
            ]}
            voidtemplate={
              <VoidTemplate
                message={
                  searched ? (
                    <>
                      Ops! Não encontramos
                      <br />
                      <br /> resultados para sua pesquisa
                    </>
                  ) : (
                    <VoidTemplate.default
                      message={
                        <>
                          Você ainda não
                          <br /> convidou ninguém.
                        </>
                      }
                      onClick={() => {
                        setModalVisibility(true);
                      }}
                      buttonText="Convidar"
                    />
                  )
                }
              />
            }
          >
            {invites && invites.length
              ? invites.map((item, rowIndex) => (
                  <Table.tr
                    onClick={() => {
                      if (item.status_formatted === "pending") {
                        // modalResendInvite(item);
                        setInvite(item);
                        setModalVisibility(true);
                      } else if (item.status_formatted === "trial") {
                        swalStyled.fire({
                          icon: "error",
                          title:
                            "Esse usuário já validou seu código mas ainda não finalizou seu cadastro completo no app.",
                          text: " ",
                          showConfirmButton: false,
                          showCloseButton: true
                        });
                      } else if (item.status_formatted === "completed") {
                        if (item?.user?.network?.id) {
                          history.replace({
                            pathname: "/people/lovers/detalhes",
                            state: {
                              id: item?.user?.network?.id,
                              fromTo: "invites"
                            }
                          });
                        }
                      }
                    }}
                    key={`row${rowIndex}`}
                  >
                    {formatRow(item)}
                  </Table.tr>
                ))
              : null}
          </Table>
        </div>
        {paginatorInfo && (
          <Paginator data={paginatorInfo} onChange={setPaginatorValue} />
        )}
      </Layout>
    </>
  );
};

export default Invite;
