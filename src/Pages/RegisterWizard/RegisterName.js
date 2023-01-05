import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import TotalStorage from "total-storage";

import {
  FormField,
  Alert,
  AlertButton,
  Button,
  ProgressDots,
  Icons
} from "../../components";

import { AuthLayout } from "../../Layouts/AuthLayout";

import "./style.scss";


const FormValidation = Yup.object().shape({
  name: Yup.string().required("Informe seu nome")
});

function RegisterName() {
  const history = useHistory();
  const [totalSteps, setTotalSteps] = useState(4);
  const [defaultName] = useState(TotalStorage.get("ACCEPTINVITEINPUT").name);

  const [alert, setAlert] = useState({
    status: false,
    message: "false",
    type: "default"
  });

  function handleNext(values) {
    let acceptInviteInput = TotalStorage.get("ACCEPTINVITEINPUT");
    acceptInviteInput.name = values.name;
    TotalStorage.set("ACCEPTINVITEINPUT", acceptInviteInput);
    history.replace({ pathname: "/register-phone" });
  }

  useEffect(() => {
    let register_state = TotalStorage.get("REGISTER_STATE");

    if (register_state === "facebook") {
      setTotalSteps(2);
      setAlert({
        status: true,
        message: "Facebook autenticado!",
        type: "facebook"
      });

      setTimeout(
        () =>
          setAlert({
            status: false
          }),
        10000
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () =>{   
    localStorage.clear();
    history.replace({pathname:'/login'});
  }


  return (
    <Formik
      initialValues={{ name: defaultName }}
      validationSchema={FormValidation}
      onSubmit={handleNext}
      validateOnBlur={false}
    >
      <Form>
        <AuthLayout
          title="Cadastro"
          leftIcon={<Icons.back fill="#FFF" onClick={() => history.goBack()} />}
          rightIcon={<Icons.close fill="#FFF" onClick={() => handleClose()} />}
        >
          <Alert show={alert.status} type={alert.type}>
            <div>{alert.message}</div>
            <div>
              <AlertButton onClick={() => setAlert(false)}>Fechar</AlertButton>
            </div>
          </Alert>
          <AuthLayout.card title="Qual seu nome?">
            <FormField text="Nome completo" required name="name" />
          </AuthLayout.card>
          <AuthLayout.actions>
            <Button
              text="Próximo"
              primary
              type="submit"
              className="register__wizard--buttonConfirm"
            />

            <div className="register__wizard--progress">
              <ProgressDots total={totalSteps} current={1} />
            </div>
          </AuthLayout.actions>
        </AuthLayout>
      </Form>
    </Formik>
  );
}

export { RegisterName };
