import React, { useState, useEffect, useContext } from "react";
import {
  Icons,
  Row,
  FormField,
  Table,
  Switch,
  VoidTemplate,
  Loader,
} from "../../../../components";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import { FreightContext } from "./FreightContext";
import {
  useUpdateFreight,
  useDeleteFreightLocale,
} from "../../../../hooks-api/useFreight";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import _ from "lodash";

import "../style.scss";

const FormValidation = Yup.object().shape({
  name: Yup.string().required("Defina um nome"),
  description: Yup.string().required("Defina uma breve descrição"),
});

function FreightUpdate({ setScreen, setIsNewRange, data }) {
  const history = useHistory();
  const { updateData, setUpdatedata } = useContext(FreightContext);
  const [
    updateFreight,
    { data: freightUpdatedData, loading },
  ] = useUpdateFreight();

  const [
    deleteLocal,
    { data: deletedFreightLocale, loading: loadingDelete },
  ] = useDeleteFreightLocale();

  const swalDefaultOptions = {
    text: "Tem certeza que deseja excluir essa faixa?",
    icon: "question",
    confirmButtonText: "Sim",
    confirmButtonColor: "#0489cc",
    cancelButtonText: "Não",
    cancelButtonColor: "#086899",
    showCancelButton: true,
    showCloseButton: true,
  };

  const handleDelete = async (index) => {
    let toDelete = updateData.settings[index];    
    let result = await Swal.fire(swalDefaultOptions);
    
    if (result.value) {
      if (toDelete?.external_id && toDelete?.external_id !== "") {
        await deleteLocal({
          variables: {
            external_id: toDelete.external_id,
          },
        });
      }  
      
      let cloned = _.cloneDeep(updateData);
      cloned.settings.splice(index, 1);
      setUpdatedata({ ...cloned });
      
    }
  };

  const handleSave = async (values) => {    
    setUpdatedata({
      ...updateData,
      name: values.name,
      description: values.description,
      active: values.active,
    });

    if (updateData?.settings?.length < 1) {
      Swal.fire({
        title: "Não há faixas de localização definidas.",
        text: "Defina as faixas de localização para esse método de frete.",
        icon: "info",
        confirmButtonText: "Sim",
        confirmButtonColor: "#0489cc",
        cancelButtonText: "Não",
        cancelButtonColor: "#086899",
        showCancelButton: true,
        showCloseButton: true,
      });
    } else {
      let variablesToSave = {
        variables: {
          shipping: {
            name: values?.name,
            description: values?.description || "",
            active: values?.active,
          },
          locations: updateData.settings,
        },
      };

      if (values.id && values.id !== "") {
        variablesToSave.variables.shipping.id = values.id;
      }

      updateFreight(variablesToSave);
    }
  };

  const handleNewLocal = (values) => {
    setUpdatedata({
      ...updateData,
      name: values.name,
      description: values.description,
      active: values.active,
    });
    setScreen("ranges");
    setIsNewRange({ isNew: true });
  };

  const handleEditLocal = (values, index) => {
    setUpdatedata({
      ...updateData,
      name: values.name,
      description: values.description,
      active: values.active,
    });
    setScreen("ranges");
    setIsNewRange({ isNew: false, index });
  };

  useEffect(() => {
    if (data && data?.shipping && updateData?.canRefresh) {
      setUpdatedata({ ...data.shipping, canRefresh: false });
    }
  }, [data]);

  useEffect(() => {
    if (freightUpdatedData) {
      history.replace({ pathname: "/configs/frete" });
    }
  }, [freightUpdatedData]);

  return (
    <>
      {loading ? <Loader active={true} /> : null}
      <Formik
        initialValues={{
          id: updateData?.id || "",
          name: updateData?.name || "",
          description: updateData?.description || "",
          active: updateData?.active || false,
        }}
        validationSchema={FormValidation}
        enableReinitialize={true}
        onSubmit={handleSave}
      >
        {({ ...props }) => (
          <Form
            className="bonus--wrapper"
            style={{ display: loading ? "none" : "block" }}
          >
            <div className="newFreight">
              <div className="newFreight--board">
                <div className="newFreight--returnWrapper">
                  <div
                    className="newFreight--iconBack"
                    onClick={() =>
                      history.replace({ pathname: "/configs/frete" })
                    }
                  >
                    <Icons.back />
                  </div>
                </div>
                <Row>
                  <div className="df fdr jc-start alic">
                    <h1>{data ? "Editar frete" : "Novo frete"}</h1>
                  </div>
                </Row>
                <Row className="inputText">
                  <FormField
                    text="Nome"
                    required
                    isRequired
                    className="login_input"
                    name="name"
                    type="text"
                    value={props?.values?.name}
                  />
                  <div className="box-status jc-end">
                    <Switch
                      isOn={props?.values?.active}
                      label="Status"
                      activeStateLabel="Ativo"
                      inactiveStateLabel="Inativo"
                      handleToggle={() => {
                        props.setFieldValue("active", !props?.values?.active);
                      }}
                    />
                  </div>
                </Row>

                <Row>
                  <FormField
                    text="Breve descrição"
                    required
                    isRequired
                    className="login_input"
                    name="description"
                    type="text"
                    value={props?.values?.description}
                  />
                </Row>

                <Row className="box_range">
                  <div className="box_range--title">
                    Faixas <br /> de localização
                  </div>
                  <div style={{ marginLeft: 15 }}>
                    <div
                      className="button primary"
                      onClick={() => handleNewLocal(props.values)}
                    >
                      Nova localidade
                    </div>
                  </div>
                </Row>

                {updateData?.settings?.length ? (
                  <Table
                    headers={[
                      "Localização",
                      "Preço",
                      "Quantidade",
                      "Prazo",
                      "Frete Grátis",
                      "",
                    ]}
                  >
                    {updateData?.settings.map((location, index) => (
                      <Table.tr key={`pl-${index}`}>
                        <Table.td>{location?.name}</Table.td>
                        <Table.td>
                          {location?.type_value === "PRICE" ? "R$ " : ""}
                          {location?.value / 100}
                          {location?.type_value === "PERCENTAGE"
                            ? "% do pedido"
                            : ""}
                        </Table.td>

                        <Table.td>
                          {location?.minimum_items} - {location?.maximum_items}
                        </Table.td>

                        <Table.td>
                          {location?.days_to_delivery} dias úteis
                        </Table.td>

                        <Table.td>
                          {location?.has_min_amount_free ? `A partir de R$ ${location?.min_amount_free / 100}` :  "Inativo" } 
                        </Table.td>

                        <Table.td className="action__column">
                          <div className="df fdr alic">
                            <Icons.pencil
                              fill="#0489cc"
                              onClick={() =>
                                handleEditLocal(props.values, index)
                              }
                            />

                            <>
                              <div style={{ width: 10 }}></div>
                              <Icons.delete
                                fill="#c8c7cc"
                                onClick={() => {
                                  handleDelete(index);
                                }}
                              />
                            </>
                          </div>
                        </Table.td>
                      </Table.tr>
                    ))}
                  </Table>
                ) : (
                  <VoidTemplate
                    message={
                      <VoidTemplate.default
                        message={
                          <>
                            Ainda não há nenhuma
                            <br />
                            localidade definida...
                          </>
                        }
                        onClick={() => handleNewLocal(props.values)}
                        buttonText="NOVA localidade"
                      />
                    }
                  />
                )}

                <Row className="box_save">
                  <button className={"button success"} type="submit">
                    Salvar
                  </button>
                </Row>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export { FreightUpdate };
