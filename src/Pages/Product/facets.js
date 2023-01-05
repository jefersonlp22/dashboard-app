import React, { useState, useEffect, useMemo } from "react";
import ShopLayout from "./layout";

import {
  Col,
  Row,
  Line,
  Card,
  Button,
  Icons,
  Breadcrumbs,
  SelectableTag,
  SimpleTag,
  Thead,
  Tr,
  Td,
  InnerTable,
  PopoverItem,
  Popover,
  Switch,
  SelectFacets
} from "../../components";

import { useIndexFacet, useUpdateFacet, useDeleteFacet } from '../../hooks-api/useFacet';

import _ from "lodash";

const Facets = ({ changeScreen, onChange, currentFacets, style }) => {
  const { data: loadedFacets, loading, error, refetch } = useIndexFacet({ first: 200 });
  const [updateFacet, { data: updatedFacet, loading: updateLoading, error: updateErro }] = useUpdateFacet();
  const [deleteFacet, { }] = useDeleteFacet();
  const [options, setOptions] = useState([]);
  const [productFacets, setProductFacet] = useState();
  const [hasChange, setHasChange] = useState(false);


  const addFacet = () => {
    let cloneProductFacets = productFacets;
    cloneProductFacets.push({
      id: null,
      color: "#0489cc",
      visible: true,
      name: "",
      values: []
    });
    setProductFacet([...cloneProductFacets]);
  };

  const checkValueSelected = (array) => {
    return array.map(value => {
      return {
        ...value,
        selected: currentFacets?.filter(i => value.id === i.id).length > 0
      };
    });
  };

  const filterFacets = (data) => {

    let defaultOptions = currentFacets.map(facet => ({
      facet: {
        id: facet.facet.id,
        name: facet.facet.name,
        color: facet.facet.color
      },
      id: facet.id,
      name: facet.name
    }));
    setOptions(defaultOptions);

    const values = data.facets.data.map(facet => {
      return {
        id: facet.id,
        color: facet.color || "#0489cc",
        visible: facet.visible,
        name: facet.name,
        values: facet.values,
        __typename: "Facet"
      };
    });
    setProductFacet(values);
  };

  const updateFacetProperty = (index, property, value) => {
    productFacets[index][property] = value;
    setProductFacet([...productFacets]);
  };

  const updateVariantProperty = (indexFacet, valueIndex, property, content) => {
    productFacets[indexFacet].values[valueIndex][property] = content;
    setProductFacet([...productFacets]);
  };

  const addVariantValue = (indexFacet, text, e) => {
    e.currentTarget.textContent = "";
    productFacets[indexFacet].values.push({ id: "", name: text.trim() });
    setProductFacet([...productFacets]);
  };

  const removeVariantValue = (indexFacet, valueIndex) => {
    delete productFacets[indexFacet].values[valueIndex];
    setProductFacet([...productFacets]);
  };

  const removeFacet = (facetId) => {
    deleteFacet({ variables: { id: facetId } });
    _.remove(productFacets, ['id', facetId]);
    setProductFacet([...productFacets]);
  };

  const serializeFacetValues = (array) => {
    return array.map((item => {
      let value = {
        id: item.id,
        name: item.name
      }
      if (!value.id || value.id === "") { delete value.id; }
      return value;
    }));
  };

  const saveFacetChanges = async (index, params) => {
    try {

      let facet = {
        name: params.name,
        color: params.color || '',
        visible: params.visible ? 1 : 0,
        values: serializeFacetValues(params.values)
      };

      if (params.id && params.id !== '') { facet.id = params.id; }

      let result = await updateFacet({ variables: facet });

      if(result){
        let cloneProductFacets = productFacets;
        cloneProductFacets[index] = {
          id: result.data.saveFacet.id,
          color: result.data.saveFacet.color || "#0489cc",
          visible: result.data.saveFacet.visible,
          name: result.data.saveFacet.name,
          values: checkValueSelected(result.data.saveFacet.values)
        }
        loadedFacets.facets.data.push(result.data.saveFacet);
        setProductFacet([...cloneProductFacets]);
      }

    } catch (err) {
      console.log('!', err);
    }
  };

  const handleSelect = async (params) => {

    // Buscar por facets sem id
    /**
     * 1 - Verificar diferenças, entre o objeto original e o atual;
     * 2 - O objeto atual é a referencia para o original
     * 3 - se o objeto atual mudar, essa mudança terá que constar no objeto original
     */
    // let cloneOriginal = loadedFacets.facets.data;
    // let searchInOriginal = _.findIndex(cloneOriginal, ['id',result.data.saveFacet.id]);
    // console.log(searchInOriginal);
    // setHasChange(false);
    // product: facet_values [{id: "212"},{id: "212"},{id: "212"}]
  };

  const checkChanges = (facet) =>{

    // let check = false;

    // if(facet.id || facet.id !== ""){
    //   let originalEquivalente = _.find(loadedFacets.facets.data, ['id', facet.id]);
    //   let checkFacet = _.isEqual(originalEquivalente, facet);
    //   console.log
    //   if(
    //     originalEquivalente.values.length && facet.values.length &&
    //     originalEquivalente.values.length === facet.values.length
    //   ){
    //     // console.log('EITA---1');
    //     let checkValues =_.intersectionWith(originalEquivalente.values, facet.values, _.isEqual);
    //     //  _.isEqual(originalEquivalente.values, facet.values);

    //     // console.log('checkValues',originalEquivalente.values.length, facet.values.length, checkValues.length);
    //   }

    //   check = checkFacet;

    //   // console.group('CHECK');
    //   // console.log(originalEquivalente.values, facet.values);
    //   // // console.log('facet',facet);
    //   // // console.log('OriginalEqui',originalEquivalente);
    //   // console.log('checkFacet',checkFacet);
    //   // console.log('check',check);
    //   // console.groupEnd('EITA');

    // }else{
    //   check = false;
    // }

    // console.log(facet);

    return facet.id;
  }

  useEffect(() => {
    if (loadedFacets) { filterFacets(loadedFacets); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedFacets]);

  // useEffect(()=>{
  //   console.log('productFacets',productFacets);
  // },[productFacets]);

  return (
    <ShopLayout style={style}>
      <Breadcrumbs itens={["Shop", "Produtos", "Novo Produto", "Atributos"]} />
      <Card>
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <Icons.back
            style={{ width: "50px", height: "50px" }}
            onClick={() => {
              changeScreen('product');
            }}
          />
        </div>
        <Line />
        <Line />
        <Row>
          <Col>
            <div className="card__title">Atributos</div>
          </Col>
        </Row>
        <Row vcenter className="mBottom30">
          <Col className="subtitle">
            Atenção! Todas suas mudanças afetarão todos os itens vinculados.
          </Col>
          <Col>
            <Button
              onClick={() => {
                addFacet();
              }}
              primary
              style={{ float: "right" }}
              type='button'
            >
              NOVO TIPO
            </Button>
          </Col>
        </Row>

        <InnerTable>
          <Thead>
            <Td>Tipo</Td>
            <Td>Valores</Td>
            <Td>&nbsp;</Td>
          </Thead>

          {productFacets?.map((facet, index) => (
            <Tr key={`tt-${index}`}>
              <Td>
                <SimpleTag
                  color={facet.color}
                  data-id={facet.id}
                  data-index={index}
                  value={facet.name}
                  icon={' '}
                  onBlur={(text, e, id) => {
                    updateFacetProperty(index, 'name', text);
                  }}
                  onEnter={(text, e, id) => {
                    updateFacetProperty(index, 'name', text);
                  }}
                  editable
                />
              </Td>
              <Td>
                {facet?.values?.length > 0
                  ? facet.values.map((value, valueIndex) => (
                    <SelectableTag
                      selected={
                        currentFacets.filter(vl => {
                          return value.id === vl.id;
                        }).length > 0
                      }
                      onSelect={item => {
                        const findOption = (id, name) => {
                          return options.filter(opt => {
                            return opt.id === id || opt.name === name;
                          })[0];
                        };

                        let selected = options;
                        if (item.selected) {
                          const option = findOption(value.id, value.name);
                          if (!option) {
                            selected.push({
                              facet: {
                                id: facet.id,
                                name: facet.name,
                                color: facet.color
                              },
                              id: value.id,
                              name: value.name
                            });
                          }
                        } else {
                          _.remove(selected, function (n) {
                            return (n.id === value.id || n.name === value.name) && n.facet.name === facet.name;
                          });
                        }
                        setOptions([...selected]);
                      }}

                      key={`vl-${valueIndex}`}
                      data-id={facet.id}
                      data-index={index}
                      color={facet.color}
                      onEnter={({ content, changeEditableState, id }) => {
                        changeEditableState();
                        updateVariantProperty(index, valueIndex, 'name', content);
                      }}
                      onDelete={id =>
                        removeVariantValue(index, valueIndex)
                      }
                      value={value.name}
                    />
                  ))
                  : null}

                <SimpleTag
                  color={facet.color}
                  data-id={facet.id}
                  value=""
                  onEnter={(text, e) => {
                    if (!!text && text !== "      " && text !== " ") {
                      addVariantValue(index, text, e);
                    }
                  }}
                  editable
                  invert
                  icon={<Icons.next fill={facet.color} />}
                />
              </Td>
              <Td className="df fdr jc-e">
                <Popover
                  title="Editar atributo"
                  content={
                    <div>
                      <PopoverItem>
                        Visibilidade
                              <Switch
                          isOn={productFacets[index]?.visible}
                          multipleKey={`${index}`}
                          handleToggle={(e, value) => {
                            updateFacetProperty(index, 'visible', !productFacets[index]?.visible);
                          }}
                        />
                      </PopoverItem>
                      <PopoverItem onClick={() => { }}>
                        Alterar Cor
                              <input
                          type="color"
                          value={facet.color}
                          onChange={e => {
                            updateFacetProperty(index, 'color', e.target.value);
                          }}
                        />
                      </PopoverItem>
                    </div>
                  }
                  showCloseButton
                >
                  <Icons.pencil fill="#0489cc" />
                </Popover>
                {checkChanges(facet) ?
                  <Icons.delete
                    fill="c8c7cc"
                    onClick={() => removeFacet(facet.id)}
                  />
                  :
                  <Icons.starSmall
                    fill="c8c7cc"
                    onClick={() => saveFacetChanges(index, facet)}
                  />
                }
              </Td>
            </Tr>
          ))}
        </InnerTable>

        <Row className="df jc-end mTop30">
          <Col className="subtitle">
            Tecle ENTER para salvar e ESC para cancelar.
          </Col>
          <Button
            className="success"
            type='button'
            onClick={() => handleSelect()}
          >
            Selecionar
          </Button>
        </Row>
      </Card>
    </ShopLayout>
  );
};

export default Facets;
