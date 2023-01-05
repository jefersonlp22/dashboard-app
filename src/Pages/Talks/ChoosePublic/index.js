import React, { useState } from "react";
import { Formik, FieldArray, Form } from "formik";
import TalksLayout from "../index";
// import { useHistory } from "react-router-dom";
import { ChooseGroup } from "../ChooseGroup";
import {
  Row,
  Line,
  Breadcrumbs,
  ContentBoard,
  GetCircleStatusInvite,
  Table,
  Icons,
  InnerEdgeButton
} from "../../../components";
import "./styles.scss";
let level = ["Adicionar"];

export function ChoosePublic() {
  const [chooseGroup, setChooseGroup] = useState(true);
  const [viewPeoples, setViewPeoples] = useState(false);
  const [listPeoples, setListPeoples] = useState([]);
  let textView = viewPeoples ? "Ocultar" : "Ver";

  const peoples = [
    {
      name: "jeff",
      status: "completed",
      level: "Master",
      state: "DF",
      city: "brasilia",
      sexo: "masculino",
      year: "20"
    },
    {
      name: "je",
      status: "completed",
      level: "Master",
      state: "DF",
      city: "brasilia",
      sexo: "masculino",
      year: "20"
    },
    {
      name: "josy",
      status: "peding",
      level: "Master",
      state: "RJ",
      city: "rio",
      sexo: "feminino",
      year: "25"
    },
    {
      name: "jefinho",
      status: "completed",
      level: "Embaixador",
      state: "MG",
      city: "jaiba",
      sexo: "masculino",
      year: "30"
    },
    {
      name: "jerferson",
      status: "canceled",
      level: "Embaixador",
      state: "MG",
      city: "janauba",
      sexo: "masculino",
      year: "33"
    },
    {
      name: "Ste",
      status: "canceled",
      level: "Trial",
      state: "MG",
      city: "janauba",
      sexo: "feminino",
      year: "40"
    },
    {
      name: "Louise",
      status: "canceled",
      level: "Trial",
      state: "MG",
      city: "janauba",
      sexo: "feminino",
      year: "40"
    }
  ];

  // const setLevelSelected = values => {
  //   values.forEach(item => {
  //     level.unshift(item);
  //   });

  //   let list = [];
  //   level.map(itemLevel => {
  //     let filterPeoples = peoples.filter(people => people.level === itemLevel);
  //     filterPeoples.map(item => list.push(item));
  //   });
  //   setListPeoples(list);
  // };

  const removeSelected = value => {
    const index = level.indexOf(value);
    if (index > -1) {
      level.splice(index, 1);
    }
    let list = [];
    // eslint-disable-next-line
    level.map(itemLevel => {
      let filterPeoples = peoples.filter(people => people.level === itemLevel);
      filterPeoples.map(item => list.push(item));
    });
    setListPeoples(list);
  };

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

  if (chooseGroup) {
    return (
      <ChooseGroup />
    );
  }

  return (
    <TalksLayout className="choosePublic">
      <Breadcrumbs itens={["Talks", "Comunicação", "Criar nova", "Público"]} />
      <Line />
      <ContentBoard
        previousPath="/comunicacoes/criar-nova"
        className="contentMaxWidth"
        title="Público"
      >
        {/* <div className="header-card">
          <h1>Público</h1>
          <div className={"options"}>
             <InputRadio
              name="contains"
              value="anyone"
              className="radioButton"
              checked={contains === "anyone"}
              labelClass="radioButton"
              onChange={() => setContains("anyone")}

              // onChange={e => {
              //   e.persist();
              //   props.setFieldValue("contains", e.target.value);
              //   filterAnyone(e.target.value);
              // }}
            >
              Contém qualquer
            </InputRadio>
            <InputRadio
              name="contains"
              value="all"
              className="radioButton"
              checked={contains === "all"}
              labelClass="radioButton"
              onChange={() => setContains("all")}
              // onChange={e => {
              //   e.persist();
              //   props.setFieldValue("contains", e.target.value);
              //   filterAll();
              // }}
            >
              Contém todos
            </InputRadio>
          </div>
        </div>*/}
        <Formik
          initialValues={{ type_level: level }}
          onSubmit={() =>{}}
        >
          {props => {
            const { values } = props;
            return (
              <Form>
                <FieldArray
                  name="type_level"
                  render={arrayHelpers => (
                    <div className="boxLevel">
                      {values.type_level && values.type_level.length > 0
                        ? values.type_level.map((type, index) => {
                            return (
                              <div
                                className={
                                  type !== "Adicionar"
                                    ? "level-selected"
                                    : "level"
                                }
                              >
                                {type}
                                {type !== "Adicionar" ? (
                                  <Icons.closeSmall
                                    onClick={e => {
                                      e.persist();
                                      arrayHelpers.remove(index);
                                      removeSelected(type);
                                    }}
                                    className={"icon"}
                                    fill={"#fff"}
                                  />
                                ) : (
                                  <Icons.next
                                    onClick={() => setChooseGroup(true)}
                                    className={"icon"}
                                    fill={"#0489cc"}
                                  />
                                )}
                              </div>
                            );
                          })
                        : arrayHelpers.push("Adicionar")}
                    </div>
                  )}
                />
                <Row className="choosePublic__actionButtons">
                  <InnerEdgeButton success>Salvar e fechar</InnerEdgeButton>
                </Row>
              </Form>
            );
          }}
        </Formik>
        <div
          onClick={() => setViewPeoples(!viewPeoples)}
          className="listPeoples"
        >
          {textView} {listPeoples.length} integrantes
        </div>
        <Table headers={["Nome", "Nível", "Status"]}>
          {viewPeoples && listPeoples.length
            ? listPeoples.map((item, rowIndex) => (
                <Table.tr key={`row${rowIndex}`}>{formatRow(item)}</Table.tr>
              ))
            : null}
        </Table>
      </ContentBoard>
    </TalksLayout>
  );
}
