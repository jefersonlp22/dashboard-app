import React, { useState, useEffect, useContext } from "react";
import {
  VoidTemplate,
  RadioButton,
  Row,
  Icons,
  Alert,
  AlertButton,
} from "../../../components";
import { Manager, Reference, Popper } from "react-popper";
import { Table } from "../../../components/Table";
import { SessionContext } from "../../../contexts/Session.ctx";
import { FilterContext } from "../../../components/FilterNew";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import _ from "lodash";

const StatusPoperMenu = ({ children, handleStatus }) => {
  const [isOpen, toggleOpen] = useState(false);

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <div ref={ref} onClick={() => toggleOpen(!isOpen)}>
            {children}
          </div>
        )}
      </Reference>
      {isOpen ? (
        <Popper placement="bottom">
          {({ ref, style, placement }) => (
            <div
              ref={ref}
              style={style}
              data-placement={placement}
              className={`statusMenu--popover`}
            >
              <div className="df fdr alic jc-sb statusMenu--item-title">
                <div>Alterar status</div>
                <Icons.closeSmall
                  fill="currentColor"
                  onClick={() => toggleOpen(false)}
                />
              </div>
              <div className="statusMenu--separator"></div>
              <div
                className="df fdr alic jc-sb statusMenu--item-option"
                onClick={() => handleStatus("unrescue")}
              >
                <div>Em aberto</div>
                <Icons.next fill="currentColor" />
              </div>
              <div className="statusMenu--separator"></div>
              <div
                className="df fdr alic jc-sb statusMenu--item-option"
                onClick={() => handleStatus("rescue")}
              >
                <div>Concluído</div>
                <Icons.next fill="currentColor" />
              </div>
              <div className="statusMenu--arrow"></div>
            </div>
          )}
        </Popper>
      ) : null}
    </Manager>
  );
};

const List = (props) => {
  const { Session } = useContext(SessionContext);
  const { filter } = useContext(FilterContext);

  const history = useHistory();
  const [commissions, setCommissions] = useState([]);
  const [splitPayment, setSplitPayment] = useState(false);

  const [alert, setAlert] = useState({
    status: false,
    message: "false",
    type: "default",
  });

  const typeAction = {
    rescue: async (data) => {
      await props.bonusRecuedList({
        variables: {
          data,
        },
      });
    },
    unrescue: async (data) => {
      await props.bonusUnRescueList({
        variables: {
          data,
        },
      });
    },
  };

  const navTo = (item) => {
    history.push({
      pathname: `/movimentacoes/bonificacao/${item.external_id}`,
      params: {
        id: item.external_id,
        filter: filter,
      },
    });
  };

  function formatRow(item) {
    let converted = {
      user: item?.user?.name,
      code: "Pedido #" + item?.order?.code,
      network: item?.network_bonus_formatted,
      value: "R$ " + item?.total_formatted,
      installments: item?.installments,
      status: item?.fully_rescued_at ? "Resgate efetuado" : "Em aberto",
    };
    let row = Object.entries(converted).map(([name, value], index) => (
      <Table.td
        key={`col-${name}-${index}`}
        className={`${
          name === "user" && splitPayment ? "clearPaddingUserCell" : ""
        }`}
        name={name}
        onClick={() => navTo(item)}
      >
        {value}
      </Table.td>
    ));

    return row;
  }

  const clearComission = () => {
    setCommissions([]);
  };

  const toggleAllComission = () => {
    let update = [];
    // if (commissions.length !== 10) {      
      update = props.data
        // .slice(0, props.data.length > 10 ? 10 : props.data.length)
        .map((item) => item.external_id);
    // }    
    setCommissions([...update]);
  };

  const toggleSingleComission = (value) => {
    if (!commissions.includes(value)) {
      if(commissions.length < 10){
        setCommissions([...commissions, value]);
      }
    } else {
      let indexToValue = commissions.indexOf(value);
      commissions.splice(indexToValue, 1);
      setCommissions([...commissions]);
    }
  };

  async function updateReload(status){
    // const n = 5;

    // if (commissions.length === 10) {

    //   const result = new Array(Math.ceil(commissions.length / n))
    //     .fill()
    //     .map((_) => commissions.splice(0, n));

    //   for (let bonus of result) {
    //     let serializeComissions = bonus.map((item) => ({ id: item }));
    //     await typeAction[status](serializeComissions);
    //   }
      
    // } else {
      
      let serializeComissions = commissions.map((item) => ({ id: item }));
      await typeAction[status](serializeComissions);

    // }

    console.log('acabou tudo, vamos buscar os novos')
    props.handleLoadComissions({
      filter: filter,
      params: {
        first: 10,
        page: 1,
      },
    });
  }

  const handleStatus = (status) => {
    Swal.fire({
      title: "Confirmar alterações?",
      text: `Você está alterando o status de ${commissions.length} ${
        commissions.length === 1 ? `bonificação` : `bonificações`
      }`,
      icon: "question",
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#0489cc",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#086899",
      showCancelButton: true,
      showCloseButton: true,
      customClass: {
        title: "statusMenu--alertTitle",
      },
    }).then((result) => {
      if (result.value && props?.bonusRecuedList) {
        props.setLoading(true);
        updateReload(status);
      }
    });
  };

  useEffect(() => {
    if (props.resultBonusRescued || props.resultUnRescued) {
      setAlert({
        status: true,
        message: "Status atualizado com sucesso!",
        type: "success",
      });
      setCommissions([]);
    }
    // eslint-disable-next-line
  },[props.resultBonusRescued, props.resultUnRescued]);

  useEffect(() => {
    if (Session) {
      let cloned = _.cloneDeep(Session?.tenant?.current?.data?.bonus);
      setSplitPayment(cloned?.split_payment !== 1);
    }
    // eslint-disable-next-line
  },[Session]);

  return (
    <>
      <Alert show={alert.status} type={alert.type}>
        <div>{alert.message}</div>
        <div>
          <AlertButton
            onClick={() =>
              setAlert({
                ...alert,
                status: false,
              })
            }
          >
            Fechar
          </AlertButton>
        </div>
      </Alert>
      <Row
        className={`selectedCommissionRow ${
          commissions.length ? "open" : "close"
        }`}
      >
        {commissions.length ? (
          <>
            <div className="df fdr alic">
              <Icons.closeSmall
                fill="#FFF"
                onClick={() => clearComission()}
                style={{ marginRight: 10 }}
              />
              <div>
                {commissions.length}{" "}
                {commissions.length === 1
                  ? `bonificação selecionada`
                  : `bonificações selecionadas`}
                {/* {commissions.length === 10 && <div>Ops! Limite de 10 bonificações para atualização por vez.</div>}  */}
              </div>

            </div>
            <StatusPoperMenu handleStatus={handleStatus}>
              <div className="buttonUpdateStatus">Alterar status</div>
            </StatusPoperMenu>
          </>
        ) : null}
      </Row>

      <Row>
        <Table
          headers={splitPayment ?
            [
              {
                text:
                  <RadioButton
                    value="simple"
                    type="checkbox"
                    checked={commissions.length === props.data.length}
                    onChoose={() => toggleAllComission()}
                    classes="comissionTable--checkbox"
                  />,
                className: "comissionTable--radioth "
              },
              { text: "Bonificado", className: "clearPaddingUserCell" },
              "Origem", "Bonificação", "Valor da bonificação", "Parcelas", "Status", ""
            ]: [ "Bonificado", "Origem", "Bonificação", "Valor da bonificação", "Parcelas", "Status", "" ]
          }
          voidtemplate={
            <VoidTemplate
              message={
                <VoidTemplate.default
                  message={
                    <>
                      Nenhum pedido foi
                      <br /> feito ainda.
                    </>
                  }
                />
              }
            />
          }
        >
          {props.data
            ? props.data.map((item, rowIndex) => (
                <Table.tr
                  key={`row${rowIndex}`}
                >
                  {splitPayment ? (
                    <Table.td className="comissionTable--radioth"  >
                      <RadioButton
                        type="checkbox"
                        checked={commissions.indexOf(item.external_id) >= 0}
                        value={item.external_id}
                        onChoose={(e) => {
                          toggleSingleComission(e.target.value);
                        }}
                        classes="comissionTable--checkbox"
                      />
                    </Table.td>
                  ) : null}

                  {formatRow(item)}

                  <Table.td onClick={() => navTo(item)}>
                    <div className="table__arrow">
                      <Icons.next fill="#4d4d4d" />
                    </div>
                  </Table.td>
                </Table.tr>
              ))
            : null}
        </Table>
      </Row>
    </>
  );
};

export default List;
