import React, { useState, useEffect } from "react";
import { InputText, Button, ProgressDots, Icons } from "../../components";
import { AuthLayout } from "../../Layouts/AuthLayout";
import { useHistory } from "react-router-dom";
import useForm from "../../customHooks/useForm";
import TotalStorage from "total-storage";

import "./style.scss";

function RegisterPassword() {
  const history = useHistory();
  const { inputs, handleInputChange } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inputs.hasOwnProperty("password") && inputs.password[0] !== "") {
      if (
          inputs.password[0].length >= 8 && 
          inputs.password[0].match(/[!@#$%&;*]+/) &&
          inputs.password[0].match(/[0-9]+/) &&
          (inputs.password[0].match(/[a-z]+/) || inputs.password[0].match(/[A-Z]+/))
        ) {
        setLoading(false);
      }

      let acceptInviteInput = TotalStorage.get("ACCEPTINVITEINPUT");
      acceptInviteInput.password =
        typeof inputs.password === "string"
          ? inputs.password
          : inputs.password[0];
      TotalStorage.set("ACCEPTINVITEINPUT", acceptInviteInput);
    } else {
      setLoading(true);
    }
  }, [inputs, loading]);

  function handleConfirm(e) {
    e.preventDefault();
    if (inputs.password[0].length >= 8) {
      history.replace({ pathname: "/register-confirm-password" });
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
          onClick={() => history.replace({ pathname: "/register-phone" })}
        />
      }
      rightIcon={<Icons.close fill="#FFF" onClick={()=> handleClose()} />}
      submit={e => handleConfirm(e)}
    >
      <AuthLayout.card title="Crie uma senha">
        <div className="description-password">
          Sua senha precisa ter no mínimo 8 caracteres com pelo menos uma letra, um caractere
          especial e um número.
        </div>
        <InputText
          text="Senha"
          name="password"
          type="password"
          required
          value={inputs.password || ""}
          onChange={handleInputChange}
          className="login_input"
        />
      </AuthLayout.card>
      <AuthLayout.actions>
        <Button
          text="Próximo"
          primary
          onClick={e => handleConfirm(e)}
          disabled={loading}
          className="register__wizard--buttonConfirm"
        />

        <div className="register__wizard--progress">
          <ProgressDots total={4} current={3}/>
        </div>
      </AuthLayout.actions>
    </AuthLayout>
  );
}

export { RegisterPassword };
