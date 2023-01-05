import React, { useState, useEffect } from "react";
import {
  InputText,
  Alert,
  AlertButton,
  Button,
  ProgressDots,
  Icons
} from "../../components";
import { AuthLayout } from "../../Layouts/AuthLayout";
import { useHistory } from "react-router-dom";
import useForm from "../../customHooks/useForm";
import TotalStorage from "total-storage";
import { useAcceptCodeInvite, useLogin } from "../../gqlEndpoints/mutations";

import "./style.scss";

function RegisterConfirmPassword() {
  const history = useHistory();
  const { inputs, handleInputChange } = useForm();
  const { acceptCodeInvite } = useAcceptCodeInvite();
  const { login } = useLogin();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [alert, setAlert] = useState({
    status: false,
    message: "false",
    type: "default"
  });

  useEffect(() => {
    if (
      inputs.hasOwnProperty("password_confirmation") &&
      inputs.password_confirmation[0] !== ""
    ) {
      if (inputs.password_confirmation[0].length >= 8) {
        setLoading(false);
      }
      let acceptInviteInput = TotalStorage.get("ACCEPTINVITEINPUT");
      acceptInviteInput.password_confirmation =
        typeof inputs.password_confirmation === "string"
          ? inputs.password_confirmation
          : inputs.password_confirmation[0];
      TotalStorage.set("ACCEPTINVITEINPUT", acceptInviteInput);
    } else {
      setLoading(true);
    }
  }, [inputs]);

  async function handleLogin(email, password) {
    setLoading(true);

    let response = await login(email, password);

    if (response.access_token) {
      TotalStorage.set("ACCESS_TOKEN", response.access_token);
      TotalStorage.set("@Auth:token", response.access_token);
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
    setSaving(true);
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
        setTimeout(() => history.replace({ pathname: "/choose-tenant" }), 1000);
      }
    } else if (response.error) {
      setAlert({
        status: true,
        message: response.error,
        type: "error"
      });
      setTimeout(() => setAlert({ status: false }), 10000);
      setSaving(false);
    }
  }

  function handleConfirm(e) {
    let password = TotalStorage.get("ACCEPTINVITEINPUT");
    if (password.password === password.password_confirmation) {
      e.preventDefault();
      handleAcceptCodeInvite();
    } else {
      setAlert({
        status: true,
        message: "Senha não confere! Vá de novo.",
        type: "error"
      });
    }
  }

  const handleClose = () =>{   
    localStorage.clear();
    history.replace({pathname:'/login'});
  }

  return (
    <AuthLayout
      title="Cadastro"
      leftIcon={
        <Icons.back
          fill="#FFF"
          onClick={() => history.replace({ pathname: "/register-password" })}
        />
      }
      rightIcon={<Icons.close fill="#FFF" onClick={()=> handleClose()} />}
      submit={e => handleConfirm(e)}
    >
      <Alert show={alert.status} type={alert.type}>
        <div>{alert.message}</div>
        <div>
          <AlertButton onClick={() => setAlert(false)}>Fechar</AlertButton>
        </div>
      </Alert>
      <AuthLayout.card title="Confirme sua senha">
        <InputText
          text="Senha"
          name="password_confirmation"
          type="password"
          required
          value={inputs.password_confirmation || ""}
          onChange={handleInputChange}
          className="login_input"
        />
      </AuthLayout.card>
      <AuthLayout.actions>
        <Button
          text="Finalizar"
          primary
          onClick={e => handleConfirm(e)}
          disabled={loading || saving}
          loading={saving}
          className="register__wizard--buttonConfirm"
        />

        <div className="register__wizard--progress">
          <ProgressDots total={4} current={4} />
        </div>
      </AuthLayout.actions>
    </AuthLayout>
  );
}

export { RegisterConfirmPassword };
