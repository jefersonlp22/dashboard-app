import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import _ from 'lodash';
import {
  RadioButton,
  SimpleTag,
  Icons
} from '../../../../components';

import { useGetStateList } from "../../../../hooks-api/useLocals";

import { Container, ContainerTitle, ContainerOption, TagCloud } from './styles';

const States = ({ setCouponMechanics, locations, published }) => {
  const { data, loading } = useGetStateList();

  const [type, setType] = useState(Array.isArray(locations) ? locations.length > 0 ? 'STATE_LIST' : 'ALL' : 'ALL');
  const [selectedItems, setSelectedItems] = useState(locations || []);
  const [stateOptions, setStateOptions] = useState([]);

  const handleSelect = (value) => {
    setType(value);
    setSelectedItems([]);
    if(value === "ALL"){
      setCouponMechanics('locations', 'ALL');
    }
  }

  const handleChange = (value, action) => {
    if (_.indexOf(selectedItems, value?.value?.uf_sigla) < 0) {
      const newLocations = [...selectedItems, value?.value?.uf_sigla];

      setSelectedItems(newLocations);
      setCouponMechanics('locations', type === "STATE_LIST" ? newLocations : 'ALL');
    }
  };

  useEffect(() => {
    if (data?.stateList) {
      let stateValues = data.stateList.map(state => ({
        label: `${state?.uf_nome} - ${state?.uf_sigla}`,
        value: state
      }));
      setStateOptions(stateValues)
    }
  }, [data]);

  return (
    <Container>
      <div className="containerColumn">
        <ContainerTitle>Praça de aplicação (entrega)</ContainerTitle>
        <br />
        <ContainerOption>
          <RadioButton
            type="radio"
            disabled={published}
            checked={type === 'ALL'}
            value='ALL'
            onChoose={(e) => handleSelect(e.currentTarget.value)}
            classes="comissionTable--checkbox"
          />
          <span className="cardStep__content">Todo o Brasil</span>
        </ContainerOption>

        <ContainerOption>
          <RadioButton
            type="radio"
            disabled={published}
            checked={type === 'STATE_LIST'}
            value='STATE_LIST'
            onChoose={(e) => handleSelect(e.currentTarget.value)}
            classes="comissionTable--checkbox"
          />
          <span className="cardStep__content">Escolher estados</span>
        </ContainerOption>
      </div>

      <div className="containerColumn">
        <ContainerTitle>Seleção dos estados</ContainerTitle>
        <br />

        <div className="asyncSelectContainer">
          <Select
            isDisabled={type === 'ALL' || published}
            value={{
              value: true,
              label: "Buscar estados"
            }}
            placeholder="Buscar estados"
            isLoading={loading}
            options={stateOptions}
            loadingMessage={() => "Pesquisando..."}
            isSearchable={true}
            onChange={(value, action) => handleChange(value, action)}
          />
        </div>

        <TagCloud isDisabled={type === 'ALL'}>
          {selectedItems !== 'ALL' &&
            selectedItems.map((item, index) => {
              return (
                <SimpleTag
                  key={`keyTagState${index}`}
                  color="#b2b2b3"
                  icon={ !published &&
                    <Icons.closeSmall
                      fill="#FFF"
                      onClick={() => {
                        selectedItems.splice(_.indexOf(selectedItems, item), 1);
                        setSelectedItems([...selectedItems]);
                      }}
                    />
                  }
                >
                  <span className="small">{item}</span>
                </SimpleTag>
              )
          })}
        </TagCloud>
      </div>
    </Container>
  );
};

export default States;

