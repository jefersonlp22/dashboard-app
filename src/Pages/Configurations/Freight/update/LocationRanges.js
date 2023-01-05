import React, { useState, useEffect, useContext } from "react";
import {
  useGetStateList,
  useGetZipRangeList,
} from "../../../../hooks-api/useLocals";
import Select from "react-select";
import {
  Icons,
  Row,
  Loader,
  Line,
  Switch,
  NumberField2,
  FormField,
} from "../../../../components";
import { FreightContext } from "./FreightContext";
import { CepRange } from "./ceprange";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import _ from "lodash";
import "./styles.scss";

function LocationRanges({ isNewRange, setScreen, ...props }) {
  const { updateData, setUpdatedata } = useContext(FreightContext);
  const [current, setCurrent] = useState({});
  const [state, setState] = useState(false);  
  const [currentDistrict, setCurrentDistrict] = useState(false);
  const { data: stateList, loading: loadingStates } = useGetStateList();
  const [allCep, setAllCep] = useState("ALL");

  const [
    getCitys,
    { data: citys, loading: loadingCitys },
  ] = useGetZipRangeList();

  const [statesOptions, setStatesOptions] = useState([]);
  const [citysOptions, setCitysOptions] = useState([]);

  const FormValidation = () => {
    return allCep === "ALL"
      ? Yup.object().shape({
          name: Yup.string().required("Defina um nome"),
          uf_id: Yup.string().required("Selecione o estado"),
        })
      : Yup.object().shape({
          name: Yup.string().required("Defina um nome"),
        });
  };

  const findMinPostalCode = (array) => {
    if (array.length >= 2) {
      let minor =
        array.reduce((a, b) => {
          if (Number(b?.from_cep) < Number(a?.from_cep)) a = b;
          return a?.from_cep;
        }) || "";
      return minor;
    } else if (array.length === 1) {
      return array[0]?.from_cep;
    }
    return "";
  };

  const findMaxPostalCode = (array) => {
    if (array.length >= 2) {
      let max =
        array.reduce((a, b) => {
          if (Number(b?.to_cep) > Number(a?.to_cep)) a = b;
          return a?.to_cep;
        }) || "";
      return max;
    } else if (array.length === 1) {
      return array[0]?.to_cep;
    }
    return "";
  };

  useEffect(() => {
    if (stateList?.stateList?.length) {
      setStatesOptions(
        stateList?.stateList?.map((state) => ({
          value: {
            id: Number(state.uf_id),
            from_cep: findMinPostalCode(state?.location_range),
            to_cep: findMaxPostalCode(state?.location_range),
          },
          label: `${state.uf_sigla} - ${state.uf_nome}`,
        }))
      );
    }

    if (citys?.zipRangeList) {

      let auxOptions = citys?.zipRangeList?.map((city) => ({
        value: {
          id: Number(city.id),
          from_cep: city.cep_inicial,
          to_cep: city.cep_final,
        },
        label: `${city.localidade}`,
      }));

      setCitysOptions([
        { value: "all", label: "Todos municípios" },
        ...auxOptions,
      ]);
    }
  }, [stateList, citys]);

  useEffect(() => {
    if (isNewRange?.index > -1 && updateData?.settings[isNewRange?.index]) {
      const currentToEdit = updateData?.settings[isNewRange?.index];
      setCurrent(currentToEdit);
      setAllCep(currentToEdit?.zip_code_inclusion);
    }
  }, [updateData, isNewRange]);

  useEffect(() => {
    if (current?.uf_id && stateList?.stateList?.length) {
      let findState = stateList?.stateList?.filter(
        (s) => Number(s.uf_id) === Number(current?.uf_id)
      );
      if (findState?.length) {        
        setState({
          value: { 
            from_cep: findState[0].location_range[0].from_cep,
            to_cep: findState[0].location_range[0].to_cep
        },
          label: `${findState[0].uf_sigla} - ${findState[0].uf_nome}`,
        });
      }
      getCitys({
        variables: {
          uf_id: current?.uf_id,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, stateList]);

  useEffect(() => {
    if (current?.zip_range_id && citys?.zipRangeList?.length) {
      if (current?.zip_range_id) {     
        let findDistrict = citys?.zipRangeList?.filter(
          (city) => Number(city.id) === Number(current?.zip_range_id)
        );
        if (findDistrict?.length) {
          setCurrentDistrict({
            value: {
              id: Number(findDistrict[0].id),
              from_cep: findDistrict[0].cep_inicial,
              to_cep: findDistrict[0].cep_final,
            },
            label: `${findDistrict[0].localidade}`,
          });          
        }
      }     
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, citys]);

  const handleSave = (values) => {
    const serialized = {
      name: values.name,
      type_value: values.type_value,
      value: Math.round(parseFloat(values.value) * 100),
      days_to_delivery: values.days_to_delivery,
      maximum_items: values.maximum_items,
      minimum_items: values.minimum_items,
      zip_code_inclusion: values.zip_code_inclusion,
      has_min_amount_free: values?.has_min_amount_free,
      min_amount_free: Math.round(parseFloat(values?.min_amount_free) * 100),
    };

    if (values?.id) {
      serialized.id = values.id;
    }

    if (values.zip_code_inclusion === "ALL") {
      serialized.uf_id = values?.uf?.id || values?.uf_id;

      if (values.city && values.city !== "all") {
        serialized.zip_range_id = values.city.id;
        serialized.shipping_setting_zip_range = [
          {
            from_cep: values.city.from_cep,
            to_cep: values.city.to_cep,
          },
        ];        
      } else if (values.uf) {        
        serialized.zip_range_id = "";
        serialized.shipping_setting_zip_range = [
          {
            from_cep: values.uf.from_cep,
            to_cep: values.uf.to_cep,
          },
        ];        
      } else {        
        serialized.zip_range_id = "";
        serialized.shipping_setting_zip_range = [
          {
            from_cep: state.value.from_cep,
            to_cep: state.value.to_cep,
          },
        ];
      }


    } else {
      serialized.uf_id = "";
      serialized.zip_range_id = "";
      serialized.shipping_setting_zip_range = values.shipping_setting_zip_range;
    }

    let updated = _.cloneDeep(updateData);

    if (isNewRange.isNew) {
      updated.settings.push(serialized);
    } else if (isNewRange?.index > -1) {
      updated.settings[isNewRange.index] = serialized;
    }

    setUpdatedata({ ...updated });
    setScreen("default");
  };

  if (loadingStates) {
    return <Loader active={true} />;
  }

  return (
    <Formik
      initialValues={{
        ...current,
        name: current?.name || "",
        value: current?.value / 100 || 0,
        type_value: current?.type_value || "PRICE",
        days_to_delivery: current?.days_to_delivery || 0,
        minimum_items: current?.minimum_items || 0,
        maximum_items: current?.maximum_items || 0,
        has_min_amount_free: current?.has_min_amount_free || false,
        min_amount_free: current?.min_amount_free / 100 || 0,
        shipping_setting_zip_range: current?.shipping_setting_zip_range || [],
        uf: null,
        city: null,
        zip_code_inclusion: current?.zip_code_inclusion || "ALL",
      }}
      validationSchema={FormValidation()}
      enableReinitialize={true}
      onSubmit={handleSave}
    >
      {({ ...props }) => {
        return (
          <Form className="bonus--wrapper">
            <div className="newFreight">
              <div className="newFreight--board">
                <div className="newFreight--returnWrapper">
                  <div
                    className="newFreight--iconBack"
                    onClick={() => setScreen("default")}
                  >
                    <Icons.back />
                  </div>
                </div>

                <Line />
                <div className="modal_create-location">
                  <Row className="modal_header df fdr  alic">
                    <div className="df fdr jc-start alic">
                      <h1>Faixas de localização</h1>
                    </div>
                  </Row>

                  <FormField
                    text="Nome"
                    required
                    isRequired
                    className="login_input"
                    name="name"
                    type="text"
                    value={props.values.name}
                  />

                  <div>
                    <div className="df padding40 paddingRight box_range--title">
                      <p>Definição de localização</p>
                    </div>
                    <div className="price">
                      <Row className="input_radio">
                        <div className="input_radio-price df fdr alic">
                          <label
                            className="container"
                            style={{ marginRight: 20 }}
                          >
                            Por localidade
                            <input
                              defaultChecked={
                                props?.values?.zip_code_inclusion === "ALL"
                              }
                              type="radio"
                              name="zip_code_inclusion"
                              value="ALL"
                              onChange={(e) => {
                                props.setFieldValue(
                                  "zip_code_inclusion",
                                  e.target.value
                                );
                                setAllCep("ALL");
                              }}
                            />
                            <span className="checkmarkRadio"></span>
                          </label>
                          <label className="container">
                            Por faixas de CEP
                            <input
                              type="radio"
                              defaultChecked={
                                props?.values?.zip_code_inclusion === "SPECIFIC"
                              }
                              name="zip_code_inclusion"
                              value="SPECIFIC"
                              onChange={(e) => {
                                props.setFieldValue(
                                  "zip_code_inclusion",
                                  e.target.value
                                );
                                setAllCep("SPECIFIC");
                                props.setFieldValue("uf", "");
                                props.setFieldValue("uf_id", "");
                                setState("");
                                props.setFieldValue(
                                  "shipping_setting_zip_range",
                                []
                                );
                              }}
                            />
                            <span className="checkmarkRadio"></span>
                          </label>
                        </div>
                      </Row>
                    </div>
                  </div>

                  <Line />
                  <div
                    style={{
                      display:
                        props?.values?.zip_code_inclusion === "ALL"
                          ? "block"
                          : "none",
                    }}
                  >
                    <div className="df fdr alic">
                      <div>
                        <p
                          className="titleLabelFreight"
                          style={{
                            color: props.errors[
                              props.values.zip_code_inclusion === "SPECIFIC"
                                ? ""
                                : "uf_id"
                            ]
                              ? "#ff6f6f"
                              : "#9b9b9b",
                          }}
                        >
                          {allCep === "ALL" && (
                            <span style={{ color: "red" }}>* </span>
                          )}
                          Localização
                        </p>
                        <div className="df fdr alic">
                          {statesOptions?.length ? (
                            <Select
                              onChange={(value) => {
                                props.setFieldValue("uf", value.value);
                                props.setFieldValue("uf_id", value?.value?.id);
                                setCitysOptions([]);
                                setCurrentDistrict(false);
                                getCitys({
                                  variables: {
                                    uf_id: value.value.id,
                                  },
                                });
                              }}
                              defaultValue={state || ""}
                              isLoading={loadingStates}
                              name="uf"
                              isSearchable={true}
                              classNamePrefix="top__select1--Select"
                              className={
                                props?.errors[
                                  props.values.zip_code_inclusion === "SPECIFIC"
                                    ? ""
                                    : "uf_id"
                                ]
                                  ? "selectInputError"
                                  : ""
                              }
                              options={statesOptions}
                              placeholder="Selecione um estado"
                              isDisabled={loadingStates}
                            />
                          ) : null}

                          {citysOptions?.length ? (
                            <Select
                              onChange={(value) => {
                                props.setFieldValue("city", value.value);
                              }}
                              defaultValue={currentDistrict || ""}
                              isLoading={loadingCitys}                              
                              isSearchable={true}
                              classNamePrefix="top__select2--Select"
                              options={citysOptions}
                              placeholder="Selecione um municipio"
                              isDisabled={citysOptions?.length < 1 || loadingCitys}
                            />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display:
                        props?.values?.zip_code_inclusion === "SPECIFIC"
                          ? "block"
                          : "none",
                    }}
                  >
                    <Row>
                      <CepRange
                        text="Faixas de CEP"
                        onChange={(value) => {
                          props.setFieldValue(
                            "shipping_setting_zip_range",
                            value
                          );
                        }}
                        defaultValue={props?.values?.shipping_setting_zip_range}
                      />
                    </Row>
                  </div>

                  <Line />

                  <div className="df fdr mBottom10 mTop20 alic jc-start">
                    <div className="df padding40 paddingRight box_range--title">
                      <p>Incluir regra de frete grátis para essa localidade.</p>
                    </div>
                    <div className="padding40 paddingLeft">
                      <Switch
                        isOn={props?.values?.has_min_amount_free}
                        label="Status"
                        activeStateLabel="Ativo"
                        inactiveStateLabel="Inativo"
                        handleToggle={() => {
                          props.setFieldValue(
                            "has_min_amount_free",
                            !props?.values?.has_min_amount_free
                          );
                        }}
                      />
                    </div>
                  </div>

                  <div className="df fdr alic">
                    <div className="price">
                      <p>Preço</p>
                      <Row className="input_radio">
                        <div className="input_radio-price">
                          <label className="container">
                            Valor fixo
                            <input
                              defaultChecked={
                                props?.values?.type_value === "PRICE"
                              }
                              type="radio"
                              name="type_value"
                              value="PRICE"
                              onChange={(e) => {
                                props.setFieldValue(
                                  "type_value",
                                  e.target.value
                                );
                              }}
                            />
                            <span className="checkmarkRadio"></span>
                          </label>
                          <label className="container">
                            Valor variável
                            <input
                              type="radio"
                              defaultChecked={
                                props?.values?.type_value === "PERCENTAGE"
                              }
                              name="type_value"
                              value="PERCENTAGE"
                              onChange={(e) => {
                                props.setFieldValue(
                                  "type_value",
                                  e.target.value
                                );
                              }}
                            />
                            <span className="checkmarkRadio"></span>
                          </label>
                        </div>
                        <div>
                          <NumberField2
                            text={
                              props?.values?.type_value === "PRICE"
                                ? "Valor Fixo"
                                : "Valor Variável"
                            }
                            name="value"
                            format={
                              props?.values?.type_value === "PRICE"
                                ? {
                                    thousandSeparator: ".",
                                    decimalSeparator: ",",
                                    prefix: "R$ ",
                                    decimalScale: 2,
                                  }
                                : {
                                    thousandSeparator: ".",
                                    decimalSeparator: ",",
                                    suffix: "%",
                                    decimalScale: 2,
                                  }
                            }
                            className="login_input"
                            currentValue={props.values.value}
                            directChange={(value) => {
                              props.setFieldValue("value", value.floatValue);
                            }}
                          />
                        </div>
                      </Row>
                    </div>
                    <div className="price">
                      <p>Prazo de entrega</p>
                      <div className="input_days">
                        <FormField
                          text="Dias úteis"
                          required
                          className="login_input"
                          name="days_to_delivery"
                          type="number"
                          value={props.values.days_to_delivery}
                        />
                      </div>
                    </div>
                    <div className="price" style={{ marginLeft: 30 }}>
                      <p>Quantidade de Produtos</p>
                      <div className="df fdr alic jc-sb">
                        <div
                          className="input_days"
                          style={{ width: 60, marginTop: 10 }}
                        >
                          <FormField
                            text="De"
                            required
                            className="login_input"
                            name="minimum_items"
                            type="number"
                            value={props.values.minimum_items}
                          />
                        </div>
                        <div
                          className="input_days"
                          style={{ width: 60, marginTop: 10 }}
                        >
                          <FormField
                            text="Até"
                            required
                            className="login_input"
                            name="maximum_items"
                            type="number"
                            value={props.values.maximum_items}
                          />
                        </div>
                      </div>
                    </div>
                    {props?.values?.has_min_amount_free && (
                      <div className="price padding40 paddingLeft">
                        <p className="mBottom25">
                          Valor mínimo para frete grátis
                        </p>
                        <div>
                          <NumberField2
                            text="Valor"
                            name="min_amount_free"
                            format={{
                              thousandSeparator: ".",
                              decimalSeparator: ",",
                              prefix: "R$ ",
                              decimalScale: 2,
                            }}
                            className="login_input"
                            currentValue={props.values.min_amount_free}
                            directChange={(value) => {
                              props.setFieldValue(
                                "min_amount_free",
                                value.floatValue
                              );
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="df fdr jc-end">
                    <button className={"button success"} type="submit">
                      {isNewRange?.isNew ? "INCLUIR" : "ALTERAR"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export { LocationRanges };
