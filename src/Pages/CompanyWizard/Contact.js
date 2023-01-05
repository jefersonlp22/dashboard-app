import React, { useState } from "react";
import { InputText, Button, Icons } from "../../components";
import { AuthLayout } from "../../Layouts/AuthLayout";
import { useHistory } from "react-router-dom";
import useForm from "../../customHooks/useForm";

import "./style.scss";

function Contact() {
  const history = useHistory();
  const { inputs, handleValueChange } = useForm({
    phone: "",
    whatsapp: "",
    email: "",
    site: "",
    link_suporte: ""
  });
  const [loading] = useState(false);

  function handleConfirm(e) {
    e.preventDefault();
    history.replace({ pathname: "/register-phone" });
  }

  return (
    <AuthLayout
      title="Criar nova marca"
      leftIcon={
        <Icons.back
          fill="#FFF"
          onClick={() => history.push("/register-address")}
        />
      }
      rightIcon={<Icons.close fill="#FFF" />}
      submit={e => handleConfirm(e)}
    >
      <AuthLayout.card title="Só mais algumas informações para fechar">
        <InputText
          text="Telefone"
          name="phone"
          type="text"
          required
          value={inputs.phone}
          onChange={handleValueChange}
          className="login_input"
        />
        <InputText
          text="Whatsapp"
          name="whatsapp"
          type="text"
          required
          value={inputs.whatsapp}
          onChange={handleValueChange}
          className="login_input"
        />

        <InputText
          text="E-mail"
          name="email"
          type="text"
          required
          value={inputs.email}
          onChange={handleValueChange}
          className="login_input"
        />

        <InputText
          text="Site"
          name="site"
          type="text"
          required
          value={inputs.site}
          onChange={handleValueChange}
          className="login_input"
        />

        <InputText
          text="Link Suporte"
          name="link_suporte"
          type="text"
          required
          value={inputs.link_suporte}
          onChange={handleValueChange}
          className="login_input"
        />
      </AuthLayout.card>
      <AuthLayout.actions>
        <Button
          text="Confirmar"
          primary
          onClick={e => handleConfirm(e)}
          disabled={loading}
          className="register__wizard--buttonConfirm"
        />
      </AuthLayout.actions>
    </AuthLayout>
  );
}

export { Contact };
