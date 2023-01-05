import React from "react";
import "./styles.scss";
import BackIcon from "../../../assets/svg/icon-back.svg";
import { useHistory, useRouteMatch } from "react-router-dom";
import moment from 'moment';
import { useShowBonus } from '../../../hooks-api/useBonification';
import { Row, BlankCard, Loader, Breadcrumbs, IconsSidebar } from "../../../components";

const CommissionDetail = () => {
  let match = useRouteMatch("/movimentacoes/bonificacao/:id");
  const { data, loading } = useShowBonus({ id: match.params.id });
  const history = useHistory();

  return loading ? (
    <Loader active={loading} />
  ) : (
    <div className="commissionDetail">
      <Breadcrumbs itens={["Movimentações", "Bonificação", "Bonificação"]} />

      <Row className="commissionDetail--board">
        <div className="commissionDetail--returnWrapper">
          <div
            className="commissionDetail--iconBack"
            onClick={() => history.replace({ pathname: "/movimentacoes/bonificacao", params: { filter: history?.location?.params?.filter || null } })}
          >
            <img src={BackIcon} alt="Icone Retorno" />
          </div>
        </div>
        <Row className="fdc">
          <h1 className="commissionDetail--title">
            Bonificação #{data?.bonusId?.order?.code}<br/>
            Lover {data?.bonusId?.user?.name}
          </h1>
          <h4 className={`commissionDetail--status ${data?.bonusId?.fully_rescued_at ? "rescued" : "unrescued"} `}>
            Status: {data?.bonusId?.fully_rescued_at ? "Resgate efetuado" : "Em aberto"}
          </h4>
        </Row>

        <Row className="fdc">
          <BlankCard className="commissionDetail--info df fdc">
              <span className="commissionDetail--info__title">Bonificação total</span>
              <span className="commissionDetail--info__value">Valor: R$ {data?.bonusId?.total_formatted}</span>
              <span className="commissionDetail--info__title">Percentual {data?.bonusId?.network_bonus_formatted}</span>
          </BlankCard>
        </Row>

        <Row className="fdc">
          <span className="commissionDetail--subtitle">Parcelas</span>

          {data?.bonusId?.bonus_installments.map((item, index)=>(
            <BlankCard key={`cardInstallment${index}`} className="commissionDetail--comissions df fdc">
              <div className="df fdr alic">
                <span className={`commissionDetail--comissions__percent ${item?.rescued_at ? 'actived' : ''}`}></span>
                <span className="commissionDetail--comissions__ambassador">{item?.description}</span>
              </div>
              {item?.available_at ?
                <span className="commissionDetail--comissions__value">Disponível em: {moment(item.available_at).format('DD/MM/YYYY')}</span>
                : null}
              {item?.rescued_at ?
                <span className="commissionDetail--comissions__value">Regastado em: {moment(item.rescued_at).format('DD/MM/YYYY')}</span>
              : null}
              <span className="commissionDetail--comissions__value">Comissão: R$ {item?.value_formatted}</span>
            </BlankCard>
          ))}


          {/* <BlankCard className="commissionDetail--comissions df fdc">
              <div className="df fdr alic">
                <span className="commissionDetail--comissions__percent">6%</span>
                <span className="commissionDetail--comissions__ambassador">Embaixador Otávio Morais</span>
              </div>
              <span className="commissionDetail--comissions__value">Comissão 6%: R$ 28,78</span>
          </BlankCard> */}
        </Row>

        <Row className="fdc">
          <span className="commissionDetail--subtitle">Pedido</span>
          <BlankCard className="commissionDetail--order df fdc"
            onClick={() => {
              history.push({
                pathname: `/pedidos/${data?.bonusId?.order?.external_id}`,
                params:{
                  backTo: '/movimentacoes/bonificacao/'+data?.bonusId?.external_id
                }
              });
            }}>
              <div className="commissionDetail--order__header df fdr alic jc-sb">
                <div className="df fdr alic">
                  <IconsSidebar.order fill="#048dcc"/>
                  <span className="commissionDetail--order__header--client">#{data?.bonusId?.order?.code}</span>
                </div>
                <div className="df fdr alic">
                  <IconsSidebar.arrow_next fill="#4d4d4d"/>
                </div>
              </div>
              <div className="commissionDetail--order__content">
                {data?.bonusId?.order?.paid_at ?
                  <div>Data de pagamento: {moment(data.bonusId.order.paid_at).format('DD/MM/YYYY hh:mm')}</div>
                : null }
                <div>Total: R$ {data?.bonusId?.order?.total_formatted || ' -- '}</div>
              </div>
          </BlankCard>

          {data?.bonusId?.fully_rescued_at ? 
            <div className="commissionDetail--order__content"> 
              Baixa realizada pelo usuário {data?.bonusId?.latest_audit?.user?.name || ''}  no dia {moment(data?.bonusId?.fully_rescued_at).format('DD/MM/YYYY')} às {moment(data?.bonusId?.fully_rescued_at).format('HH:mm')}.              
            </div>
          : null}
          
        </Row>

      </Row>
      </div>
  );
};

export default CommissionDetail;
