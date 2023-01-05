import React, { useState } from "react";

import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { FormField, Alert, AlertButton, Button, Icons } from "../../components";

import { AuthLayout } from "../../Layouts/AuthLayout";

import { useForgotPassword } from "../../gqlEndpoints/mutations";

import "./style.scss";

const FormValidation = Yup.object().shape({
  email: Yup.string()
    .required("Informe o email")
    .email("Informe um email válido")
});

function ResetPassword(props) {
  const history = useHistory();
  const { forgotPassword } = useForgotPassword();

  const [loading, setLoading] = useState(false);
  const [linkSended, setLinkSended] = useState(false);
  const [emailSended, setEmailSended] = useState("");

  const [alert, setAlert] = useState({
    status: false,
    message: "false",
    type: "default"
  });

  async function handleReset(values) {
    setLoading(true);

    let response = await forgotPassword(values.email);

    if (response.forgotPassword.status === "EMAIL_SENT") {
      setAlert({
        status: true,
        message: "Link Enviado",
        type: "success"
      });

      setEmailSended(values.email);
      setLinkSended(true);
      setLoading(false);
    } else {
      setLoading(false);
      setAlert({
        status: true,
        message: "Usuário não encontrado",
        type: "error"
      });
    }
    setTimeout(
      () =>
        setAlert({
          status: false
        }),
      10000
    );
  }

  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={FormValidation}
      onSubmit={handleReset}
      validateOnBlur={false}
    >
      <Form>
        <AuthLayout
          title="Redefinir Senha"
          leftIcon={
            linkSended ? null : (
              <Icons.back
                fill="#FFF"
                onClick={() => history.replace({ pathname: "/login" })}
              />
            )
          }
          rightIcon={
            linkSended ? (
              <Icons.close
                fill="#FFF"
                onClick={() => history.replace({ pathname: "/login" })}
              />
            ) : null
          }
        >
          <Alert show={alert.status} type={alert.type}>
            <div>{alert.message}</div>
            <div>
              <AlertButton onClick={() => setAlert(false)}>Fechar</AlertButton>
            </div>
          </Alert>

          {linkSended ? (
            <>
              <AuthLayout.card>
                <div className="reset__password--title">Link Enviado!</div>
                <div className="reset__password--emailSended">
                  {emailSended}
                </div>
                <div className="reset__password--message">
                  Já deve estar no seu e-mail o link para redefinição de senha.
                  Não recebeu ainda?.
                </div>
              </AuthLayout.card>
              <AuthLayout.actions>
                <Button
                  text="Reenviar Link"
                  primary
                  type="submit"
                  disabled={loading}
                  loading={loading}
                  className="btFullWidth"
                />
              </AuthLayout.actions>
            </>
          ) : (
            <>
              <AuthLayout.card>
                <div className="reset__password--message">
                  Enviaremos um link para seu e-mail. Basta clicar nele e
                  redefinir senha.
                </div>
                <FormField
                  text={"E-mail"}
                  required
                  name="email"
                  readOnly={loading}
                />
              </AuthLayout.card>
              <AuthLayout.actions>
                <Button
                  text="Confirmar"
                  primary
                  type="submit"
                  disabled={loading}
                  loading={loading}
                  className="btFullWidth"
                />
              </AuthLayout.actions>
            </>
          )}
        </AuthLayout>
      </Form>
    </Formik>
  );
}

export default ResetPassword;
