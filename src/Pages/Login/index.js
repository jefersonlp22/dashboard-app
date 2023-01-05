import React, { useState, useEffect } from "react";

import { useHistory, Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import TotalStorage from "total-storage";

import { Button, FormField, Alert, AlertButton } from "../../components";
import { ReactComponent as Logo } from "../../assets/svg/logo-people.svg";

import { useLogin, useLoginFacebook } from "../../gqlEndpoints/mutations";

import { usePersistedState } from '../../customHooks/usePersistedState';

import { AuthLayout } from "../../Layouts/AuthLayout";
import "./style.scss";

const FormValidation = Yup.object().shape({
  email: Yup.string()
    .required("Informe o email")
    .email("Informe um email válido"),
  password: Yup.string()
    .required("Informe a senha")
    .min(6, "Sua senha deve conter no mínimo 6 caracteres")
});

function Login() {
  const history = useHistory();

  const [ access, setAccess,  ] = usePersistedState('@Auth:token','');

  const { login } = useLogin();
  const { loginFacebook } = useLoginFacebook();

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    status: false,
    message: "false",
    type: "default"
  });

  async function handleLogin(props) {
    const { email, password } = props;

    setLoading(true);

    let response = await login(email, password);
    if (response.access_token) {
      TotalStorage.set("ACCESS_TOKEN", response.access_token);
      TotalStorage.set("TENANT", "empty");
      setAccess(response.access_token);
      // setTimeout(() => {
      //   history.replace({ pathname: "/choose-tenant" });
      // }, 1000);
    } else if (response.error) {
      setLoading(false);
      setAlert({
        status: true,
        message: response.error,
        type: "error"
      });
    }
  }

  useEffect(()=>{
    if(access){
      setTimeout(() => {
        history.replace({ pathname: "/choose-tenant" });
      }, 300);
    }
     // eslint-disable-next-line
  },[access]);

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
        }
      }, 300);
    }
     // eslint-disable-next-line
  }, []);

  async function handleFbLogin(token) {
    setLoading(true);
    try {
      let response = await loginFacebook(token);
      if (response.loginFacebook.access_token) {
        TotalStorage.set("ACCESS_TOKEN", response.loginFacebook.access_token);
        TotalStorage.set("TENANT", "empty");
        setTimeout(() => {
          history.replace({ pathname: "/choose-tenant" });
        }, 1000);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  function handleFbAuth() {
    window.FB.login(function(response) {
      if (response.authResponse) {
        let tokenFB = response.authResponse.accessToken;
        if (response) {
          handleFbLogin(tokenFB);
        }
      } else {
        console.error("User cancelled login or did not fully authorize.");
      }
    });
  }

  function facebookLogin(e) {
    e.preventDefault();
    window.FB.getLoginStatus(function(response) {
      if (response.status === "connected") {
        let tokenFB = response.authResponse.accessToken;
        handleFbLogin(tokenFB);
      } else {
        handleFbAuth();
        console.error("not connected to facebook");
      }
    });
  }

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={FormValidation}
      onSubmit={handleLogin}

    >
      {({ errors, touched, validateField, vali,validateForm, values }) => (
      <Form>
        <AuthLayout>
          <Alert show={alert.status} type={alert.type}>
            <div>{alert.message}</div>
            <div>
              <AlertButton onClick={() => setAlert(false)}>Fechar</AlertButton>
            </div>
          </Alert>
          <AuthLayout.card>
            <Logo />

            <FormField
              text="E-mail"
              required
              className="login_input"
              name="email"
            />
            <FormField
              text="Senha"
              type="password"
              required
              className="login_input"
              name="password"
            />
          </AuthLayout.card>
          <AuthLayout.actions>
            <Button
              text="Acessar"
              type="submit"
              loading={loading}
              disabled={loading}
              primary
              className="btFullWidth"
            />

            <Link
              className="button buttonFB"
              to={"#"}
              onClick={e => facebookLogin(e)}
            >
              Acessar com facebook
            </Link>

            <Link className="button bt__link--secundary" to="/active-code">
              Ativar Código
            </Link>

            <Link
              className="forgotPassword btFullWidth"
              to={"/redefinir-senha"}
            >
              Esqueceu sua Senha?
            </Link>
          </AuthLayout.actions>
        </AuthLayout>
      </Form>
      )}
    </Formik>
  );
}

export default Login;
