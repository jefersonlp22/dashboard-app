import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  FormField,
  FormSelect,
  Alert,
  AlertButton
} from "../../components";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useCreateInvite, useResendInvite } from "../../gqlEndpoints/mutations";

const FormValidation = Yup.object().shape({
  name: Yup.string().required("Informe seu nome"),
  email: Yup.string().email("Insira um email válido").required("Informe seu email"),
  level: Yup.string().required("Escolha o nível"),
});

const userLevel = {
  "ambassador": { level: "ambassador", label: "Lover" },
  "master": { level: "master", label: "Master" },
  '': null
}

const ModalInvite = ({
  invite = {},
  responsibles,
  loading,
  setLoading,
  toggle = false,
  setToggle,
  onSaveEnd
}) => {

  const { newInvite, error, createInvite } = useCreateInvite();
  const { newResendInvite, erroResendInvite, resendInvite } = useResendInvite();

  const [state, setState] = useState({
    indicationsPending: [],
    loading: false,
    invalid: false,
    alert: {
      status: false,
      message: "false",
      type: "default"
    }
  });

  const handleState = (key, value) => {
    setState({ ...state, [key]: value });
  };

  const sendInvite = (values) => {
    let { id, ...data } = values;
    setLoading(true);
    if (id || id !== '') {
      resendInvite(id);
    } else {
      createInvite(data);
    }
  }

  useEffect(() => {
    if ((Object.keys(newInvite).length > 0 || Object.keys(newResendInvite).length > 0) && onSaveEnd) {
      handleState("alert", {
        status: true,
        message: "Convite enviado com sucesso!",
        type: "success"
      });
      onSaveEnd();
      setLoading(false);
      setToggle(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newInvite, newResendInvite]);

  useEffect(() => {
    if (
      (erroResendInvite && erroResendInvite?.response?.errors.length > 0) ||
      (error && error?.response?.errors.length > 0)
    ) {
      let message = erroResendInvite?.response?.errors[0].message ||
        erroResendInvite?.response?.errors[0].message || 'Erro desconhecido';

      handleState("alert", {
        status: true,
        message: message,
        type: "error"
      });
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, erroResendInvite]);

  return (
    <>
      <Modal visible={toggle} onClose={() => setToggle(!toggle)} >
        <h1 className="mBottom30">
          {invite?.status_formatted === "pending" ? "Convite pendente" : "Convidar"}
        </h1>
        <Formik
          initialValues={{
            id: invite?.id || "",
            name: invite?.name || "",
            email: invite?.email || "",
            responsible_user_id: invite?.responsibleUser || "",
            level: invite?.level || "",
          }}
          validationSchema={FormValidation}
          onSubmit={sendInvite}
          validateOnBlur={false}
          enableReinitialize={true}
        >
          {(formParams) => (
            <Form>
              <FormField text="Nome" required name="name"
                disabled={invite?.id ? true : false}
                isRequired
              />
              <FormField text="E-mail" isRequired name="email" disabled={invite?.id ? true : false} />
              <FormSelect text="Responsável" name="responsible_user_id"
                form={formParams}
                disabled={invite?.id ? true : false}
                initialValue={
                  invite?.responsibleUser ?
                    { value: invite?.responsibleUser?.id, label: invite?.responsibleUser?.name } : null
                }
                options={responsibles.map(item => { return { value: item?.user?.id, label: item?.user?.name } })}
              />

              <FormSelect text="Selecione o nível" name="level"
                form={formParams}
                isRequired
                disabled={invite?.id ? true : false}
                initialValue={userLevel[invite?.level || '']}
                options={[
                  { value: "master", label: "Master" },
                  { value: "ambassador", label: "Lover" }
                ]}
              />

              <Button
                primary
                type="submit"
                disabled={loading}
                loading={loading}
                className="btFullWidth"
              >
                {invite?.status_formatted === "pending" ? "ENVIAR NOVAMENTE" : "Confirmar"}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
      <Alert show={state.alert.status} type={state.alert.type}>
        <div>{state.alert.message}</div>
        <div>
          <AlertButton
            onClick={() =>
              handleState("alert", {
                status: false
              })
            }
          >
            Fechar
          </AlertButton>
        </div>
      </Alert>
    </>
  );
};

export default ModalInvite;
