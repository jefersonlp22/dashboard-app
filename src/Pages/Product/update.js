import React, { useState, useEffect } from "react";
import Combinatorics from "js-combinatorics";
import NumberFormat from "react-number-format";
import Swal from "sweetalert2";
import { withRouter, useRouteMatch, Link } from "react-router-dom";
import { Formik, Form } from "formik";
import ShopLayout from "./layout";

import {
  Icons,
  Label,
  TagButton,
  Breadcrumbs,
  Card,
  Switch,
  AlertButton,
  Alert,
  UploadImage,
  InputText,
  Col,
  Row,
  Grid as div,
  Line,
  Button,
  Tag,
  RichText,
  Radio,
  RadioButton,
  Tooltip,
  InputKeyValue
} from "../../components";

import { useShowProduct, useDeleteProduct } from '../../hooks-api/useProduct';
import Facets from "./facets";

window.Combinatorics = Combinatorics;
window.combinatorics = (...list) => {
  return Combinatorics.cartesianProduct(...list);
};

const ProductUpdate = ({ history }) => {
  const match = useRouteMatch("/shop/produtos/edit/:id");
  const { data, loading, errors, refetch } = useShowProduct({ id: match.params.id });
  const [product, setProduct] = useState(null);
  const [screen, setScreen] = useState('product');
  // const [alert, setAlert] = useState(false);

  const serializeImages = (assets) => {
    let images = assets || [];

    return [
      ...images,
      ...Array(4 - images.length).fill({ id: "", url: "" })
    ];
  }

  const serializeVariants = (variants) => {
    return variants?.map(variant => {
      return {
        id: variant.id,
        sku: variant.sku,
        stock: parseInt(variant.stock || 0),
        price: parseInt(variant.price ? variant.price * 100 : 0),
        list_price: parseInt(variant.list_price ? variant.list_price * 100 : 0),
        enabled: variant.enabled ? 1 : 0,
        options: variant.values.map(option => {
          return {
            id: option.id,
            name: option.optionName,
            value: option.name
          };
        })
      };
    }) || [];
  };

  const serializeOptions = (options) => {
    return options?.map(option => {
      option.values = option.values.map(optionValue => {
        delete optionValue.optionName;
        return optionValue;
      });
      return option;
    }) || [];
  }

  const serializeFacets = (facets) => {
    return facets?.map(facet => ({
      id: facet.id
    })) || [];
  }
  const serializeProduct = (product) => {
    let serialized = {
      name: product?.name || '',
      code: product?.code || '',
      description: product?.description || '',
      type: product?.type || 'simple',
      datasheet: product?.datasheet || '',
      share_image: product?.share_image || '',
      enabled: product?.enabled ? 1 : 0,
      quantity_items: 1,
      facet_values: product?.facet_values,
      images: serializeImages(product?.assets),
      variants: serializeVariants(product?.variants),
      options: serializeOptions(product?.options)
    };

    if (product) {
      serialized.id = product.id;
      serialized.quantity_items = product.type === "simple" ? 1 : product.quantity_items;
    }

    return serialized;
  }

  useEffect(() => {
    if (data) {
      let serializedProduct = serializeProduct(data.product);
      setProduct(serializedProduct);
    }
  }, [data]);

  // const {loadProduct} = useProducts();
  // const [unique, setUnique] = useState(null);
  // const [defaultVariantId] = useState(0);
  // const [loading, setLoading] = useState(false);
  // const [descriptionData, setDescriptionData] = useState("");
  // const [productType, setProductType] = useState("simple");

  // const [editing, setEditing] = useState(false);

  // const handleProduct = async content => {
  //   hasChangeForm = true;
  //   await dispatch({type: "UPDATE_PRODUCT", product: {...product, ...content}});
  // };

  // const handleBackButtonClicked = () => {

  // };

  // const defaultVariant = async (variants, product) => {
  //   if (variants.length >= 1 && product.options.length) {
  //     let result = await Swal.fire({
  //       ...swalDefaultOptions,
  //       text:
  //         "Você tem variações geradas, alterando apagará todas. Deseja continuar?"
  //     });

  //     if (result.dismiss) {
  //       setUnique(0);
  //       return false;
  //     }
  //   }

  //   setUnique(1);

  //   if (variants.length === 0) {
  //     variants.push({
  //       id: "",
  //       sku: "",
  //       stock: null,
  //       price: null,
  //       values: []
  //     });
  //   }

  //   variants = [variants[0]];

  //   dispatch({type: "UPDATE_PRODUCT", product: {...product, variants}});
  // };

  // const removeDefaultVariant = async () => {
  //   let defaultVariant = product.variants[0];

  //   if (
  //     defaultVariant &&
  //     (defaultVariant.price || defaultVariant.sku || defaultVariant.stock)
  //   ) {
  //     let result = await Swal.fire({
  //       ...swalDefaultOptions,
  //       text:
  //         "Você tem item único gerado, alterando apagará todas informações. Deseja continuar?"
  //     });

  //     if (result.dismiss) {
  //       setUnique(1);
  //       return false;
  //     }
  //   }

  //   setUnique(0);

  //   dispatch({
  //     type: "UPDATE_PRODUCT",
  //     product: {...product, variants: [], options: []}
  //   });
  // };

  // useEffect(() => {
  //   const init = async () => {
  //     if (!product.variants.length) {
  //       await defaultVariant(product.variants, product);
  //     }

  //     setEditing(product.edit);

  //     if (match && match.params.id && !product.edit) {
  //       setEditing(true);
  //       let query = await loadProduct(match.params.id);

  //       let {variants, options} = query.product;

  //       if (variants.length >= 1 && options.length) {
  //         setUnique(0);
  //       } else if (variants.length === 1 && !options.length) {
  //         setUnique(1);
  //       }

  //       variants.map(function(variant) {
  //         variant.price = variant.price / 100;
  //         variant.list_price = variant.list_price / 100;
  //         return variant;
  //       });

  //       let images = [];

  //       // eslint-disable-next-line
  //       query.product.assets.map(item => {
  //         images.push(item);
  //       });

  //       if (images.length < 4) {
  //         images = [
  //           ...images,
  //           ...Array(4 - images.length).fill({id: "", url: ""})
  //         ];
  //       }

  //       dispatch({
  //         type: "UPDATE_PRODUCT",
  //         product: {
  //           ...query.product,
  //           images,
  //           enabled: query.product.enabled ? true : false,
  //           edit: true
  //         }
  //       });
  //       setProductType(query.product.type);
  //     } else {
  //       let {variants, options} = product;

  //       if (variants.length >= 1 && options.length) {
  //         setUnique(0);
  //       } else if (variants.length === 1 && !options.length) {
  //         setUnique(1);
  //       }
  //       setProductType(product.type);
  //     }
  //   };
  //   init();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <Formik
      initialValues={{ ...product }}
      enableReinitialize={true}
      onSubmit={() => { }}
    >
      {({ ...props }) => (
        <Form>
          <ShopLayout style={{ display: screen === "product" ? 'flex' : 'none' }}>
            {/* <Alert show={alert}>
                    <div>Produto salvo com sucesso!</div>
                    <div>
                      <AlertButton onClick={() => setAlert(false)}>Fechar</AlertButton>
                    </div>
                  </Alert>
                  */}
            <Breadcrumbs itens={["Shop", "Produtos", "Novo"]} />

            <Card>
              <div style={{ position: "absolute", top: 10, left: 10 }}>
                <Icons.back
                  style={{ width: "50px", height: "50px" }}
                  onClick={() => history.push("/shop/produtos")}
                />
              </div>
              <Line />
              <Line />
              <div className="df fdr alic jc-sb">
                <div className="card__title">Novo produto</div>
                <div className="df fdr alic jc-sb">
                  <div style={{ color: "#b2b2b3" }}>Tipo:</div>
                  <RadioButton
                    type="radio"
                    name="productType"
                    value="simple"
                    checked={props.values.type === "simple"}
                    onChoose={e => {
                      props.setFieldValue('type', 'simple');
                    }}
                    style={{ marginLeft: 30, marginBottom: 0 }}
                    label="Simples"
                  />

                  <RadioButton
                    type="radio"
                    name="productType"
                    value="kit"
                    checked={props.values.type === "kit"}
                    onChoose={e => {
                      props.setFieldValue('type', 'kit');
                    }}
                    style={{ marginLeft: 30, marginBottom: 0 }}
                    label="Kit"
                  />
                </div>
              </div>
              <Line />
              <Line />

              <Row>
                <br />
                <Col className="df fdr alic">
                  <br />
                  <InputText
                    className="light"
                    text={"Nome do produto"}
                    type="title"
                    required
                    defaultValue={props.values.name}
                    onInput={({ target }) => {
                      props.setFieldValue('name', parseInt(target.value));
                    }}
                  />

                  {props.values.type !== "simple" ? (
                    <div style={{ width: 130, marginLeft: 30 }}>
                      <InputText
                        className="light"
                        text={"Unidades"}
                        type="number"
                        required
                        defaultValue={props.values.quantity_items}
                        onInput={({ target }) => {
                          props.setFieldValue('quantity_items', parseInt(target.value));
                        }}
                      />
                    </div>
                  ) : null}
                  <div style={{ marginLeft: 50 }}>
                    <Switch
                      isOn={props.values.enabled}
                      label="Visibilidade"
                      handleToggle={() => {
                        props.setFieldValue('enabled', !props.values.enabled);
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <Line />
              <Line />
              <Row>
                <Col>
                  <Label>Atributos</Label>
                </Col>
              </Row>
              <Row>
                <Col>
                  {props.values.facet_values
                    ? props.values.facet_values.map((facet, idx) => (
                      <Tag
                        key={idx}
                        color={facet?.color || facet?.facet?.color || "#0489cc"}
                      >
                        <span style={{ opacity: 0.5 }}>{facet?.facet?.name || facet?.facet?.type}</span>{" "}
                        {facet?.name}
                      </Tag>
                    ))
                    : null}
                  <TagButton
                    onClick={() => {
                      setScreen('facets');
                    }}
                    color="#0489cc"
                    invert
                    type="button"
                  >
                    Selecionar {">"}
                  </TagButton>
                </Col>
              </Row>
              <Line />
              <Row>
                <Col>
                  <Label>Fotos</Label>
                </Col>
              </Row>
              <div className="df fdr alic">
                {props.values.images
                  ? props.values.images.map((image, index) => (
                    <Col key={index} style={{ maxWidth: 200, marginRight: 25 }}>
                      <UploadImage
                        url={image.url ? image.url : ""}
                        onChange={imageBase64 => {
                          let images = props.values.images;
                          images[index] = { id: image.id, url: imageBase64 };
                          props.setFieldValue('images', images);
                        }}
                      />
                    </Col>
                  ))
                  : null}
              </div>
              <Line />
              <Row>
                <Col>
                  <RichText
                    title="Descrição"
                    onChange={(value) => {
                      props.setFieldValue('description', value);
                    }}
                    initialValue={product?.description}
                  />
                </Col>
              </Row>
              <Line />
              <Row>
                <Col>
                  <InputKeyValue
                    text="Ficha técnica"
                    onChange={value => props.setFieldValue('datasheet', value)}
                    defaultValue={props.values.datasheet}
                  />
                </Col>
              </Row>
              <Line />
            </Card>
          </ShopLayout>

          {props.values.facet_values && screen === "facets" ?
            <Facets
              currentFacets={props.values.facet_values}
              onChange={(data)=>{
                props.setFieldValue('facet_values',data);
                setScreen('product');
              }}
              changeScreen={setScreen}
            />
          :null}

        </Form>
      )}
    </Formik>
  );
};

export default withRouter(ProductUpdate);
