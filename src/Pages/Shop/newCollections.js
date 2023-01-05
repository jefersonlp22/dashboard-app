import React, { useState, useEffect } from "react";
import _ from "lodash";

import ShopLayout from "./index";
import {
  Icons,
  InputText,
  InputTextarea,
  InputRadio,
  Button,
  Table,
  Loader,
  Breadcrumbs,
  Switch,
  UploadImage,
  Popover,
  Tag
} from "../../components";
import useForm from "../../customHooks/useForm";

import { useHistory, useRouteMatch } from "react-router-dom";

import {
  useSaveCollection,
  useDeleteCollection
} from "../../gqlEndpoints/mutations";

import {
  useFacets,
  useProductsByFacet,
  useColections,
  useSingleColection
} from "../../gqlEndpoints/queries";

import "./style.scss";

const ShopNewCollections = () => {
  const history = useHistory();
  let match = useRouteMatch("/shop/colecoes/editar/:id");
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [attributesSeted, setAttribute] = useState([]);
  const [searchedAttributes, setSearchedAttribute] = useState([]);
  const [tags, setTags] = useState([]);
  const [facets, setFacets] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [textResult, setTextResult] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [products, setProducts] = useState([]);
  const { loadCollections } = useColections();
  const { loadCollectionById } = useSingleColection();
  const { deleteCollection } = useDeleteCollection();
  const [collections, setCollections] = useState([]);
  const [singleCollection, setSingleCollection] = useState({});
  const { saveCollection } = useSaveCollection();
  const { loadFacets } = useFacets();
  const { loadProductsByFacet } = useProductsByFacet();

  const { inputs, handleInputChange, handleRadioChange } = useForm();

  function search(e) {
    let results = [];

    // eslint-disable-next-line array-callback-return
    results = tags.filter(i => {
      if (i.name) {
        const itemData = `${i.name.toUpperCase()}`;
        const textData = e.current.value.toUpperCase();
        return itemData.indexOf(textData) > -1;
      }
    });

    setSearchText(e.current.value);
    setSearchedAttribute([...results]);
  }

  useEffect(() => {
    inputs.enabled = enabled ? 1 : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => {
    setLoading(true);
    getFacets();
    getCollections();

    if (match && match.params.id) {
      getCollectionById(match.params.id);
    }
    async function getFacets() {
      let result_facets = await loadFacets(200);

      let tags = [];
      // eslint-disable-next-line array-callback-return
      result_facets.facets.data.map((facet, index) => {
        if (facet.values.length > 0) {
          facet.values.forEach(value => {
            tags.push({
              attribute: facet.name,
              id: value.id,
              name: value.name
            });
          });
        }
      });
      setTags([...tags]);
      setFacets([...tags]);
    }

    async function getCollections() {
      let collectionsLoaded = await loadCollections(40);

      let _root = collectionsLoaded.collections.data.filter(
        i => i.is_root === 1
      );

      inputs.parent_id = Number(_root[0]?.id);

      setTimeout(() => {
        setCollections(collectionsLoaded.collections.data);
      }, 300);

      if (match === undefined) setLoading(false);
    }

    async function getCollectionById(id) {
      let result = await loadCollectionById(id);
      setSingleCollection(result.collection);
      setLoading(false);
    }

    inputs.condition = "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   *
   * EDITAR
   *
   */

  useEffect(() => {
    setLoading(true);
    if (singleCollection) {
      inputs.id = singleCollection.id;
      inputs.name = singleCollection.name;
      inputs.description = singleCollection.description;
      inputs.condition = singleCollection.condition;
      inputs.parent_id = singleCollection.parent_id;
      inputs.image_url =
        singleCollection &&
          singleCollection.featured_asset &&
          singleCollection.featured_asset.url
          ? singleCollection.featured_asset.url
          : "";
      inputs.image =
        singleCollection &&
          singleCollection.featured_asset &&
          singleCollection.featured_asset.url
          ? ""
          : "";
      setEnabled(singleCollection.enabled);
      let facetas = [];
      let facetsToQueryProds = [];
      if (
        singleCollection &&
        singleCollection.hasOwnProperty("facet_values") &&
        singleCollection.facet_values.length > 0
      ) {
        // eslint-disable-next-line array-callback-return
        singleCollection.facet_values.map(facet => {
          let newFacet = {};
          newFacet.attribute = facet?.facet?.name;
          newFacet.id = facet.id;
          newFacet.name = facet.name;
          facetas.push(newFacet);
          facetsToQueryProds.push({ id: facet.id });
        });
      }

      inputs.facets = facetsToQueryProds;

      let diff = _.differenceWith(facets, facetas, _.isEqual);
      setTags(diff);
      setAttribute(facetas);
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleCollection]);

  useEffect(() => {
    inputs.facets = [];
    if (attributesSeted.length === 0) {
      setTags([...facets]);
      setProducts([]);
      setTotalProducts(0);
    } else {
      //Separe facets to save  && products
      // eslint-disable-next-line array-callback-return
      attributesSeted.map(attribute => {
        inputs.facets.push({ id: attribute.id });
      });
    }
    if (inputs && inputs.hasOwnProperty("facets") && inputs.facets.length > 0) {
      getProductByFacet(inputs.facets, inputs.condition || "or");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributesSeted, inputs.condition]);

  async function getProductByFacet(facetsArray, condition) {
    let tipo = typeof facetsArray;
    let resultProducts = [];
    if (tipo === "object") {
      let s = JSON.stringify([...facetsArray]);
      resultProducts = await loadProductsByFacet(
        s.replace(/"/g, ""),
        condition
      );
    } else {
      resultProducts = await loadProductsByFacet(facetsArray, condition);
    }
    setProducts(resultProducts);
    console.log("resultProducts", resultProducts);
    setTotalProducts(resultProducts.length);
  }

  useEffect(() => {
    if (searchText !== "") {
      if (searchedAttributes.length > 0) {
        let tagsFound = `${searchedAttributes.length} resultados para '${searchText}'`;
        setTextResult(tagsFound);
        setTags(searchedAttributes);
      } else {
        let tagsFound = `Nenhum resultado para '${searchText}'`;
        setTextResult(tagsFound);
        setTags([]);
      }
    } else {
      setTextResult("");
      setTags(facets);
      if (attributesSeted.length > 0) {
        let diff = _.differenceWith(facets, attributesSeted, _.isEqual);
        setTags(diff);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedAttributes]);

  async function handleSave() {
    setLoading(true);
    let serialize = {
      name:
        inputs && inputs.hasOwnProperty("name")
          ? typeof inputs.name === "object"
            ? inputs.name[0]
            : inputs.name
          : "",
      description:
        inputs && inputs.hasOwnProperty("description")
          ? typeof inputs.description === "object"
            ? inputs.description[0]
            : inputs.description
          : "",
      condition:
        inputs && inputs.hasOwnProperty("condition")
          ? typeof inputs.condition === "object"
            ? inputs.condition[0]
            : inputs.condition
          : "",
      facets: inputs.facets.length > 0 ? inputs.facets : "",
      enabled: enabled === undefined ? 1 : inputs.enabled,
      image: inputs && inputs.hasOwnProperty("image") ? inputs.image : "",
      parent_id:
        inputs.parent_id === undefined
          ? 1
          : typeof inputs.parent_id === "object"
            ? Number.parseInt(inputs.parent_id[0], 10)
            : inputs.parent_id
    };

    if (inputs && inputs.id) {
      serialize.id = Number.parseInt(inputs.id, 10);
    }

    if (serialize?.description?.length && serialize?.description !== "") {
      serialize.description = serialize.description
        .replace(/"/g, '\\"')
        .replace(/'/g, "`");
    }

    let invalid = false;
    if (serialize.name === undefined || serialize.name === "") {
      invalid = true;
    } else if (
      serialize.description === undefined ||
      serialize.description === ""
    ) {
      invalid = true;
    } else if (
      serialize.condition === undefined ||
      serialize.condition === ""
    ) {
      invalid = true;
    } else if (
      serialize.facets === undefined ||
      serialize.facets.length <= 0 ||
      serialize.facets === ""
    ) {
      invalid = true;
    }

    if (inputs.facets.length > 0) {
      let s = JSON.stringify([...inputs.facets]);
      inputs.facets = s.replace(/"/g, "");
      serialize.facets = inputs.facets;
    }

    if (invalid === false) {
      let save = await saveCollection(serialize);
      if (save) {
        setTimeout(() => {
          history.replace({ pathname: "/shop/colecoes" });
        }, 300);
      }
    } else {
      serialize = {};
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);

    let deleted = {};

    if (inputs && inputs.hasOwnProperty("id")) {
      deleted = await deleteCollection(Number.parseInt(inputs.id, 10));
    }
    if (deleted) {
      setTimeout(() => {
        history.replace({ pathname: "/shop/colecoes" });
      }, 300);
    } else {
      setLoading(false);
    }
  }

  return loading ? (
    <ShopLayout>
      <Loader active={true} />
    </ShopLayout>
  ) : (
    <ShopLayout>
      <Breadcrumbs itens={["Shop", "Coleções", "Nova coleção"]} />

      <ShopLayout.content className="df fdc collections__content">
        <div className="collections--returnWrapper">
          <div
            className="collections--iconBack"
            onClick={() => history.replace({ pathname: "/shop/colecoes" })}
          >
            <Icons.back fill="#4d4d4d" />
          </div>
        </div>

        <div className="df fdr collections__form">
          <form>
            <h2 className="collections__form--title">
              {match ? "Editar" : "Nova"} Coleção
            </h2>
            <InputText
              text={
                <span>
                  Título<span style={{ color: "red" }}>*</span>
                </span>
              }
              name="name"
              type="text"
              required
              value={inputs.name || ""}
              onChange={e => handleInputChange(e)}
              className="login_input"
            />

            <InputTextarea
              text={
                <span>
                  Descrição<span style={{ color: "red" }}>*</span>
                </span>
              }
              value={inputs.description}
              name="description"
              onChange={e => handleInputChange(e)}
            />

            <div className="df fdr alic collections__radioGroup">
              <span className="collections__radioGroup--title">
                Atributos<span style={{ color: "red" }}>*</span>
              </span>
              <InputRadio
                name="condition"
                value="and"
                checked={inputs.condition === "and"}
                labelClass="collections__radioGroup--label"
                onChange={e => {
                  handleRadioChange(e);
                  getProductByFacet(inputs.facets, inputs.condition || "or");
                }}
              >
                Contém Todos
              </InputRadio>
              <InputRadio
                name="condition"
                value="or"
                checked={inputs.condition === "or"}
                labelClass="collections__radioGroup--label"
                onChange={e => {
                  handleRadioChange(e);

                  let s = JSON.stringify([...inputs.facets]);
                  getProductByFacet(
                    s.replace(/"/g, ""),
                    inputs.condition || "or"
                  );
                }}
              >
                Contém Qualquer
              </InputRadio>
            </div>

            <div className="df fdr collections__tagCloud">
              {attributesSeted && attributesSeted.length > 0
                ? attributesSeted.map((tag, index) => (
                  <Tag
                    key={`tag${index}`}
                    color="#0489cc"
                    invert
                    className="cursorPointer"
                  >
                    <span className="collections__tag--areaLabel">
                      {tag.attribute}
                    </span>{" "}
                    {tag.name}
                    <span
                      className="collections__tag--closeIcon"
                      onClick={() => {
                        setTags([...tags, tag]);
                        let auxToSplice = attributesSeted;
                        auxToSplice.splice(index, 1);
                        setAttribute([...auxToSplice]);
                      }}
                    >
                      x
                    </span>
                  </Tag>
                ))
                : null}

              <Popover
                headerSearch={true}
                searchOnChange={e => {
                  search(e);
                }}
                top
                content={
                  <div className="collections__tagsSearch">
                    {textResult !== "" ? (
                      <span className="collections__tagsSearch--resultText">
                        {textResult}
                      </span>
                    ) : null}
                    {tags.map((tag, index) => (
                      <Tag
                        key={`tag${index}`}
                        color="#0489cc"
                        invert
                        className="cursorPointer"
                        disabled={tag.disabled}
                        onClick={() => {
                          setAttribute([...attributesSeted, tag]);
                          tags.splice(index, 1);
                        }}
                      >
                        <span className="collections__tag--areaLabel">
                          {tag.attribute}
                        </span>{" "}
                        {tag.name}
                      </Tag>
                    ))}
                  </div>
                }
              >
                <Tag color="#0489cc" invert>
                  Adicionar {`>`}
                </Tag>
              </Popover>
            </div>

            <div className="collections__itensFoundCounter">
              {totalProducts} produtos encontrados.
            </div>
          </form>
          <div className="collections__form--right">
            <div className="collections__setVisibility switcher">
              <Switch
                isOn={enabled}
                label="Visibilidade"
                activeStateLabel="Visivel"
                inactiveStateLabel="Oculto"
                handleToggle={() => {
                  let value = enabled === undefined ? true : enabled;
                  setEnabled(!value);
                }}
              />
            </div>

            <div className="collections__imgCollection">
              <UploadImage
                name="image"
                url={
                  inputs && inputs.hasOwnProperty("image_url")
                    ? inputs.image_url
                    : ""
                }
                onChange={image => {
                  inputs.image = image;
                }}
              />
            </div>

            <label className="collections__setParentCollection">
              <span className="title">Incluir dentro de:</span>

              <select
                name="parent_id"
                onChange={handleInputChange}
                className="input__select"
                value={inputs.parent_id}
              >
                {collections.map((item, index) => (
                  <option key={`u${index}`} value={item.id}>
                    {item.is_root === 1 ? "Raiz" : item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="df fdr jc-sb alic">
          <div className="collections__cancelActionCollection">
            {match ? (
              <div
                onClick={() => {
                  handleDelete();
                }}
              >
                Excluir coleção
              </div>
            ) : null}
          </div>
          <Button
            className="success collectionSave"
            style={{ width: 150, marginBottom: 20 }}
            onClick={e => handleSave(e)}
            disabled={loading}
          >
            Salvar
          </Button>
        </div>

        {products && products.length > 0 ? (
          <div
            className="df fdr jc-sb alic tableCollection__seeItens"
            style={{ marginBottom: 30 }}
          >
            <Table headers={["Código", "Título"]}>
              {products.map((item, rowIndex) => (
                <Table.tr key={`row${rowIndex}`}>
                  <Table.td>{item.code}</Table.td>
                  <Table.td>{item.name}</Table.td>
                </Table.tr>
              ))}
            </Table>
          </div>
        ) : (
          <></>
        )}
      </ShopLayout.content>
    </ShopLayout>
  );
};

export default ShopNewCollections;
