import React, { useState, useEffect } from "react";
import Combinatorics from "js-combinatorics";
import NumberFormat from "react-number-format";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { withRouter, useRouteMatch, Link } from "react-router-dom";
import TotalStorage from "total-storage";
import { MountKitProducts } from "./MountKitProducts";

import ShopLayout from "../index";

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
  Grid,
  Line,
  Button,
  Tag,
  RichText,
  Radio,
  RadioButton,
  Tooltip,
  InputKeyValue
} from "../../../components";

import { useProduct } from "../../../gqlEndpoints/mutations/product";
import { useProducts } from "../../../gqlEndpoints/queries/getProducts";

window.Combinatorics = Combinatorics;
window.combinatorics = (...list) => {
  return Combinatorics.cartesianProduct(...list);
};

let hasChangeForm = false;

const ShopNewItens = ({ history }) => {

  const [alert, setAlert] = useState(false);

  const product = useSelector(state => state.products);
  const dispatch = useDispatch();

  const match = useRouteMatch("/shop/produtos/edit/:id");

  const saveProduct = useProduct().product;
  const savePackVariants = useProduct().packVariants;
  const { loadProduct } = useProducts();
  const [unique, setUnique] = useState(null);
  const [defaultVariantId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [descriptionData, setDescriptionData] = useState(product.description);
  const [isPack, setIsPack] = useState(false);
  const [editing, setEditing] = useState(false);

  const swalDefaultOptions = {
    text: "Tem certeza que deseja sair?",
    icon: "question",
    confirmButtonText: "Sim",
    confirmButtonColor: "#0489cc",
    cancelButtonText: "Não",
    cancelButtonColor: "#086899",
    showCancelButton: true,
    showCloseButton: true
  };

  const handleProduct = async content => {
    hasChangeForm = true;
    await dispatch({
      type: "UPDATE_PRODUCT",
      product: { ...product, ...content }
    });
    //
  };

  const handleBackButtonClicked = async () => {
    // let result = await Swal.fire(swalDefaultOptions);
    // if (result.value) {
    hasChangeForm = false;
    dispatch({ type: "RESET_PRODUCT" });
    history.push("/shop/produtos");
    // }
  };

  const defaultVariant = async (variants, product) => {
    if (variants.length >= 1 && product.options.length) {
      let result = await Swal.fire({
        ...swalDefaultOptions,
        text:
          "Você tem variações geradas, alterando apagará todas. Deseja continuar?"
      });

      if (result.dismiss) {
        setUnique(0);
        return false;
      }
    }

    setUnique(1);

    if (variants.length === 0) {
      variants.push({
        id: "",
        sku: "",
        stock: null,
        price: null,
        values: []
      });
    }

    variants = [variants[0]];

    dispatch({ type: "UPDATE_PRODUCT", product: { ...product, variants } });
  };

  const removeDefaultVariant = async () => {
    let defaultVariant = product.variants[0];

    if (
      defaultVariant &&
      (defaultVariant.price || defaultVariant.sku || defaultVariant.stock)
    ) {
      let result = await Swal.fire({
        ...swalDefaultOptions,
        text:
          "Você tem item único gerado, alterando apagará todas informações. Deseja continuar?"
      });

      if (result.dismiss) {
        setUnique(1);
        return false;
      }
    }

    setUnique(0);

    dispatch({
      type: "UPDATE_PRODUCT",
      product: { ...product, variants: [], options: [] }
    });
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      if (!product.variants.length) {
        await defaultVariant(product.variants, product);
      }

      setEditing(product.edit);

      if (match && match.params.id && !product.edit) {
        setEditing(true);
        let query = await loadProduct(match.params.id);

        let { variants, options } = query.product;

        if (variants.length >= 1 && options.length) {
          setUnique(0);
        } else if (variants.length === 1 && !options.length) {
          setUnique(1);
        }

        variants.map(function (variant) {
          variant.price = variant.price / 100;
          variant.list_price = variant.list_price / 100;
          return variant;
        });

        let images = [];

        // eslint-disable-next-line
        query.product.assets.map(item => {
          images.push(item);
        });

        setDescriptionData(query.product.description);

        if (images.length < 4) {
          images = [
            ...images,
            ...Array(4 - images.length).fill({ id: "", url: "" })
          ];
        }

        setIsPack(query.product.type !== "simple");

        dispatch({
          type: "UPDATE_PRODUCT",
          product: {
            ...query.product,
            images,
            enabled: query.product.enabled ? true : false,
            edit: true
          }
        });
      } else {
        let { variants, options, type } = product;
        setIsPack(type !== "simple");
        if (variants.length >= 1 && options.length) {
          setUnique(0);
        } else if (variants.length === 1 && !options.length) {
          setUnique(1);
        }
      }
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ShopLayout>
      <Alert show={alert}>
        <div>Produto salvo com sucesso!</div>
        <div>
          <AlertButton onClick={() => setAlert(false)}>Fechar</AlertButton>
        </div>
      </Alert>
      <Breadcrumbs itens={["Shop", "Produtos", "Novo produto"]} />

      <Card>
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <Icons.back
            style={{ width: "50px", height: "50px" }}
            onClick={() => {
              if (hasChangeForm) {
                handleBackButtonClicked();
              } else {
                dispatch({ type: "RESET_PRODUCT" });
                history.push("/shop/produtos");
              }
            }}
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
              name="isPack"
              value="simple"
              checked={!isPack || product.type === "simple"}
              onChoose={e => {
                setIsPack(false);
                handleProduct({ type: "simple" });
              }}
              style={{ marginLeft: 30, marginBottom: 0 }}
              label="Simples"
            />

            <RadioButton
              type="radio"
              name="isPack"
              value="kit"
              checked={isPack || product.type === "compound"}
              onChoose={e => {
                setIsPack(true);
                handleProduct({ type: "compound" });
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
            <div className="df fdr alic" style={{ width: "100%" }}>
              <div style={{ maxWidth: 200 }}>
                <InputText
                  className="light"
                  text={`Código do ${isPack ? "kit" : "produto"}`}
                  type="text"
                  required
                  label={`Código do ${isPack ? "kit" : "produto"}`}
                  defaultValue={product.code}
                  onInput={({ target }) => {
                    handleProduct({ code: target.value });
                  }}
                />
              </div>
              <div style={{ marginLeft: 30, width: "100%" }}>
                <InputText
                  className="light"
                  text={"Nome"}
                  type="title"
                  required
                  label="Nome"
                  defaultValue={product.name}
                  onInput={({ target }) => {
                    handleProduct({ name: target.value });
                  }}
                />
              </div>
            </div>

            <div style={{ marginLeft: 50 }}>
              <Switch
                isOn={product.enabled}
                label="Visibilidade"
                handleToggle={() => {
                  handleProduct({ enabled: !product.enabled });
                }}
              />
            </div>
          </Col>
        </Row>
        <Line />
        <Line />
        <Row>
          <Col>
            <Label>Fotos</Label>
          </Col>
        </Row>
        <Grid>
          {product.images
            ? product.images.map((image, index) => (
              <Col key={index}>
                <UploadImage
                  url={image.url ? image.url : ""}
                  onChange={imageBase64 => {
                    const images = product.images;
                    images[index] = { id: image.id, url: imageBase64 };
                    handleProduct({ images });
                  }}
                />
              </Col>
            ))
            : null}
        </Grid>
        <Line />
        <Row>
          <Col>
            <RichText
              title="Descrição"
              placeholder="Escreva a descrição aqui"
              onChange={value => {
                setDescriptionData(value);
              }}
              initialValue={product.description}
            />
          </Col>
        </Row>
        <Line />
        <Row>
          <Col>
            <InputKeyValue
              text="Ficha técnica"
              onChange={value => handleProduct({ datasheet: value })}
              defaultValue={product.datasheet}
            />
          </Col>
        </Row>
        <Line />
        {!isPack && (
          <Row>
            {!editing ? (
              <Col className="newItem__radioGroup">
                <div className="df fdr">
                  <Label className="df fdr alic">
                    Variações{" "}
                    {!editing ? (
                      <Tooltip
                        top
                        content="Crie aqui variações como de tamanho, modelo, cor, etc."
                        position="top"
                      >
                        <Icons.info fill="#b2b2b3" />
                      </Tooltip>
                    ) : (
                      ""
                    )}
                  </Label>
                </div>
                <Col>
                  <Radio
                    checked={unique}
                    onClick={async () =>
                      await defaultVariant(product.variants, product)
                    }
                    onChange={() => null}
                  >
                    Produto único
                  </Radio>
                  <Radio
                    checked={!unique}
                    onClick={() => {
                      removeDefaultVariant();
                    }}
                    onChange={() => null}
                    style={{ float: "left" }}
                  >
                    Produto com variações
                  </Radio>
                  &nbsp;&nbsp;{" "}
                </Col>
              </Col>
            ) : null}
            <Col>
              {unique && !editing ? (
                <Col>
                  <div className="df fdr label__typeVariations unique ">
                    <Label>Produto único</Label>
                  </div>
                  <Row>
                    <Col>
                      <InputText
                        className="light"
                        text={"Código"}
                        type="title"
                        required
                        defaultValue={
                          product.variants[defaultVariantId]
                            ? product.variants[defaultVariantId].sku
                            : ""
                        }
                        onInput={({ target }) => {
                          const { variants } = product;
                          variants[defaultVariantId].sku = target.value;
                          handleProduct({ sku: target.value });
                        }}
                      />
                    </Col>
                    <Col className="padding20 paddingLeft paddingRight">
                      <NumberFormat
                        thousandSeparator={false}
                        text={"Estoque"}
                        customInput={InputText}
                        value={
                          product.variants[defaultVariantId]
                            ? product.variants[defaultVariantId].stock
                            : null
                        }
                        className="light"
                        onInput={({ target }) => {
                          const { variants } = product;
                          variants[defaultVariantId].stock = target.value;
                          handleProduct({ stock: target.value });
                        }}
                        required
                      />
                    </Col>
                    <Col className="padding20 paddingLeft">
                      <NumberFormat
                        thousandSeparator={"."}
                        decimalSeparator={","}
                        decimalScale={2}
                        prefix={"R$ "}
                        required
                        text={"Preço"}
                        customInput={InputText}
                        value={
                          product.variants[defaultVariantId] &&
                            product.variants[defaultVariantId].price
                            ? product.variants[defaultVariantId].price
                            : ""
                        }
                        className="light"
                        onValueChange={values => {
                          const { floatValue } = values;
                          const { variants } = product;
                          variants[defaultVariantId].price = floatValue;
                          handleProduct({ price: floatValue });
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              ) : null}
              {editing || !unique ? (
                <Col>
                  <div className="df fdr label__typeVariations withVariatons">
                    <Label>Item com variações</Label>
                  </div>
                  <Row>
                    <Col>
                      <span
                        style={{
                          float: "left",
                          paddingTop: 7,
                          fontSize: 16,
                          color: "#4d4d4d"
                        }}
                      >
                        <div style={{ marginBottom: 10 }}>
                          {product.variants.length} variações
                        </div>

                        <Link
                          style={{
                            color: "#0489cc",
                            fontSize: 12,
                            textDecoration: "none"
                          }}
                          to="#"
                          onClick={() => {
                            handleProduct({
                              description: descriptionData,
                              datasheet: product.datasheet
                            });
                            history.push(
                              product.variants.length
                                ? "/shop/produtos/novo/variacoes/gerenciar"
                                : "/shop/produtos/novo/variacoes"
                            );
                          }}
                        >
                          Editar
                        </Link>
                      </span>
                    </Col>
                  </Row>
                </Col>
              ) : null}
            </Col>
          </Row>
        )}

        {isPack && (
          <>
            <Line />
            <Row>
              <MountKitProducts
                text="Definir Produtos"
                currentType={product.type}
                initialValue={product.pack_variants}
                pack={product.fields}
                onChange={(value, quantity, price, list_price, fields) => {
                  handleProduct({
                    pack: value,
                    quantity_items: quantity,
                    price: price,
                    fields
                  });
                }}
                setPackType={value => handleProduct({ type: value })}
              />
            </Row>
            <Line />
          </>
        )}
        <Line />
        <Row>
          <Col>
            <Label>Atributos</Label>
          </Col>
        </Row>
        <Row>
          <Col>
            {product.facet_values
              ? product.facet_values.map((attr, idx) => (
                <Tag
                  key={idx}
                  color={attr?.color || attr?.facet?.color || "#0489cc"}
                >
                  <span style={{ opacity: 0.5 }}>{attr?.facet?.name}</span>{" "}
                  {attr?.name}
                </Tag>
              ))
              : null}
            <TagButton
              onClick={() => {
                handleProduct({
                  description: descriptionData,
                  datasheet: product.datasheet
                });
                history.push("/shop/produtos/novo/atributos");
              }}
              color="#0489cc"
              invert
            >
              Adicionar {">"}
            </TagButton>
          </Col>
        </Row>

        <Line />
        <Row>
          <Col>
            <Label>Imagem de compartilhamento</Label>
          </Col>
        </Row>
        <Row>
          <Col>
            <UploadImage
              url={product.share_asset ? product.share_asset.url : ""}
              onChange={imageBase64 => {
                handleProduct({ share_image: imageBase64 });
              }}
            />
          </Col>
        </Row>

        <Row>
          <Col></Col>
          <Col>


            <Button
              primary
              disabled={loading}
              loading={loading}
              style={{ float: "right" }}
              onClick={async () => {
                // eslint-disable-next-line
                // const checkName = (value, options) => {
                //   const query = options.filter(option => {
                //     return (
                //       option.values.filter(({ name }) => name === "branco")
                //         .length > 0
                //     );
                //   });

                //   if (query.length > 0) {
                //     return query[0].name;
                //   } else {
                //     return "";
                //   }
                // };

                const productFormatted = {
                  id: product.id,
                  name: product.name,
                  code: product.code,
                  description: descriptionData,
                  type: product.type,
                  quantity_items: product.quantity_items,
                  datasheet: product.datasheet,
                  enabled: product.enabled ? 1 : 0,
                  facet_values: product.facet_values.map(facet => ({
                    id: facet.id
                  })),
                  images: product.images.map(img => ({
                    id: img.id,
                    image: img.url
                  })),
                  share_image: product.share_image,
                  options: product.options.map(option => {
                    option.values = option.values.map(optionValue => {
                      return {
                        id: optionValue.id,
                        name: optionValue.name
                      };
                    });
                    return option;
                  })
                };

                if (editing) {
                  delete productFormatted.options;
                }

                if (!isPack && product.type === "simple") {
                  productFormatted.variants = product.variants.map(variant => {
                    let normalizedVariantToSave = {
                      id: variant.id,
                      sku: variant.sku,
                      stock: parseInt(variant.stock || 0),
                      price: variant.price
                        ? Math.round(parseFloat(variant.price) * 100)
                        : 0,
                      list_price: variant.list_price
                        ? Math.round(parseFloat(variant.list_price) * 100)
                        : 0,
                      enabled: variant.enabled ? 1 : 0,
                      options: variant.values.map(option => {
                        return {
                          id: option.id,
                          name: option.optionName,
                          value: option.name
                        };
                      })
                    };

                    if (unique === 1) {
                      normalizedVariantToSave.name = product.name;
                      normalizedVariantToSave.enabled = 1;
                      // console.log('entrou aqui',normalizedVariantToSave);
                    }

                    return normalizedVariantToSave;
                  });
                } else {
                  let pack_variant = {
                    sku: product.code,
                    name: product.name,
                    price: product.price
                      ? Math.round(parseFloat(product.price) * 100)
                      : 0,
                    list_price: product.list_price
                      ? Math.round(parseFloat(product.list_price) * 100)
                      : 0,
                    enabled: 1
                  };

                  if (
                    product?.variants[0]?.id &&
                    product?.variants[0]?.id !== ""
                  ) {
                    pack_variant.id = product.variants[0].id;
                  }

                  productFormatted.variants = [pack_variant];
                }

                setLoading(true);

                let result = await saveProduct(productFormatted);

                if (result) {
                  if (isPack && product?.pack?.length) {
                    await savePackVariants({
                      product_id: Number(result.saveProduct.id),
                      variants: product.pack.map(variant => {
                        let p = {
                          final_price: Number(variant.final_price) || 0,
                          price: Number(variant.price) || 0,
                          product_variant_id: variant.product_variant_id,
                          quantity: Number(variant.quantity) || 0,
                          setted_price: Number(variant.setted_price) || 0,
                          subtotal: Number(variant.subtotal) || 0
                        };
                        if (variant?.id) {
                          p.id = Number(variant.id);
                        }
                        return p;
                      })
                    });
                  }
                  hasChangeForm = false;
                  TotalStorage.set("returnSaveProductSuccess", true);
                  dispatch({ type: "RESET_PRODUCT" });
                  history.push("/shop/produtos");
                } else {
                  Swal.fire({
                    ...swalDefaultOptions,
                    text:
                      "Erro ao salvar seu produto. Verifique se informou todos os campos e tente novamente. Caso persista, entre em contato com nosso suporte.",
                    icon: "warning",
                    showCancelButton: false,
                    confirmButtonText: "Ok"
                  });
                  setLoading(false);
                }
              }}
            >
              SALVAR PRODUTO
            </Button>

            {/* <Button
              primary
              disabled={loading}
              loading={loading}
              style={{ float: "right", display: 'none'}}
              onClick={async () => {

                const productFormatted = {
                  id: product.id,
                  name: product.name,
                  code: product.code,
                  description: descriptionData,
                  type: product.type,
                  quantity_items: product.quantity_items,
                  datasheet: product.datasheet,
                  enabled: product.enabled ? 1 : 0,
                  facet_values: product.facet_values.map(facet => ({
                    id: facet.id
                  })),
                  images: product.images.map(img => ({
                    id: img.id,
                    image: img.url
                  })),
                  share_image: product.share_image,
                  options: product.options.map(option => {
                    option.values = option.values.map(optionValue => {
                      return {
                        id: optionValue.id,
                        name: optionValue.name
                      };
                    });
                    return option;
                  })
                };

                if (editing) {
                  delete productFormatted.options;
                }

                if (!isPack && product.type === "simple") {
                  productFormatted.variants = product.variants.map(variant => {
                    let normalizedVariantToSave = {
                      id: variant.id,
                      sku: variant.sku,
                      stock: parseInt(variant.stock || 0),
                      price: variant.price
                        ? Math.round(parseFloat(variant.price) * 100)
                        : 0,
                      list_price: variant.list_price
                        ? Math.round(parseFloat(variant.list_price) * 100)
                        : 0,
                      enabled: variant.enabled ? 1 : 0,
                      options: variant.values.map(option => {
                        return {
                          id: option.id,
                          name: option.optionName,
                          value: option.name
                        };
                      })
                    };

                    if (unique === 1) {
                      normalizedVariantToSave.name = product.name;
                      normalizedVariantToSave.enabled = 1;
                      // console.log('entrou aqui',normalizedVariantToSave);
                    }

                    return normalizedVariantToSave;
                  });
                } else {
                  let pack_variant = {
                    sku: product.code,
                    name: product.name,
                    price: product.price
                      ? Math.round(parseFloat(product.price) * 100)
                      : 0,
                    list_price: product.list_price
                      ? Math.round(parseFloat(product.list_price) * 100)
                      : 0,
                    enabled: 1
                  };

                  if (
                    product?.variants[0]?.id &&
                    product?.variants[0]?.id !== ""
                  ) {
                    pack_variant.id = product.variants[0].id;
                  }

                  productFormatted.variants = [pack_variant];
                }

                function toDataUrl(url, callback) {
                  var xhr = new XMLHttpRequest();
                  xhr.onload = function() {
                    var reader = new FileReader();
                    reader.onloadend = function() {
                      callback(reader.result.replace(/^data:.+;base64,/, ''));
                    };
                    reader.readAsDataURL(xhr.response);
                  };
                  xhr.open('GET', url);
                  xhr.responseType = 'blob';
                  xhr.send();
                }

                let imag = '';
                await toDataUrl(product.images[0].url, function(myBase64) {
                  const image64 = `data:image/png;base64,${myBase64}`;
                  imag = image64;

                  console.log(imag);
                  if(imag !== ''){
                    let result =  saveProduct(productFormatted, imag);

                if (result) {
                  // if (isPack && product.pack.length) {
                  //   await savePackVariants({
                  //     product_id: Number(result.saveProduct.id),
                  //     variants: product.pack.map(variant => {
                  //       let p ={
                  //         final_price: Number(variant.final_price) || 0,
                  //         price: Number(variant.price) || 0,
                  //         product_variant_id: variant.product_variant_id,
                  //         quantity: Number(variant.quantity) || 0,
                  //         setted_price: Number(variant.setted_price) || 0,
                  //         subtotal: Number(variant.subtotal) || 0
                  //       };
                  //       if(variant?.id){
                  //         p.id = Number(variant.id);
                  //       }
                  //       return p;
                  //     })
                  //   });
                  // }
                  // hasChangeForm = false;
                  // TotalStorage.set("returnSaveProductSuccess", true);
                  // dispatch({ type: "RESET_PRODUCT" });
                  // history.push("/shop/produtos");
                } else {
                  Swal.fire({
                    ...swalDefaultOptions,
                    text:
                      "Erro ao salvar seu produto. Verifique se informou todos os campos e tente novamente. Caso persista, entre em contato com nosso suporte.",
                    icon: "warning",
                    showCancelButton: false,
                    confirmButtonText: "Ok"
                  });
                  setLoading(false);
                }
                  }

                });




              }}
            >
              image
            </Button> */}

          </Col>
        </Row>
      </Card>
    </ShopLayout>
  );
};

export default withRouter(ShopNewItens);
