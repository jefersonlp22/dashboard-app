import React, { useState, useEffect } from "react";
import NumberFormat from "react-number-format";

import { InputText, Button, Icons } from "../../components";
import { AuthLayout } from "../../Layouts/AuthLayout";
import { useHistory } from "react-router-dom";
import useForm from "../../customHooks/useForm";
import { useUpdateTenantMe } from "../../gqlEndpoints/mutations";
import { usePostalCode } from "../../gqlEndpoints/queries";
import "./style.scss";

function Address() {
  const { updateByQuery } = useUpdateTenantMe();
  const { searchPostalCode } = usePostalCode();
  const history = useHistory();
  const { inputs, handleValueChange, handleTargetValueChange } = useForm({
    postal_code: "",
    address: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    city_code: "",
    state: ""
  });
  const [loading, setLoading] = useState(false);
  const [localInputs, setLocalInputs] = useState({
    address: "",
    district: "",
    city: "",
    city_code: "",
    state: ""
  });

  useEffect(() => {
    if (inputs.postal_code.length === 8) {
      findPostalCode(inputs.postal_code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs.postal_code]);

  async function findPostalCode(postal_code) {
    let result = await searchPostalCode(postal_code);
    if (result) {
      await setLocalInputs({
        address: result.address,
        district: result.district,
        city: result.city,
        city_code: result.city_code,
        state: result.state
      });
      inputs.address = result.address;
      inputs.city = result.city;
      inputs.city_code = result.city_code;
      inputs.district = result.district;
      inputs.state = result.state;
    } else {
      console.log("deu ruim", result);
    }
  }
  async function handleConfirm(e) {
    e.preventDefault();
    setLoading(true);
    if (
      inputs.postal_code !== "" &&
      inputs.address !== "" &&
      inputs.number !== "" &&
      inputs.district !== "" &&
      inputs.city !== "" &&
      inputs.state !== ""
    ) {
      await updateByQuery(`{        
        address: {          
          postal_code: "${inputs.postal_code}",
          address: "${inputs.address}",
          number: "${inputs.number}",
          district: "${inputs.district}",
          city: "${inputs.city}",
          city_code: "${inputs.city_code}",
          state: "${inputs.state}"          
        }
      }`);

      setTimeout(() => {
        history.push("/register-visual");
      }, 300);
    } else {
      console.log("Formulário Inválido");
    }
    setLoading(false);
  }

  return (
    <AuthLayout
      title="Criar nova marca"
      leftIcon={
        <Icons.back
          fill="#FFF"
          onClick={() => history.push("/register-bank")}
        />
      }
      rightIcon={<Icons.close fill="#FFF" />}
      submit={e => handleConfirm(e)}
    >
      <AuthLayout.card title="O endereço comercial também">
        {loading ? (
          <span
            style={{
              width: "100%",
              display: "block",
              textAlign: "center",
              fontSize: 14,
              padding: "15px 0"
            }}
          >
            Buscando CEP....
          </span>
        ) : null}

        <NumberFormat
          text={"CEP"}
          required
          format="#####-###"
          mask="_"
          customInput={InputText}
          value={inputs.postal_code || ""}
          className="login_input"
          onValueChange={values => {
            handleTargetValueChange("postal_code", values.value);
          }}
        />

        <InputText
          text="Logradouro"
          name="address"
          type="text"
          required
          value={inputs.address || localInputs.address}
          onChange={handleValueChange}
          className="login_input"
        />
        <div className="df fdr">
          <InputText
            text="Número"
            name="number"
            type="text"
            required
            value={inputs.number}
            onChange={handleValueChange}
            className="login_input"
          />
          <div style={{ width: 30 }}></div>
          <InputText
            text="Complemento"
            name="complement"
            type="text"
            required
            value={inputs.complement}
            onChange={handleValueChange}
            className="login_input"
          />
        </div>

        <InputText
          text="Bairro"
          name="district"
          type="text"
          required
          value={inputs.district || localInputs.district}
          onChange={handleValueChange}
          className="login_input"
        />

        <div className="df fdr">
          <InputText
            text="Município"
            name="city"
            type="text"
            required
            value={inputs.city || localInputs.city}
            onChange={handleValueChange}
            className="login_input"
          />
          <div style={{ width: 30 }}></div>
          <InputText
            text="UF"
            name="state"
            type="text"
            required
            value={inputs.state || localInputs.state}
            onChange={handleValueChange}
            className="login_input"
          />
        </div>
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

export { Address };
