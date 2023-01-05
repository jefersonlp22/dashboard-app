import React, { useState, useMemo, useEffect } from "react";

import {
  VoidTemplate,
  Loader,
  Table,
  Button,
  Modal,
  InputText,
  Filter,
  Paginator,
  Alert,
  AlertButton,
  Icons
} from "../../components";

import Tabs from "../../Layouts/Tabs";

import { useIndications } from "../../gqlEndpoints/queries";
import { useMutationIndication } from "../../gqlEndpoints/mutations";

import Layout from "./Layout";

// import Swal from "sweetalert2";
// const swalStyled = Swal.mixin({
//   customClass: {
//     confirmButton: "btn btn-success"
//   },
//   buttonsStyling: true
// });

const Indications = ({ className }) => {
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [indicationSelected, setIndicationSelected] = useState({});
  const [reason, setReason] = useState("");
  const [actionIndication, setActionIndication] = useState("");
  const { indications, getIndications, paginatorInfo, loading: indicationsLoading } = useIndications();
  const [filter, setFilter] = useState("");
  const [paginatorValues, setPaginatorValue] = useState(false);
  const {
    resultIndication,
    error,
    approveIndication,
    disapproveIndication
  } = useMutationIndication();

  const indicationsPending = useMemo(() => {
    return indications.length ? indications.filter(
      indication => indication.status_formatted === "Aguardando análise"
    ): [];
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

  const [alert, setAlert] = useState({
    status: false,
    message: "false",
    type: "default"
  });

  useEffect(() => {
    if (indications) {
      setLoading(false);
    }
  }, [indications]);

  useEffect(() => {
    setLoading(true);
    let first = paginatorValues?.first || 10;
    let page = paginatorValues?.page || 1;
    let params = { first, page, search: "" };

    if (filter?.searchText !== "") {
      params.search = filter.searchText;
    }
    getIndications(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, paginatorValues]);


  useEffect(() => {
    if (error && error?.response?.errors.length > 0) {
      setLoading(false);
      let message = error?.response?.errors[0].message ||
      error?.response?.errors[0].message || 'Erro desconhecido';
      setAlert({
        status: true,
        message: message,
        type: "error"
      });
    } else {
      posIndications();
    }

    async function posIndications() {
      if (
        Object.entries(resultIndication).length !== 0 &&
        resultIndication.constructor === Object
      ) {
        getIndications({});
        setAlert({
          status: true,
          message:
            actionIndication === "approve"
              ? "Indicação aprovada!"
              : "Indicação reprovada!",
          type: "success"
        });
        setTimeout(() => {
          setLoading(false);
          setModalVisibility(false);
        }, 500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultIndication, error]);

  function formatRow(item) {
    // let level =
    //   item?.creator?.network?.level === "ambassador"
    //     ? "Embaixador"
    //     : item?.creator?.network?.level;
    let converted = {
      name: item.name,
      email: item.email,
      responsible: item.creator ? item.creator.name : "-",
      status: item.status_formatted,
      pending: <Icons.next fill="#4d4d4d" />
    };
    let row = Object.entries(converted).map(([name, value], index) => (
      <Table.td key={`col-${name}-${index}`} name={name}>
        {value}
      </Table.td>
    ));

    return row;
  }

  function approve(e, indicationSelected) {
    e.preventDefault();

    setLoading(true);
    setInvalid(true);
    setActionIndication("approve");
    approveIndication(indicationSelected.id);
    setInvalid(false);
  }

  function disaprove(e, indicationSelected) {
    e.preventDefault();

    setLoading(true);
    setInvalid(true);
    setActionIndication("disaprove");
    disapproveIndication(indicationSelected.id, reason);
    setInvalid(false);
  }

  const handleSelectedIndication = indication => {
    setModalVisibility(true);
    setReason("");
    setIndicationSelected(indication);
  };

  const items = [
    {
      url: "/people/convites",
      title: "Convites"
    },
    {
      url: "/people/indicacoes",
      title: "Indicações"
    }
  ];

  return (
    <>
      <Tabs items={items} />
      <Filter
          title="Indicações"
          setFilter={setFilter}
          filterSchema={filterSchema}
          searchPlaceholder="Nome ou email"
          dateFilter={false}
        />

      <Modal
        visible={modalVisibility}
        onClose={() => {
          setModalVisibility(false);
        }}
      >
        <form className="mTop20">
          <InputText
            text={
              <span>
                <span style={{ color: "red" }}>*</span> Nome
              </span>
            }
            disabled={true}
            name="name"
            type="text"
            required
            value={indicationSelected.name}
          />

          <InputText
            text={
              <span>
                <span style={{ color: "red" }}>*</span> E-mail
              </span>
            }
            name="email"
            disabled={true}
            type="email"
            required
            value={indicationSelected.email}
          />
          {indicationSelected?.phone ? (
            <InputText
              text={
                <span>
                Telefone
              </span>
              }
              name="phone"
              disabled={true}
              type="phone"
              required
              value={indicationSelected.phone}
            />
          ) : null}
          <InputText
            text={
              <span>
                Se reprovar, descreva o motivo
              </span>
            }
            name="reason"
            type="text"
            required
            onChange={e => setReason(e.target.value)}
            value={reason}
          />

          <br />
          <br />
          <div className="df fdr alic jc-sb width100 ">
            <Button
              onClick={e => approve(e, indicationSelected)}
              primary
              disabled={loading || invalid}
              loading={loading}
              className={"buttonApprove "}
            >
              Aprovar
            </Button>
            <Button
              onClick={e => disaprove(e, indicationSelected)}
              primary
              disabled={(loading || invalid) || reason === ""}
              loading={loading}              
              className={reason === "" ? "buttonDisable" : "buttonDisaprove"}
            >
              Reprovar
            </Button>
          </div>
        </form>
      </Modal>

      {/* finish modal */}

      <Layout>
        <Loader active={indicationsLoading} />
        <Alert show={alert.status} type={alert.type}>
          <div>{alert.message}</div>
          <div>
            <AlertButton
              onClick={() =>
                setAlert({
                  status: false,
                  message: null,
                  type: "error"
                })
              }
            >
              Fechar
            </AlertButton>
          </div>
        </Alert>
        <div style={indicationsLoading ? { display: "none" } : null}>
          <Table
            headers={[
              "Nome",
              "Email",
              "Indicado por",
              "Status",
              ""
            ]}
            voidtemplate={
              <VoidTemplate
                message={
                  <VoidTemplate.default
                    message={
                      filter?.searchText !== "" ?
                      <>
                        Nenhum resultado encontrado.
                      </>
                      :
                      <>
                        Você não
                        <br /> nenhuma indicação pentende.
                      </>
                    }
                  />
                }
              />
            }
          >
            {indicationsPending && indicationsPending.length
              ? indicationsPending.map((item, rowIndex) => (
                  <Table.tr
                    onClick={() => handleSelectedIndication(item)}
                    key={`row${rowIndex}`}
                  >
                    {formatRow(item)}
                  </Table.tr>
                ))
              : null}
          </Table>
        </div>
        <Paginator
          data={paginatorInfo}
          onChange={setPaginatorValue}
        />
      </Layout>
    </>
  );
};

export default Indications;
