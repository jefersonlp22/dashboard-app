import React, {useCallback, useEffect, useState} from "react";
import styled from 'styled-components';
import {
  InputText
}  from '../../../components';
import List from "./List";

import {
  Row,
  Line,
  Icons,
  Breadcrumbs,
  Loader
} from "../../../components";

import "./styles.scss";

const ContainerSearch = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  .searchable__input{
    width: 70%
  }

  .counter_totals{
    width: 30%
  }
`;

const ExpertOrdersList = ({
  setScreen,
  usages,
  recipientType,
  loading
}) => {

  const [searchedResult, setResults] = useState(()=> usages || []);

  const handleFilter = useCallback((value)=>{

    let results = usages.filter(i => {
      if (i?.name) {
        const upperValue = value.toUpperCase();
        const upperName = `${i.name.toUpperCase()}`;
        const upperEmail = `${i.email.toUpperCase()}`;
        return upperName.indexOf(upperValue) > -1 || upperEmail.indexOf(upperValue) > -1;
      }
    });

    setResults(results);

  },[]);

  useEffect(()=>{
    const serialize = usages.map(i => {
      let current = i?.user || i?.customer;
      return {
        name: current?.name,
        email: current?.email,
        used_times: i?.used_times,
        updated_at: i?.updated_at,
        avaible: i?.avaible,
        lover: current?.lover || null
      };
    });
    setResults(serialize);
  },[usages]);

  return (
    <>
      <div className="expertOrderList">
        <Breadcrumbs
          itens={["Shop", "Cupons", "Criar novo", "Utilizações do cupom"]}
        />

        <div className="expertOrderList--board">
          <div className="expertOrderList--returnWrapper">
            <div
              className="expertOrderList--iconBack"
              onClick={() => setScreen("detail")}
            >
              <Icons.back />
            </div>
          </div>
          <div>
            <h1 className="expertOrderList--title">Beneficiários do cupom</h1>
            <Line />
            <Line />

            <ContainerSearch>
              <div className="searchable__input">
                <InputText
                  required
                  text="Filtrar por nome ou email"
                  onChange={(e)=> handleFilter(e.currentTarget.value)}
                />
              </div>

            </ContainerSearch>

            <Row>
              <div className="cardStep__content" style={{fontSize:18, marginBottom: 10}}>
                <div>Total de beneficiários: {usages?.length || 0}</div>
              </div>
            </Row>

            <Row>
              {loading ? (
                <Loader
                  active={loading}
                  color="#b2b2b3"
                  className="cardIndicator--loader"
                />
              ) : (
                <List data={searchedResult} recipientType={recipientType} />
              )}
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpertOrdersList;
