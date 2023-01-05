import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ShopLayout from "./index";

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
  Switch
} from "../../components";

import { useFacet } from "../../gqlEndpoints/mutations/facets";
import { useFacets } from "../../gqlEndpoints/queries/getFacets";
import _ from "lodash";

const ShopAttributes = ({ history }) => {
 
  const product = useSelector(state => state.products);
   
  const dispatch = useDispatch();
  const { facet, deleteFacet } = useFacet();
  const { loadFacets } = useFacets();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    loadAttributes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addVariant = async content => {
    const newFacet = await facet({ name: "", values: [] });

    const tempProduct = product;

    tempProduct.attributes.push({
      id: newFacet.saveFacet.id,
      color: "#0489cc",
      visible: true,
      type: "",
      values: []
    });

    dispatch({
      type: "UPDATE_PRODUCT",
      product: { ...product, ...tempProduct }
    });
  };

  const loadAttributes = (index, type) => {
    loadFacets(200).then(facets => {
      let defaultOptions = [];
      // eslint-disable-next-line array-callback-return
      facets.facets.data.map(facet => {
        // eslint-disable-next-line array-callback-return
        facet.values.map(opt => {
          defaultOptions.push({
            id: opt.id,
            type: facet.name,
            color: facet.color,
            name: opt.name,
            selected: false
          });
        });
      });

      setOptions(defaultOptions);

      const values = facets.facets.data.map(facet => {
        return {
          id: facet.id,
          color: facet.color || "#0489cc",
          visible: true,
          type: facet.name,
          values: facet.values
        };
      });

      var tempProduct = product;
      tempProduct.attributes = values;

      dispatch({
        type: "UPDATE_PRODUCT",
        product: { ...product, ...tempProduct }
      });
    });
  };

  const handleType = async (index, type) => {
    let tempProduct = product;
    let values = [];

    // eslint-disable-next-line
    tempProduct.attributes.map(item => {
      if (item.id === index) {
        item.type = type;

        values = item.values.map(facet => {
          return {
            id: facet.id,
            name: facet.name
          };
        });
      }
    });

    await facet({
      id: index,
      name: type,
      values: values
    });

    dispatch({
      type: "UPDATE_PRODUCT",
      product: { ...product, ...tempProduct }
    });
  };

  const handleColor = async (index, color) => {
    var tempProduct = product;

    tempProduct.attributes[index].color = color;

    await facet({
      id: tempProduct.attributes[index].id,
      name: tempProduct.attributes[index].type,
      values: tempProduct.attributes[index].values,
      color: color
    });

    dispatch({
      type: "UPDATE_PRODUCT",
      product: { ...product, ...tempProduct }
    });
  };

  // const handleVisibility = (index, value) => {
  //   const tempProduct = product;
  //   tempProduct.attributes[index].visible = value;

  //   dispatch({
  //     type: "UPDATE_PRODUCT",
  //     product: { ...product, ...tempProduct }
  //   });
  // };

  const handleVariantValue = (id, index, valueIndex, text) => {
    var tempProduct = product;

    tempProduct.attributes[index].values[valueIndex].name = text;

    facet({
      id: id,
      name: tempProduct.attributes[index].type,
      values: tempProduct.attributes[index].values.map(item => {
        return {
          id: item.id,
          name: item.name
        };
      })
    });

    dispatch({
      type: "UPDATE_PRODUCT",
      product: { ...product, ...tempProduct }
    });
  };

  const addVariantValue = async (id, index, text, e) => {
    e.currentTarget.textContent = "";

    let tempProduct = product;

    tempProduct.attributes[index].values.push({ id: "", name: text.trim() });

    let result = await facet({
      id: id,
      name: tempProduct.attributes[index].type,
      values: tempProduct.attributes[index].values.map(item => {
        return {
          id: item.id,
          name: item.name
        };
      })
    });

    tempProduct.attributes[index].values = result.saveFacet.values;

    let defaultOptions = options;

    // eslint-disable-next-line array-callback-return
    result.saveFacet.values.map(opt => {
      defaultOptions.push({
        id: opt.id,
        type: tempProduct.attributes[index].type,
        name: opt.name,
        selected: false
      });
    });

    setOptions(defaultOptions);

    dispatch({
      type: "UPDATE_PRODUCT",
      product: { ...product, ...tempProduct }
    });
  };

  const removeVariantValue = (id, index, valueIndex) => {    
    let tempProduct = _.cloneDeep(product);    
    let objectToRemove = tempProduct.attributes[index].values[valueIndex];    
    let newAttributeValues = tempProduct.attributes[index].values.filter((i)=>(
      i.id !== objectToRemove.id && i.name !== objectToRemove.name));
    tempProduct.attributes[index].values = newAttributeValues;
    dispatch({
      type: "UPDATE_PRODUCT",
      product: { ...product, ...tempProduct }
    });
    facet({
      id,
      name: tempProduct.attributes[index].type,
      values: tempProduct.attributes[index].values.map(item => {
        return {
          id: item.id,
          name: item.name
        };
      })
    });    
  };

  const removeVariant = (id, index) => {
    var tempProduct = product;

    delete tempProduct.attributes[index];

    // eslint-disable-next-line array-callback-return
    tempProduct.attributes = tempProduct.attributes.filter(item => {
      if (item) return item;
    });

    dispatch({
      type: "UPDATE_PRODUCT",
      product: { ...product, ...tempProduct }
    });

    deleteFacet(id);
  };

  return (
    <ShopLayout>
      <Breadcrumbs itens={["Shop", "Itens", "Novo Item", "Atributos"]} />
      <Card>
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <Icons.back
            style={{ width: "50px", height: "50px" }}
            onClick={() => {
              history.goBack();
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
                addVariant();
              }}
              primary
              style={{ float: "right" }}
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

          {product.attributes.map((facet, index) => (
            <Tr key={`tt-${index}`}>
              <Td>
                <SimpleTag
                  color={facet.color}
                  data-id={facet.id}
                  data-index={index}
                  value={facet.type}
                  icon={<Icons.pencil fill={"#FFF"} />}
                  onEnter={(text, e, id) => {
                    handleType(id, text);
                  }}
                  editable
                />
              </Td>
              <Td>
                {facet.values.length > 0
                  ? facet.values.map((value, valueIndex) =>(
                      <SelectableTag
                        selected={
                          product.facet_values.filter(vl => {
                            return value.id === vl.id;
                          }).length > 0
                        }
                        onSelect={item => {
                          const findOption = id => {
                            return options.filter(opt => {
                              return opt.id === id;
                            })[0];
                          };

                          let attributes = product.facet_values;

                          if (item.selected) {
                            const option = findOption(value.id);
                            if (option) {
                              attributes.push({
                                id: option.id,
                                name: option.name,
                                color: option.color,
                                facet: {
                                  name: option.type
                                }
                              });
                            }
                          } else {
                            _.remove(product.facet_values, function(n) {
                              return n.id === value.id;
                            });
                          }

                          dispatch({
                            type: "UPDATE_PRODUCT",
                            product: { ...product }
                          });
                        }}
                        key={`vl-${valueIndex}`}
                        data-id={facet.id}
                        data-index={index}
                        color={facet.color}
                        onEnter={({ content, changeEditableState, id }) => {
                          changeEditableState();
                          handleVariantValue(id, index, valueIndex, content);
                        }}
                        onDelete={(id,changeEditableState) =>{
                          changeEditableState();
                          removeVariantValue(id, index, valueIndex);
                        }}
                        value={value.name}
                      />
                    ))
                  : null}

                <SimpleTag
                  color={facet.color}
                  data-id={facet.id}
                  value=""
                  onEnter={(text, e, id) => {
                    if (!!text && text !== "      " && text !== " ") {
                      addVariantValue(id, index, text, e);
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
                          isOn={product.attributes[index].visible}
                          multipleKey={`${index}`}
                          handleToggle={(e, index) => {
                            return index;
                          }}
                        />
                      </PopoverItem>
                      <PopoverItem onClick={() => {}}>
                        Alterar Cor
                        <input
                          type="color"
                          value={facet.color}
                          onChange={e => {
                            handleColor(index, e.target.value);
                          }}
                        />
                      </PopoverItem>
                    </div>
                  }
                  showCloseButton
                >
                  <Icons.pencil fill="#0489cc" />
                </Popover>

                <Icons.delete
                  fill="c8c7cc"
                  onClick={() => removeVariant(facet.id, index)}
                />
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
            onClick={() => {
              history.goBack();
            }}
          >
            SALVAR
          </Button>
        </Row>
      </Card>
    </ShopLayout>
  );
};

export default withRouter(ShopAttributes);
