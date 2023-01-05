import React, { useState, useEffect, useCallback } from 'react';
import AsyncSelect from "react-select/async";
import _, { first } from 'lodash';
import {
  RadioButton,
  SimpleTag,
  Icons
} from '../../../../components';
import { useColections, useProducts } from "../../../../gqlEndpoints/queries";


import { useLazySearchProduct, useLazyProductsById } from "../../../../hooks-api/useProduct";
import {useLazyCollectionsById } from "../../../../hooks-api/useCollection";

import { Container, ContainerTitle, ContainerOption, TagCloud } from './styles';

const CoupomObjects = ({ setCouponMechanics, type, objects, handleType, published, isWine }) => {
  // const {
  //   handleQuery: searchProduct,
  //   data: dataProducts,
  //   loading: loadingProducts
  // } = useLazySearchProduct({});

  const {catalogCollections, collections} = useColections();
  const {loadCatalogProducts, products} = useProducts();


  // const {
  //   handleQuery: searchCollection,
  //   data: dataCollection,
  //   loading: loadingCollection
  // } = useLazySearchCollection({});

  const {
    handleQuery: getProductsById,
    data: dataProductsById,
    loading: loadingProductsById
  } = useLazyProductsById();

  const {
    handleQuery: getCollectionsById,
    data: dataCollectionsById,
    loading: loadingCollectionssById
  } = useLazyCollectionsById();


  const [selectData, setSelectData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);


  const loadOptions = async (inputValue, callback) => {
    let filtered = [];
    // if (type === 'ORDER_ITEM') {
    //   await searchProduct({ searchText: inputValue });
    //   if (dataProducts?.products?.data) {
    //     filtered = dataProducts?.products?.data.map(item => {
    //       return { value: item, label: item.name }
    //     })
    //   }
    // }

    if (type === 'ORDER_ITEM') {
      let result = await loadCatalogProducts({ first: 20, page: 1, searchText: inputValue });
      if (result) {
        filtered = result.map(item => {
          return { value: item, label: `${item?.code} - ${item.name}`}
        })
      }
    }

    // if (type === 'COLLECTION') {
    //   await searchCollection({ searchText: inputValue });
    //   if (dataCollection?.catalogCollections?.data) {
    //     console.log('dataCollection',dataCollection);
    //     filtered = dataCollection?.catalogCollections?.data.map(item => {
    //       return { value: item, label: item.name }
    //     })
    //   }
    // }

    if (type === 'COLLECTION') {
      let result = await catalogCollections({ first: 50, page: 1, searchText: inputValue })
      if (result) {
        filtered = result.map(item => {
          return { value: item, label: item.name }
        })
      }
    }

    //setSelectData(filtered);
    callback(filtered);
  };

  const handleSearch = (newValue, action) => {
    return newValue;
  };

  const handleChange = (value, action) => {
    if (_.indexOf(selectedItems, value?.value) < 0) {
      let obj = [...selectedItems, value?.value]
      setSelectedItems([...selectedItems, value?.value]);
      let references = obj.map(item => Number(item?.id));
      setCouponMechanics('object_type', type);
      setCouponMechanics('objects', [
        {
          type,
          references
        }
      ]);
    }
  };

  // useEffect(()=>{
  //   let references = selectedItems.map(item => Number(item?.id));
  //   setCouponMechanics('object_type', type);
  //   setCouponMechanics('object', [
  //     {
  //       type,
  //       references
  //     }
  //   ]);
  // },[selectedItems]);

  useEffect(()=>{
    console.log('stateMechanics?.objects',objects)
    if(objects){
      let object = [];
      const idsToFetch = objects.map(obj => {
        if (Array.isArray(obj?.references)) {

          object = obj?.references.map(item => { return item})
        } else {
          object.push(Number(obj?.references))
        }
        return object;
      })
      if(type === 'ORDER_ITEM'){
        getProductsById(object);
      }else if(type === 'COLLECTION'){
        getCollectionsById(object)
      }
    }
  },[objects]);

  useEffect(()=>{
    if(dataProductsById?.productsByIds && type === 'ORDER_ITEM'){
      let filtered = dataProductsById?.productsByIds.map(item =>({ value: item, label: item.name }));
      setSelectedItems(dataProductsById?.productsByIds);
      setSelectData(filtered);
    }

    if(dataCollectionsById?.collectionsByIds && type === 'COLLECTION'){
      let filtered = dataCollectionsById?.collectionsByIds.map(item =>({ value: item, label: item.name }));
      setSelectedItems(dataCollectionsById?.collectionsByIds);
      setSelectData(filtered);
    }
  },[dataProductsById, dataCollectionsById]);

  useEffect(() => {
    if (type) {
      console.log('type',type);
      setSelectedItems([])
    }
  }, [type]);


  return (
    <Container>
      <div className="containerColumn">
        <ContainerTitle>Objeto</ContainerTitle>
        <br />
        <ContainerOption>
          <RadioButton
            type="radio"
            disabled={published}
            checked={type === 'ORDER'}
            value={'ORDER'}
            onChoose={(e) => handleType(e.currentTarget.value)}
            classes="comissionTable--checkbox"
          />
          <span className="cardStep__content">Total do Pedido <br /> {isWine ?  '': '(Não considera o valor do frete)'}</span>
        </ContainerOption>
        {!isWine  &&
          <ContainerOption>
            <RadioButton
              type="radio"
              disabled={published}
              checked={type === 'FREIGHT'}
              value={'FREIGHT'}
              onChoose={(e) => handleType(e.currentTarget.value)}
              classes="comissionTable--checkbox"
            />
            <span className="cardStep__content">Frete <br /> (Não considera o valor do pedido.)</span>
          </ContainerOption>
        }
        <ContainerOption>
          <RadioButton
            type="radio"
            disabled={published}
            checked={type === 'COLLECTION'}
            value={'COLLECTION'}
            onChoose={(e) => handleType(e.currentTarget.value)}
            classes="comissionTable--checkbox"
          />
          <span className="cardStep__content">Coleções específicas</span>
        </ContainerOption>

        <ContainerOption>
          <RadioButton
            type="radio"
            disabled={published}
            checked={type === 'ORDER_ITEM'}
            value={'ORDER_ITEM'}
            onChoose={(e) => handleType(e.currentTarget.value)}
            classes="comissionTable--checkbox"
          />
          <span className="cardStep__content">Produtos específicos</span>
        </ContainerOption>

      </div>

      <div className="containerColumn">
        <ContainerTitle>Seleção (p/ coleções e produtos)</ContainerTitle>
        <br />

        <div className="asyncSelectContainer">
          <AsyncSelect
            cacheOptions={false}
            defaultOptions
            isDisabled={!["ORDER_ITEM", "COLLECTION"].includes(type) || published}
            value={{
              value: true,
              label: type === "ORDER_ITEM" ? "Buscar por produtos (nome ou código)" : "Buscar por coleções"
            }}
            loadOptions={loadOptions}
            placeholder={type === "ORDER_ITEM" ? "Buscar por produtos (nome ou código)" : "Buscar por coleções"}
            noOptionsMessage={() => "Para buscar, digite pelo menos, 4 caracteres"}
            //isLoading={loadingProducts || loadingCollection}
            loadingMessage={() => "Pesquisando..."}
            onInputChange={(value, action) => handleSearch(value, action)}
            onChange={(value, action) => handleChange(value, action)}
          />
        </div>

        <TagCloud isDisabled={!["ORDER_ITEM", "COLLECTION"].includes(type)}>
          {selectedItems.map((item, index) => {
            return (
              <SimpleTag
                key={`keyTag${index}`}
                color="#b2b2b3"
                icon={!published &&
                  <Icons.closeSmall
                    fill="#FFF"
                    onClick={() => {
                      selectedItems.splice(_.indexOf(selectedItems, item), 1);
                      let obj = selectedItems
                      let references = obj.map(item => Number(item?.id));
                        setCouponMechanics('objects', [
                          {
                            type,
                            references
                          }
                        ]);
                      setSelectedItems([...selectedItems]);
                    }}
                  />
                }
              >
                <span className="small">{item?.name}</span>
              </SimpleTag>
            )
          })
          }

        </TagCloud>

      </div>


    </Container>
  );
};

export default CoupomObjects;

