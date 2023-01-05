import React, { useState, useEffect } from "react";
import NumberFormat from "react-number-format";
import { useSelector, useDispatch } from "react-redux";
import { withRouter, Link } from "react-router-dom";

import ShopLayout from "../index";

import { useFacets } from "../../../gqlEndpoints/queries";

import {
  InputText,
  SimpleTag,
  InnerEdgeButton,
  Col,
  Row,
  Switch,
  Line,
  Card,
  Icons,
  Breadcrumbs
} from "../../../components";

import "./variant.scss";

const ShopManageVariations = ({ history }) => {
  const { loadFacets } = useFacets();
  const [, setFacets] = useState({});
  const product = useSelector(state => state.products);
  const [variants, setVariants] = useState([]);
  const dispatch = useDispatch();

  const getFacets = async () => {
    let response = await loadFacets(200);
    setFacets(response);
  };

  useEffect(() => {
    getFacets();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    let validVariants = product.variants.filter(
      variant => variant.values.length !== 0 || variant.id
    );
    setVariants(validVariants);
  }, [product]);

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

        <Line />
        <Line />
        <Row>
          <Col>
            <div className="card__title">Variações geradas</div>
          </Col>
          {!product?.id ? (
            <Col className="df jc-end">
              <Link to="/shop/produtos/novo/variacoes" className="titleLink">
                Gerador de variações
              </Link>
            </Col>
          ) : null}
        </Row>

        <Line />

        {variants.map((variant, index) => (
          <div key={index}>
            <Card className="cardManageVariation">
              <Row>
                <Col>
                  {variant.values.map((item, vindex) => (
                    <SimpleTag
                      key={`ttt-${vindex}`}
                      color="#888"
                      value={
                        <div>
                          <span className="tagSmallText">
                            {item?.option?.name}
                          </span>
                          <span>{item.name}</span>
                        </div>
                      }
                    />
                  ))}
                </Col>
              </Row>
              <Line />
              <Line />
              <Row>
                <Col className="padding40 paddingRight">
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
                <Col className="padding40 paddingRight">
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
                <Col className="padding40 paddingRight">
                  <NumberFormat
                    thousandSeparator={"."}
                    decimalSeparator={","}
                    fixedDecimalScale={true}
                    decimalScale={2}
                    prefix={"R$ "}
                    text={"Preço (De)"}
                    required
                    customInput={InputText}
                    value={variant.list_price}
                    className="light"
                    onValueChange={values => {
                      const { floatValue } = values;
                      let { variants } = product;
                      variants[index].list_price = floatValue;
                      dispatch({
                        type: "UPDATE_PRODUCT",
                        product: { ...product, variants }
                      });
                    }}
                  />
                </Col>
                <Col className="padding40 paddingRight">
                  <NumberFormat
                    thousandSeparator={"."}
                    decimalSeparator={","}
                    fixedDecimalScale={true}
                    decimalScale={2}
                    prefix={"R$ "}
                    text={"Preço (Por)"}
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
                <Col>
                  <Switch
                    isOn={variant.enabled}
                    label="Visibilidade"
                    handleToggle={() => {
                      let { variants } = product;
                      variants[index].enabled = !variant.enabled;
                      dispatch({
                        type: "UPDATE_PRODUCT",
                        product: { ...product, variants }
                      });
                    }}
                  />
                </Col>
              </Row>

              {/* <SelectFacets
                facets={facets}
                onChange={seteds => {
                  let { variants } = product;
                  variants[index].facet_values = seteds;
                  dispatch({
                    type: "UPDATE_PRODUCT",
                    product: { ...product, variants }
                  });
                }}
              /> */}
            </Card>
            <Line />
          </div>
        ))}
      </Card>
      <Line />
      <Line />
      <InnerEdgeButton
        className="success floatingButtons"
        onClick={() => {
          history.replace("/shop/produtos/novo");
        }}
      >
        salvar alterações
      </InnerEdgeButton>
    </ShopLayout>
  );
};

export default withRouter(ShopManageVariations);
