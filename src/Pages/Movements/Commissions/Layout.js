import React, { useEffect, useState, useContext } from 'react';
import List from "./List";
import { useHistory } from "react-router-dom";
import { VoidTemplate, Loader, Paginator, Row, CardIndicator, Line } from "../../../components";
import { FilterContext } from "../../../components/FilterNew";

import "./styles.scss";

export default ({data, loading, setLoading, handleLoadComissions, bonusRecuedList, resultBonusRescued, indicators, loadingIndicators, ...props}) => {
  const history = useHistory();
  const { filter, setFilter } = useContext(FilterContext);

  const [paginatorValues, setPaginatorValue] = useState(false);  
 
    useEffect(() => {        

      handleLoadComissions({filter, params: {
        first: paginatorValues?.first || 10,
        page: paginatorValues?.page || 1,
      }});

      // eslint-disable-next-line
    }, [paginatorValues]);

    useEffect(()=>{
      if(history?.location?.params?.filter){
        setFilter(history.location.params.filter);
        handleLoadComissions({
          filter: history.location.params.filter, 
          params: {
            first: paginatorValues?.first || 10,
            page: paginatorValues?.page || 1,
          }
        });
      }
      // eslint-disable-next-line
    },[history]);
  

  return (
    <>
      {loading ? <Loader active={loading} /> : null}

      <div style={loading ? { display: 'none' } : {}}>

        <Row>
          <CardIndicator
            loading={loadingIndicators || loading}
            number={`R$ ${indicators?.bonusIndicator?.total_formatted || '0,00'}`}
            title="Total de bonificações"
          />

          <CardIndicator
            loading={loadingIndicators || loading}
            number={`R$ ${indicators?.bonusIndicator?.total_pending_formatted || '0,00'}`}
            title="Bonificações pendentes"
          />

          <CardIndicator
            loading={loadingIndicators || loading}
            number={`R$ ${indicators?.bonusIndicator?.total_rescued_formatted  || '0,00'}`}
            title="Bonificações pagas"
          />
        </Row>

        <Line />
        
        {data?.bonus?.data?.length ? (
          <List 
            data={data?.bonus?.data} 
            setLoading={setLoading}
            bonusRecuedList={bonusRecuedList} 
            resultBonusRescued={resultBonusRescued}
            handleLoadComissions={handleLoadComissions}
            bonusUnRescueList={props.bonusUnRescueList}
            resultUnRescued={props.resultUnRescued}
          />
        ) : (
          <VoidTemplate message="Nenhuma bonificação foi encontrada para o filtro selecionado" />
        )}
        
        <Paginator
          data={data?.bonus?.paginatorInfo}
          onChange={setPaginatorValue}
        />
      </div>
    </>
  );
};


