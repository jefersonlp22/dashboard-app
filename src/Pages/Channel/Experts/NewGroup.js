import React, { useState } from "react";
import Tabs from "../../../Layouts/Tabs";
import {
  InputRadio,
  InputText,
  GetCircleStatusInvite,  
  Button,
  Table
} from "../../../components";
import { Icons } from "../../../components/Icons";
import { Formik, Field, FieldArray, Form } from "formik";
import Layout from "../Layout";

import "./group.scss";

// import { Container } from './styles';

const items = [
  {
    url: "/people/grupos",
    title: "Grupos"
  }
];
const peoples = [
  {
    name: "jeff",
    status: "completed",
    level: "master",
    state: "DF",
    city: "brasilia",
    sexo: "masculino",
    year: "20"
  },
  {
    name: "josy",
    status: "peding",
    level: "master",
    state: "RJ",
    city: "rio",
    sexo: "feminino",
    year: "25"
  },
  {
    name: "jefinho",
    status: "completed",
    level: "embaixador",
    state: "MG",
    city: "jaiba",
    sexo: "masculino",
    year: "30"
  },
  {
    name: "jerferson",
    status: "canceled",
    level: "Associado",
    state: "MG",
    city: "janauba",
    sexo: "masculino",
    year: "33"
  },
  {
    name: "Ste",
    status: "canceled",
    level: "Associado",
    state: "MG",
    city: "janauba",
    sexo: "feminino",
    year: "40"
  }
];
const city = [
  {
    name: "Escolha cidade",
    value: ""
  },
  {
    name: "rio",
    value: "rio"
  },
  {
    name: "brasilia",
    value: "brasilia"
  },
  {
    name: "janauba",
    value: "janauba"
  },
  {
    name: "jaiba",
    value: "jaiba"
  }
];
const state = [
  {
    name: "Escolha estado",
    value: ""
  },
  {
    name: "DF",
    value: "DF"
  },
  {
    name: "MG",
    value: "MG"
  },
  {
    name: "RJ",
    value: "RJ"
  },
  {
    name: "SP",
    value: "SP"
  }
];
const gender = [
  {
    name: "Escolha sexo",
    value: ""
  },
  {
    name: "Masculino",
    value: "masculino"
  },
  {
    name: "Feminino",
    value: "feminino"
  }
];

const ageRange = [
  {
    name: "Escolha faixa etária",
    value: ""
  },
  {
    name: "18-25",
    value: "18-25"
  },
  {
    name: "26-33",
    value: "26-33"
  },
  {
    name: "34-42",
    value: "34-42"
  },
  {
    name: "42-49",
    value: "42-49"
  }
];

let type = [
  {
    name: "Adicionar condição",
    value: ""
  },
  {
    name: "Estado",
    value: "estado"
  },
  {
    name: "Cidade",
    value: "cidade"
  },
  {
    name: "Sexo",
    value: "sexo"
  },
  {
    name: "Faixa etária",
    value: "idade"
  }
];

const listTypes = [
  {
    name: "Adicionar condição",
    value: ""
  },
  {
    name: "Estado",
    value: "estado"
  },
  {
    name: "Cidade",
    value: "cidade"
  },
  {
    name: "Sexo",
    value: "sexo"
  },
  {
    name: "Faixa etária",
    value: "idade"
  }
];

export default function NewGroup({ history }) {
  const [conditions, ] = useState([
    { estado: "", cidade: "", sexo: "", idade: "" }
  ]);
  const [listPeoples, setlistPeoples] = useState(peoples);
  const [viewPeoples, setViewPeoples] = useState(false);
  const [loading, ] = useState(false);
  const [change, ] = useState(true);
  const [arrayContidionsValues, setArrayContidionsValues] = useState([]);
  let filterArray = arrayContidionsValues;
  let textView = viewPeoples ? "Ocultar" : "Ver";
  let typeSelected = [];
  
  function filterAll(conditionName, removeField, values) {
    filterArray = arrayContidionsValues;
    let filterType;
    if (removeField === "remove") {
      filterType = [...type, { name: conditionName, value: conditionName }];
      let indexArray = filterArray.indexOf(values);
      let removed = filterArray;
      removed.splice(indexArray, 1);
    } else {
      filterType = type.filter(iterm => iterm.value !== conditionName);
    }
    if (
      conditions[0].cidade === "" &&
      conditions[0].sexo === "" &&
      conditions[0].idade === "" &&
      conditions[0].estado === ""
    ) {
      return setlistPeoples([]);
    }

    let cond = conditions.map((condition, index) => {
      let list;
      list = peoples.filter(people => {
        return (
          (condition.cidade === "" ? true : condition.cidade === people.city) &&
          (condition.sexo === "" ? true : condition.sexo === people.sexo) &&
          (condition.idade === ""
            ? true
            : condition.idade.substring(0, 2) <= people.year) &&
          (condition.idade === ""
            ? true
            : condition.idade.substring(3, 5) >= people.year) &&
          (condition.estado === "" ? true : condition.estado === people.state)
        );
      });
      return list;
    });
    setlistPeoples(cond[0]);
    type = filterType;

    return cond;
  }
  function filterAnyone(value, removeField) {
    let list;
    filterArray = arrayContidionsValues;
    if (removeField === "remove") {
      let indexArray = filterArray.indexOf(value);
      let removed = filterArray;
      removed.splice(indexArray, 1);
    } else {
      filterArray = [...filterArray, { value: value }];
    }
    list = peoples.filter(people => {
      let cond = filterArray.filter((condition, index) => {
        return (
          condition.value === people.city ||
          ((condition.value === ""
            ? true
            : condition.value.substring(0, 2) <= people.year) &&
            (condition.value === ""
              ? true
              : condition.value.substring(3, 5) >= people.year)) ||
          condition.value === people.sexo ||
          condition.value === people.state
        );
      });
      return cond[0] || cond[0] || cond[0];
    });
    setlistPeoples(list);
  }
  function formatRow(item) {
    let converted = {
      name: item.name,
      level: item.level,
      status: <GetCircleStatusInvite status_formatted={item.status} />
    };
    let row = Object.entries(converted).map(([name, value], index) => (
      <Table.td key={`col-${name}-${index}`} name={name}>
        {value}
      </Table.td>
    ));

    return row;
  }

  let arrayTypeCondition = [];
  return (
    <div>
      <Tabs items={items} />
      <Layout>
        <div className={"boxHeader"}>
          <p className={"list"}>Canal {'>'}</p>
          <p className={"list"}>Grupos {'>'}</p>
          <p className={"active"}>Novo grupo</p>
        </div>
        <div className={"content-group"}>
          <h2>Novo grupo</h2>
          <Formik
            initialValues={{
              type_filter: [],
              group_title: "",
              contains: "anyone",
              anyCondition: []
            }}
            onSubmit={(values, actions) => {
              console.log(values, actions);
            }}
          >
            {props => {
              const { values } = props;
              return (
                <Form>
                  <label>
                    <select disabled className={"type"} name="type">
                      <option>Tipo: Por condição</option>
                      <option>Tipo: Por Evento</option>
                    </select>
                  </label>
                  <InputText
                    text={<span>Título do grupo</span>}
                    name="group_title"
                    type="text"
                    required
                    onChange={props.handleChange}
                    value={values.group_title}
                  />
                  <div className={"options"}>
                    <p>Condições</p>
                    <div className={"options"}>
                      <InputRadio
                        name="contains"
                        value="anyone"
                        className="radioButton"
                        checked={values.contains === "anyone"}
                        labelClass="radioButton"
                        onChange={e => {
                          e.persist();
                          props.setFieldValue("contains", e.target.value);
                          filterAnyone(e.target.value);
                        }}
                      >
                        Contém qualquer
                      </InputRadio>
                      <InputRadio
                        name="contains"
                        value="all"
                        className="radioButton"
                        checked={values.contains === "all"}
                        labelClass="radioButton"
                        onChange={e => {
                          e.persist();
                          props.setFieldValue("contains", e.target.value);
                          filterAll();
                        }}
                      >
                        Contém todos
                      </InputRadio>
                    </div>
                  </div>
                  <div className="box-selected">
                    <FieldArray
                      name="type_filter"
                      render={arrayHelpers => (
                        <div>
                          {values.type_filter && values.type_filter.length > 0
                            ? values.type_filter.map((condition, index) => {
                                return (
                                  <div className="input-select" key={index}>
                                    <label className="type-filter">
                                      <span
                                        style={{
                                          display:
                                            condition === "" ? "none" : null
                                        }}
                                      >{`Condição ${index + 1}`}</span>
                                      <Field
                                        className={
                                          condition !== ""
                                            ? "field_type"
                                            : "field_type-selected"
                                        }
                                        disabled={condition !== ""}
                                        as="select"
                                        name={`type_filter.${index}`}
                                        onChange={e => {
                                          e.persist();
                                          arrayHelpers.insert(
                                            index,
                                            e.target.value
                                          );
                                        }}
                                      >
                                        {
                                          ((typeSelected =
                                            values.contains === "all"
                                              ? type
                                              : listTypes),
                                          typeSelected.map((item, index) => (
                                            <option
                                              value={item.value}
                                              key={`filter${index}`}
                                            >
                                              {condition
                                                ? condition
                                                    .substring(0, 1)
                                                    .toUpperCase()
                                                    .concat(
                                                      condition.substring(1)
                                                    )
                                                : item.name}
                                            </option>
                                          )))
                                        }
                                      </Field>
                                    </label>
                                    {condition !== "" ? (
                                      <Icons.closeSmall
                                        onClick={e => {
                                          e.persist();
                                          conditions[0][condition] = "";
                                          arrayHelpers.remove(index);
                                          values.contains === "all"
                                            ? filterAll(
                                                condition,
                                                "remove",
                                                values
                                              )
                                            : filterAnyone(values, "remove");
                                        }}
                                        className={"icon"}
                                        fill={"#000"}
                                      />
                                    ) : null
                                    //   <Icons.arrowDown
                                    //     for="status"
                                    //     className={"icon"}
                                    //     fill={"#000"}
                                    //   />
                                    }
                                    <div className="item-selected">
                                      {condition !== "" ? (
                                        <label className="label-select">
                                          <span>
                                            {condition === "idade"
                                              ? "Faixa etária"
                                              : condition
                                                  .substring(0, 1)
                                                  .toUpperCase()
                                                  .concat(
                                                    condition.substring(1)
                                                  )}
                                          </span>

                                          <Field
                                            className="label-select"
                                            as="select"
                                            name={`conditions.${index}`}
                                            onChange={e => {
                                              e.persist();
                                              setArrayContidionsValues([
                                                ...arrayContidionsValues,
                                                { value: e.target.value }
                                              ]);
                                              conditions[0][condition] =
                                                e.target.value;
                                              values.contains === "all"
                                                ? filterAll(condition, index)
                                                : filterAnyone(e.target.value);
                                            }}
                                          >
                                            <>
                                              {((arrayTypeCondition =
                                                condition === "cidade"
                                                  ? city
                                                  : condition === "estado"
                                                  ? state
                                                  : condition === "sexo"
                                                  ? gender
                                                  : condition === "idade"
                                                  ? ageRange
                                                  : []))
                                                ? arrayTypeCondition.map(
                                                    (conditionValue, index) => (
                                                      <option
                                                        key={`city-name${index}`}
                                                        value={
                                                          conditionValue.value
                                                        }
                                                      >
                                                        {conditionValue.name}
                                                      </option>
                                                    )
                                                  )
                                                : null}
                                            </>
                                          </Field>
                                        </label>
                                      ) : null}
                                    </div>
                                  </div>
                                );
                              })
                            : arrayHelpers.push("")}
                        </div>
                      )}
                    />
                  </div>

                  <div
                    onClick={() => setViewPeoples(!viewPeoples)}
                    className="listPeoples"
                  >
                    {textView} {listPeoples.length} integrantes
                  </div>
                  <Table headers={["Nome", "Nível", "Status"]}>
                    {viewPeoples && listPeoples.length
                      ? listPeoples.map((item, rowIndex) => (
                          <Table.tr key={`row${rowIndex}`}>
                            {formatRow(item)}
                          </Table.tr>
                        ))
                      : null}
                  </Table>
                  <div
                    style={{
                      display: change ? null : "none"
                    }}
                    className="boxFooterButton"
                  >
                    <div className="footerButton">
                      <Button
                        primary
                        className="btFullWidth"
                        //onClick={() => handleSave()}
                        disabled={loading}
                        text="SALVAR E FECHAR"
                        type="submit"
                      />
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </Layout>
    </div>
  );
}
