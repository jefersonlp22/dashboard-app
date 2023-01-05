import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Swal from "sweetalert2";

import _ from "lodash";

import ShopLayout from "../index";

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
  Loader
} from "../../../components";

import { useFacet } from "../../../gqlEndpoints/mutations/facets";
import { useFacets } from "../../../gqlEndpoints/queries/getFacets";

import "./manageAttributes.scss";

const ShopManageAttributes = ({ history }) => {
  const { facet, deleteFacet } = useFacet();
  const { loadFacets } = useFacets();
  const [originalData, setOriginalData] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [toSave, setToSave] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // OBS.: Esses as duas funções estão repetidas pq,
    // por algum motivo ainda não identifiicado os states de originalData e attributes
    // estão referenciando um ao outro, qnd corre mudança em um afeta o outro e vice-versa,
    // até achar uma solução não modificar a forma como está feito
    loadFacets(200).then(facets => {
      setAttributes(facets.facets.data);
    });

    loadFacets(200).then(facets => {
      setOriginalData(facets.facets.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addVariant = () => {
    setAttributes([
      ...attributes,
      { name: "", color: "#0489cc", values: [], visible: 1 }
    ]);
  };

  const handleType = (index, text) => {
    let temp = attributes;
    temp[index].name = text;
    setAttributes([...temp]);

    let checkChange = _.isEqual(originalData[index], attributes[index]);

    if (checkChange === false) {
      let tempToSave = toSave;
      tempToSave[index] = temp[index];
      setToSave([...tempToSave]);
    } else {
      delete toSave[index];
      _.remove(toSave, e => e === undefined || e === "empty");
    }
  };

  const handleVisible = index => {
    let temp = attributes;
    if (
      temp[index].visible === 1 ||
      temp[index].visible === undefined ||
      temp[index].visible === true
    ) {
      temp[index].visible = 0;
    } else {
      temp[index].visible = 1;
    }
    setAttributes([...temp]);

    let checkChange = _.isEqual(originalData[index], attributes[index]);

    if (checkChange === false) {
      let tempToSave = toSave;
      tempToSave[index] = temp[index];
      setToSave([...tempToSave]);
    } else {
      delete toSave[index];
      _.remove(toSave, e => e === undefined || e === "empty");
    }
  };

  const handleColor = (index, color) => {
    let temp = attributes;
    temp[index].color = color;
    setAttributes([...temp]);

    let checkChange = _.isEqual(originalData[index], attributes[index]);

    if (checkChange === false) {
      let tempToSave = toSave;
      tempToSave[index] = temp[index];
      setToSave([...tempToSave]);
    } else {
      delete toSave[index];
      _.remove(toSave, e => e === undefined || e === "empty");
    }
  };

  const handleVariantValue = (index, valueIndex, text) => {
    let temp = attributes;
    temp[index].values[valueIndex].name = text;
    setAttributes([...temp]);

    let checkChange = _(originalData[index].values)
      .differenceWith(attributes[index].values, _.isEqual)
      .isEmpty();

    if (checkChange === false) {
      let tempToSave = toSave;
      tempToSave[index] = temp[index];
      setToSave([...tempToSave]);
    } else {
      delete toSave[index];
      _.remove(toSave, e => e === undefined || e === "empty");
    }
  };

  const addVariantValue = async (id, index, text, e) => {
    e.currentTarget.textContent = "";

    let temp = attributes;
    temp[index].values.push({ id: "", name: text.trim() });
    setAttributes([...temp]);

    let checkChange = originalData[index]
      ? _.isEqual(originalData[index].values, attributes[index].values)
      : false;

    if (checkChange === false) {
      let tempToSave = toSave;
      tempToSave[index] = temp[index];
      setToSave([...tempToSave]);
    } else {
      delete toSave[index];
      _.remove(toSave, e => e === undefined || e === "empty");
    }
  };

  const removeVariantValue = (id, index, valueIndex) => {
    let temp = attributes;

    delete temp[index].values[valueIndex];

    let tempValues = temp[index].values.filter(
      e => e !== undefined || e !== "empty"
    );

    temp[index].values = tempValues;

    setAttributes([...temp]);

    let checkChange = _.isEqual(
      originalData[index].values,
      attributes[index].values
    );

    if (checkChange === false) {
      let tempToSave = toSave;
      tempToSave[index] = temp[index];
      setToSave([...tempToSave]);
    } else {
      delete toSave[index];
      _.remove(toSave, e => e === undefined || e === "empty");
    }
  };

  const removeVariant = async (id, index) => {
    let swalResult = await Swal.fire({
      text: "Tem certeza que deseja remover este atributo?",
      icon: "warning",
      confirmButtonText: "Sim",
      confirmButtonColor: "#0489cc",
      cancelButtonText: "Não",
      cancelButtonColor: "#086899",
      showCancelButton: true,
      showCloseButton: true
    });

    if (id === "temporary") {
      let temp = attributes;

      delete temp[index];
      delete toSave[index];
      _.remove(temp, e => e === undefined || e === "empty");
      _.remove(toSave, e => e === undefined || e === "empty");

      setAttributes([...temp]);
    } else {
      if (id && swalResult.value) {
        setLoading(true);
        await deleteFacet(id);
        loadFacets(200).then(facets => {
          setAttributes(facets.facets.data);
        });
        loadFacets(200).then(facets => {
          setOriginalData(facets.facets.data);
        });
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    let cleared = toSave.filter(e => e !== undefined);
    if (cleared.length > 0) {
      setLoading(true);

      for (let currentFacet of cleared) {
        let item = {
          name: currentFacet.name,
          values: currentFacet.values,
          visible: currentFacet.visible,
          color: currentFacet.color
        };

        if (currentFacet.id) {
          item.id = currentFacet.id;
        }
        await facet(item);
      }
      loadFacets(200).then(facets => {
        setAttributes(facets.facets.data);
      });
      loadFacets(200).then(facets => {
        setOriginalData(facets.facets.data);
      });
      setToSave([]);
      setLoading(false);
    }
  };

  return loading ? (
    <Loader color="#0489cc" active={true} />
  ) : (
    <ShopLayout>
      <Breadcrumbs
        itens={["Shop", "Catálogo", "Itens", "Gerenciador de atributos"]}
      />
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
            <div className="card__title">Gerenciador de Atributos</div>
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

          {attributes.map((facet, index) => (
            <Tr key={`tt-${index}`}>
              <Td>
                <SimpleTag
                  color={facet.color || "#0489cc"}
                  data-id={facet.id}
                  data-index={index}
                  value={facet.name}
                  icon={<Icons.pencil fill={"#FFF"} />}
                  onEnter={(text, e, id) => {
                    handleType(index, text);
                  }}
                  editable
                />
              </Td>
              <Td>
                {facet.values.length > 0
                  ? facet.values.map((value, valueIndex) => (
                      <SelectableTag
                        selected={false}
                        clickable={false}
                        key={`vl-${valueIndex}`}
                        data-id={facet.id}
                        data-index={index}
                        color={facet.color || "#0489cc"}
                        onEnter={({ content, changeEditableState, id }) => {
                          changeEditableState();
                          handleVariantValue(index, valueIndex, content);
                        }}
                        onDelete={id =>
                          removeVariantValue(id, index, valueIndex)
                        }
                        value={value.name}
                      />
                    ))
                  : null}

                <SimpleTag
                  color={facet.color || "#0489cc"}
                  data-id={facet.id}
                  value=""
                  onEnter={(text, e, id) => {
                    if (!!text && text !== "      " && text !== " ") {
                      addVariantValue(id, index, text, e);
                    }
                  }}
                  editable
                  invert
                  icon={<Icons.next fill={facet.color || "#0489cc"} />}
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
                          isOn={facet.visible === 1 ? true : false}
                          multipleKey={`${index}`}
                          handleToggle={(e, index) => {
                            handleVisible(index);
                          }}
                        />
                      </PopoverItem>
                      <PopoverItem>
                        Alterar Cor
                        <input
                          type="color"
                          value={facet.color || "#0489cc"}
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
                  fill="#c8c7cc"
                  onClick={() => removeVariant(facet.id || "temporary", index)}
                />
              </Td>
            </Tr>
          ))}
        </InnerTable>

        <Row className="df jc-end mTop30">
          <Col className="subtitle">
            Tecle ENTER para salvar e ESC para cancelar.
          </Col>
          <div
            className={`df fdr alic facetsSaveButton ${
              toSave.length > 0 ? " activeSaveButton " : " disableSaveButton "
            }`}
          >
            {toSave.length > 0 ? (
              <div className="facetsSaveButton-text">
                Você realizou alterações
              </div>
            ) : null}
            <Button
              className="success"
              disabled={toSave.length <= 0}
              onClick={() => {
                handleSave();
              }}
            >
              SALVAR
            </Button>
          </div>
        </Row>
      </Card>
    </ShopLayout>
  );
};

export default withRouter(ShopManageAttributes);
