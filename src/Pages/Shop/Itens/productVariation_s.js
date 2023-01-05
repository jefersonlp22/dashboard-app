import React, { useState } from "react";
import NumberFormat from "react-number-format";
import { useSelector, useDispatch } from "react-redux";
import Combinatorics from "js-combinatorics";

import ShopLayout from "../index";

import {
  InputText,
  SimpleTag,
  Col,
  Row,
  Line,
  Thead,
  Tr,
  Td,
  Card,
  InnerTable,
  Button,
  Icons,
  Breadcrumbs
} from "../../../components";

import { withRouter } from "react-router-dom";

import "./variant.scss";

let interval = setTimeout(() => {}, 1000);

const ShopProductVariation = ({ history }) => {
  const [, setCombinations] = useState([]);
  const product = useSelector(state => state.products);
  const dispatch = useDispatch();

  const addVariant = content => {
    let { options } = product;

    options.push({
      id: "",
      name: "",
      values: []
    });

    dispatch({ type: "UPDATE_PRODUCT", product: { ...product, options } });
    combinators();
  };

  const handleOptionValue = (index, value) => {
    let { options } = product;

    options[index].name = value;

    dispatch({ type: "UPDATE_PRODUCT", product: { ...product, options } });
    combinators();
  };

  const handleVariantValue = (index, valueIndex, text) => {
    let { options } = product;

    options[index].values[valueIndex].name = text.trim();

    dispatch({ type: "UPDATE_PRODUCT", product: { ...product, options } });
    combinators();
  };

  const addVariantValue = (index, text, e) => {
    e.currentTarget.textContent = "";

    let { options } = product;

    options[index].values.push({
      id: "",
      name: text.trim()
    });

    dispatch({ type: "UPDATE_PRODUCT", product: { ...product, options } });
    combinators();
  };

  const removeVariantValue = (index, valueIndex) => {
    let { options } = product;

    delete options[index].values[valueIndex];

    // eslint-disable-next-line array-callback-return
    options[index].values = options[index].values.filter(item => {
      if (item) return item;
    });

    dispatch({ type: "UPDATE_PRODUCT", product: { ...product, options } });
    combinators();
  };

  const removeVariant = index => {
    let { options } = product;

    delete options[index];

    // eslint-disable-next-line array-callback-return
    options = options.filter(item => {
      if (item) return item;
    });

    dispatch({ type: "UPDATE_PRODUCT", product: { ...product, options } });
    combinators();
  };

  const combinators = () => {
    let { options } = product;

    const variant = options
      .filter(item => !!item && item.values.length > 0)
      .map(variant => {
        variant.values.forEach(function(value, index) {
          variant.values[index].optionName = variant.name;
        });
        return variant.values;
      });

    let variants = [];

    if (variant.length === 0) {
      setCombinations([]);
    } else {
      let combinations = Combinatorics.cartesianProduct(...variant).toArray();
      // setCombinations(cbntrs)
      combinations = combinations.map(combination => {
        return {
          id: "",
          sku: "",
          stock: null,
          price: null,
          values: combination
        };
      });

      variants = [
        ...combinations
        // , ...product.variants.filter(variant => variant.values.length === 0)
      ];
    }

    dispatch({ type: "UPDATE_PRODUCT", product: { ...product, variants } });
  };

  return (
    <ShopLayout>
      <Breadcrumbs itens={["Shop", "Itens", "Novo Item", "Variações"]} />
      <Card>
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <Icons.back
            style={{ width: "50px", height: "50px" }}
            onClick={() => {
              history.goBack();
            }}
          />
        </div>

        {!product.id ? (
          <>
            <Line />
            <Line />
            <Row>
              <Col>
                <div className="card__title">Variações</div>
              </Col>
            </Row>
            <Line />
            <Row vcenter>
              <Col>
                <span className="subtitle">Gerador de variações</span>
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
          </>
        ) : null}

        {!product.id ? (
          <InnerTable>
            <Thead>
              <Td>Tipo</Td>
              <Td>Valores</Td>
              <Td>&nbsp;</Td>
            </Thead>
            {/* {JSON.stringify(product.variants)} */}
            {product.options.length > 0
              ? product.options.map((option, index) => (
                  <Tr key={`tt-${index}`}>
                    <Td>
                      <SimpleTag
                        color="#888"
                        value={option.name}
                        onEnter={(text, e) => {
                          handleOptionValue(index, text);
                        }}
                        editable
                        icon={<Icons.pencil fill={"#FFF"} />}
                      />
                    </Td>
                    <Td>
                      {option.values.length > 0
                        ? option.values.map((value, valueIndex) => (
                            <SimpleTag
                              key={`vl-${valueIndex}`}
                              color="#888"
                              onInput={text => {
                                clearInterval(interval);
                                interval = setTimeout(
                                  () =>
                                    handleVariantValue(index, valueIndex, text),
                                  500
                                );
                              }}
                              editable
                              icon={
                                <Icons.delete
                                  onClick={() => {
                                    removeVariantValue(index, valueIndex);
                                  }}
                                  fill={"#FFF"}
                                />
                              }
                              value={value.name}
                            />
                          ))
                        : null}

                      <SimpleTag
                        color="#888"
                        value=""
                        onEnter={(text, e) => {
                          if (!!text.trim()) {
                            addVariantValue(index, text, e);
                          }
                        }}
                        editable
                        invert
                        icon={<Icons.next fill={"#888"} />}
                      />
                    </Td>
                    <Td>
                      <Icons.delete
                        className="removeVariant"
                        onClick={() => {
                          removeVariant(index);
                        }}
                      />
                    </Td>
                  </Tr>
                ))
              : ""}
          </InnerTable>
        ) : null}

        {!product.options.length ? (
          <div className="emptyListDescription">
            Você ainda não tem nenhuma variação cadastrada.
          </div>
        ) : (
          ""
        )}
      </Card>
      <Line />
      <Line />
      {/* {JSON.stringify(product)} */}
      {product.variants.filter(variant => variant.values.length !== 0).length >
      0
        ? product.variants.map((variant, index) => (
            <div key={index}>
              <Card>
                <Row>
                  <Col>
                    {variant.values.map((item, vindex) => (
                      <SimpleTag
                        key={`ttt-${vindex}`}
                        color="#888"
                        value={
                          <div>
                            <span className="tagSmallText">
                              {item.optionName}
                            </span>
                            <span>{item.name}</span>
                          </div>
                        }
                      />
                    ))}
                    <Line />
                    <Line />
                    <Line />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {/* {JSON.stringify(variant)} */}
                    <InputText
                      className="light"
                      text={"Código"}
                      type="title"
                      required
                      defaultValue={variant.sku}
                      onChange={e => {
                        let variants = product.variants;
                        variants[index].sku = e.target.value;
                        dispatch({
                          type: "UPDATE_PRODUCT",
                          product: { ...product, variants }
                        });
                      }}
                    />
                  </Col>
                  <Col className="padding20 paddingLeft paddingRight">
                    <NumberFormat
                      thousandSeparator={false}
                      text={"Estoque"}
                      required
                      customInput={InputText}
                      value={variant.stock}
                      className="light"
                      onValueChange={values => {
                        const { floatValue } = values;
                        let { variants } = product;
                        variants[index].stock = floatValue;
                        dispatch({
                          type: "UPDATE_PRODUCT",
                          product: { ...product, variants }
                        });
                      }}
                    />
                  </Col>
                  <Col className="padding20 paddingLeft">
                    <NumberFormat
                      thousandSeparator={"."}
                      decimalSeparator={","}
                      decimalScale={2}
                      prefix={"R$ "}
                      text={"Preço"}
                      required
                      customInput={InputText}
                      value={variant.price}
                      className="light"
                      onValueChange={values => {
                        const { floatValue } = values;
                        let { variants } = product;
                        variants[index].price = floatValue;
                        dispatch({
                          type: "UPDATE_PRODUCT",
                          product: { ...product, variants }
                        });
                      }}
                    />
                  </Col>
                </Row>
              </Card>
              <Line />
            </div>
          ))
        : null}
    </ShopLayout>
  );
};

export default withRouter(ShopProductVariation);
