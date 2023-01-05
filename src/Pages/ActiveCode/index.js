import React, { useState, useEffect } from "react";

import { useHistory, Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import TotalStorage from "total-storage";

import { FormField, Alert, AlertButton, Button, Icons } from "../../components";

import logo from "../../assets/images/logo.png";

import { AuthLayout } from "../../Layouts/AuthLayout";

import { useValidateInvite } from "../../gqlEndpoints/mutations";

import "./style.scss";

const FormValidation = Yup.object().shape({
  code: Yup.string().required("Informe o código")
});

function ActiveCode(props) {
  const history = useHistory();
  const { validateInvite } = useValidateInvite();

  const [loading, setLoading] = useState(false);
  const [validCode, setValidCode] = useState(false);

  const [alert, setAlert] = useState({
    status: false,
    message: "false",
    type: "default"
  });

  function handleFbLogin() {
    window.FB.login(function(response) {
      if (response.authResponse) {
        let tokenFB = response.authResponse.accessToken;
        let userId = response.authResponse.userID;

        window.FB.api(
          `/${userId}`,
          {
            access_token: tokenFB,
            fields: ["picture", "name"]
          },
          function(response) {
            TotalStorage.set("REGISTER_STATE", "facebook");
            TotalStorage.set("FBDATA", response);

            const invite = TotalStorage.get("ACCEPTINVITEINPUT");

            invite.password = response.id;
            invite.password_confirmation = response.id;
            invite.picture_url = response.picture.data.url;
            invite.facebook_id = response.id;

            TotalStorage.set("ACCEPTINVITEINPUT", invite);

            setTimeout(() => {
              history.replace({ pathname: "/register-name" });
            }, 1000);
          }
        );
      } else {
        console.log("User cancelled login or did not fully authorize.");
      }
    });
  }

  useEffect(() => {
    initFbLogin();
    async function initFbLogin() {
      (function(d, s, id) {
        // Load the SDK asynchronously
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");

      setTimeout(() => {
        if (window.FB) {
          window.FB.init({
            appId: process.env.REACT_APP_API_FACEBOOK_ID,
            cookie: true, // Enable cookies to allow the server to access the session.
            xfbml: true, // Parse social plugins on this webpage.
            version: process.env.REACT_APP_API_FACEBOOK_VERSION // Use this Graph API version for this call.
          });

          window.FB.getLoginStatus(function(response) {
            if (response.status === "connected") {
              let tokenFB = response.authResponse.accessToken;
              window.FB.logout(
                function(response) {
                  console.log("Deslogou", response);
                },
                { access_token: tokenFB }
              );
            }
          });
        }
      }, 300);
    }
  }, []);

  async function handleActive(values) {
    setLoading(true);
    let response = await validateInvite(values.code);

    if (response.validateInvite) {
      setValidCode(true);
      setAlert({
        status: true,
        message: "Código de convite encontrado!",
        type: "success"
      });

      TotalStorage.set("REGISTER_STATE", "default");

      let acceptInviteInput = {
        code: response.validateInvite.code,
        name: response.validateInvite.name
      };
      TotalStorage.set("ACCEPTINVITEINPUT", acceptInviteInput);
    } else if (response.error) {
      setLoading(false);
      setAlert({
        status: true,
        message: response.error,
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

  function handleNext(e) {
    e.preventDefault();
    let checkToNext = TotalStorage.get("ACCEPTINVITEINPUT");

    if (
      checkToNext.hasOwnProperty("name") &&
      checkToNext.hasOwnProperty("name")
    ) {
      history.replace({ pathname: "/register-name" });
    }
  }

  return (
    <Formik
      initialValues={{ code: "" }}
      validationSchema={FormValidation}
      onSubmit={handleActive}
      validateOnBlur={false}
    >
      <Form>
        <AuthLayout
          title="Ativar Código"
          leftIcon={<Icons.back fill="#FFF" onClick={() => history.goBack()} />}
        >
          <Alert show={alert.status} type={alert.type}>
            <div>{alert.message}</div>
            <div>
              <AlertButton onClick={() => setAlert(false)}>Fechar</AlertButton>
            </div>
          </Alert>
          <AuthLayout.card>
            <img className="active__code--logoApp" src={logo} alt="Logo" />

            <FormField
              text={validCode ? "Código" : "Digite seu código de ativação"}
              required
              name="code"
              readOnly={validCode}
            />

            {validCode ? (
              <p className="active__code--validMessage">
                Para cadastrar sua conta, precisamos que você responda algumas
                perguntas.
              </p>
            ) : null}
          </AuthLayout.card>
          <AuthLayout.actions>
            {validCode ? (
              <>
                <Link
                  className="button buttonFB"
                  to={"#"}
                  onClick={() => handleFbLogin()}
                >
                  Vincular facebook
                </Link>

                <Link
                  className="button bt__link--primary"
                  to={"#"}
                  onClick={e => handleNext(e)}
                >
                  Começar
                </Link>
              </>
            ) : (
              <Button
                text="Confirmar"
                primary
                type="submit"
                disabled={loading}
                loading={loading}
                className="btFullWidth"
              />
            )}
          </AuthLayout.actions>
        </AuthLayout>
      </Form>
    </Formik>
  );
}

export default ActiveCode;
