import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import {
  NumberField,
  Alert,
  AlertButton,
  Button,
  ProgressDots,
  Icons
} from "../../components";
import { AuthLayout } from "../../Layouts/AuthLayout";
import TotalStorage from "total-storage";
import { useAcceptCodeInvite, useLogin } from "../../gqlEndpoints/mutations";

import "./style.scss";

const FormValidation = Yup.object().shape({
  phone: Yup.string().required("Ops! Informação obrigatória para avançar.")
});

function RegisterPhone(props) {
  const history = useHistory();
  const { acceptCodeInvite } = useAcceptCodeInvite();
  const { login } = useLogin();
  const [loading, setLoading] = useState(false);
  const [totalSteps, setTotalSteps] = useState(4);
  const [defaultPhone] = useState(TotalStorage.get("ACCEPTINVITEINPUT").phone);

  const [alert, setAlert] = useState({
    status: false,
    message: "false",
    type: "default"
  });

  useEffect(() => {
    let register_state = TotalStorage.get("REGISTER_STATE");
    if (register_state === "facebook") {
      setTotalSteps(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(email, password) {
    setLoading(true);

    let response = await login(email, password);

    if (response.access_token) {
      TotalStorage.set("ACCESS_TOKEN", response.access_token);

      TotalStorage.remove(["FBDATA", "ACCEPTINVITEINPUT", "REGISTER_STATE"]);
    } else if (response.error) {
      setLoading(false);
      setAlert({
        status: true,
        message: response.error,
        type: "error"
      });
      setLoading(false);
    }
  }

  async function handleAcceptCodeInvite() {
    setLoading(true);
    let acceptInviteInput = TotalStorage.get("ACCEPTINVITEINPUT");
    let response = await acceptCodeInvite(acceptInviteInput);    

    if (response.acceptCodeInvite) {
      if (response.acceptCodeInvite.level === "owner") {
        handleLogin(
          response.acceptCodeInvite.email,
          acceptInviteInput.password
        );
        TotalStorage.set(
          "TENANT",
          response.acceptCodeInvite.tenant.external_id
        );
        TotalStorage.set("ACTIVEOWNER", true);
        setTimeout(() => {
          history.push("/register-company");
        }, 1000);
      } else {        
        handleLogin(
          response.acceptCodeInvite.email,
          acceptInviteInput.password
        );        
        TotalStorage.set("TENANT", "empty");
        setTimeout(() => {
          history.replace({ pathname: "/choose-tenant" });
        }, 1000);
      }
    } else if (response.error) {
      setAlert({
        status: true,
        message: response.error,
        type: "error"
      });
      setTimeout(() => setAlert({ status: false }), 10000);
      setLoading(false);
    }
  }

  function handleNext(values) {
    let acceptInviteInput = TotalStorage.get("ACCEPTINVITEINPUT");
    let register_state = TotalStorage.get("REGISTER_STATE");

    if (values.phone.length < 11) {
      setAlert({
        status: true,
        message: "Número inválido, mínimo de 11 caracteres",
        type: "error"
      });
    } else {
      acceptInviteInput.phone = values.phone !== "" ? values.phone : null;

      TotalStorage.set("ACCEPTINVITEINPUT", acceptInviteInput);

      if (register_state === "facebook") {
        handleAcceptCodeInvite();
      } else {
        history.replace({ pathname: "/register-password" });
      }
    }
  }

  const handleClose = () =>{   
    localStorage.clear();
    history.replace({pathname:'/login'});
  }

  return (
    <Formik
      initialValues={{ phone: defaultPhone }}
      onSubmit={handleNext}
      validateOnBlur={false}
      validationSchema={FormValidation}
    >
      <Form>
        <AuthLayout
          title="Cadastro"
          leftIcon={
            <Icons.back
              fill="#FFF"
              onClick={() => history.replace({ pathname: "/register-name" })}
            />
          }
          rightIcon={<Icons.close fill="#FFF" onClick={()=> handleClose() }/>}
        >
          <Alert show={alert.status} type={alert.type}>
            <div>{alert.message}</div>
            <div>
              <AlertButton onClick={() => setAlert(false)}>Fechar</AlertButton>
            </div>
          </Alert>
          <AuthLayout.card title="Digite o número do seu celular?">
            <NumberField
              name="phone"
              format={{
                format: "(##) #####-####",
                mask: "_",
                thousandSeparator: false
              }}
            />
          </AuthLayout.card>
          <AuthLayout.actions>
            <Button
              text="Próximo"
              primary
              type="submit"
              loading={loading}
              disabled={loading}
              className="register__wizard--buttonConfirm"
            />

            <div className="register__wizard--progress">
              <ProgressDots total={totalSteps} current={2} />
            </div>
          </AuthLayout.actions>
        </AuthLayout>
      </Form>
    </Formik>
  );
}

export { RegisterPhone };
