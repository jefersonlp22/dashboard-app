import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  VoidTemplate,
  Icons,
  Loader,
  Line,
  Switch,
  Paginator
} from "../../../components";
import "./style.scss";
import moment from "moment";
import { useHistory, NavLink } from "react-router-dom";
import { SessionContext } from "../../../contexts/Session.ctx";
import { useUpdateSettings } from "../../../hooks-api/useTenant";
import { useIndexFreight, useDeleteFreight } from "../../../hooks-api/useFreight";

import Swal from "sweetalert2";
import IconInfo from "./Icons/info";

function Freight({...props}) {
  const history = useHistory();
  const [getFreights, { data: freights, loading }] = useIndexFreight({});
  const [deleteFreight, { loading: loadingDeleted }] = useDeleteFreight();
  const [freightStatus, setFreightStatus] = useState(false);
  const { Session, updateCurrentProperty } = useContext(SessionContext);
  const [updatedSetting] = useUpdateSettings({ data: "freight_methods" });

  const [paginatorInfo, setPaginatorInfo] = useState(null);
  const [paginatorValues, setPaginatorValue] = useState(false);

  const swalDefaultOptions = {
    text: "Tem certeza que deseja excluir esse frete?",
    icon: "question",
    confirmButtonText: "Sim",
    confirmButtonColor: "#0489cc",
    cancelButtonText: "Não",
    cancelButtonColor: "#086899",
    showCancelButton: true,
    showCloseButton: true,
  };

  async function getData(){
    let first = paginatorValues?.first || 10;
    let page = paginatorValues?.page || 1;
    await getFreights({
      variables:{
        first,
        page
      }
    });
  }

  const handleSaveStatusFreight = async (status) => {
    try {
      let result = await updatedSetting({
        variables: {
          freight_methods: status,
        },
      });
      if (result) {
        updateCurrentProperty({
          property: "freight_methods",
          value: result.data.settings.freight_methods,
          data: true,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (item) => {
    let result = await Swal.fire(swalDefaultOptions);
    if (result.value) {
      await deleteFreight({
        variables: {
          external_id: item
        }
      });
      getData();
    }
  };

  useEffect(() => {
    if (Session) {
      setFreightStatus(Session?.tenant?.current?.data?.freight_methods);
    }
    // eslint-disable-next-line
  }, [Session]);

  useEffect(() => {
    if(!loading && freights?.allShipments?.paginatorInfo ){
      setPaginatorInfo(freights?.allShipments?.paginatorInfo);
    }
  },[freights]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginatorValues]);

  return (
    <>
      <div className="freightTypes">
        <div className="df fdr jc-sb">
          <div className="df fdr alic">
            <h1>Frete</h1>
            <div style={{ marginLeft: 30 }}>
              <Switch
                label="Status"
                isOn={freightStatus}
                switchLabelClassName="freightTypes--status-switch"
                handleToggle={(e, multipleKey) => {
                  setFreightStatus(!freightStatus);
                  handleSaveStatusFreight(!freightStatus);
                }}
              />
            </div>
            <div style={{ marginLeft: 15 }}>
              <IconInfo>
                Ativa e desativa os métodos de frete de sua marca.
              </IconInfo>
            </div>
          </div>
          <div style={{ marginLeft: 15 }}>
            <div className="button primary" onClick={() => history.replace({pathname: `/configs/frete/novo`})}>
              Novo
            </div>
          </div>
        </div>
        <Line />
        {loading || loadingDeleted ? (
          <Loader active={true } />
        ) : freights?.allShipments?.data.length ? (
          <Table
            headers={["Nome", "Criação", "Última alteração", "Status", ""]}
          >
            {freights.allShipments.data.map((item, index) => (
              <Table.tr key={`pl-${index}`}>
                <Table.td>{item.name}</Table.td>
                <Table.td>
                  {moment(item.created_at).format("DD/MM/YYYY HH:mm")}
                </Table.td>
                <Table.td>{item.user.name}</Table.td>
                <Table.td>
                  <div className="df fdr alic">
                    <div
                      className={`circleStatusFreight alignCenter ${
                        item.active ? "active" : "inactive"
                      }`}
                    ></div>
                    <div>{item.active ? "Ativo" : "Inativo"}</div>
                  </div>
                </Table.td>

                <Table.td className="action__column">
                  <div className="df fdr alic">
                    <NavLink to={`/configs/frete/${item.external_id}`}>
                      <Icons.pencil fill="#0489cc" />
                    </NavLink>
                    <div style={{ width: 10 }}></div>
                    <Icons.delete
                      fill="#c8c7cc"
                      onClick={() => {
                        handleDelete(item.external_id);
                      }}
                    />
                  </div>
                </Table.td>
              </Table.tr>
            ))}
          </Table>
        ) : (
          <VoidTemplate
            message={
              <VoidTemplate.default
                message={
                  <>
                    Você ainda não tem
                    <br /> nenhuma regra de frete cadastrado...
                  </>
                }
                onClick={() => history.replace({pathname: `/configs/frete/novo`})}
                buttonText="Cadastrar"
              />
            }
          />
        )}

      {paginatorInfo &&
        <Paginator
          data={paginatorInfo}
          onChange={setPaginatorValue}
        />
        }
      </div>
    </>
  );
}

export { Freight };
