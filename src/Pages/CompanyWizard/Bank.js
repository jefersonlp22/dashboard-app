import React, { useState, useEffect } from "react";
import { InputText, Button, Icons } from "../../components";
import { AuthLayout } from "../../Layouts/AuthLayout";
import { useHistory } from "react-router-dom";
import useForm from "../../customHooks/useForm";
import { useUpdateTenantMe } from "../../gqlEndpoints/mutations";
import { useBanks } from "../../gqlEndpoints/queries";

import "./style.scss";

function Bank() {
  const history = useHistory();
  const { updateByQuery } = useUpdateTenantMe();
  const { loadBanks } = useBanks();

  const { inputs, handleValueChange } = useForm({
    bank_name: "",
    bank_agency: "",
    bank_account: "",
    account_type: "corrente",
    person_type: "pj"
  });

  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState(false);

  useEffect(() => {
    fetchBanks();
    async function fetchBanks() {
      let result = await loadBanks();
      setBanks(result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleConfirm(e) {
    e.preventDefault();
    setLoading(true);
    if (
      inputs.bank_name !== "" &&
      inputs.bank_agency !== "" &&
      inputs.bank_account !== ""
    ) {
      let saved = await updateByQuery(`{
        bank_name: "${inputs.bank_name}",
        bank_agency: "${inputs.bank_agency}",
        bank_account: "${inputs.bank_account}",
        bank_number: "${inputs.bank_number}",
        account_type: "${inputs.account_type}",
        person_type: "${inputs.person_type}"
      }`);
      setTimeout(() => {
        history.push("/register-address");
      }, 300);
    } else {
      console.error("Formulário inválido");
    }
    setLoading(false);
  }

  return (
    <AuthLayout
      title="Criar nova marca"
      leftIcon={
        <Icons.back
          fill="#FFF"
          onClick={() => history.push("/register-company")}
        />
      }
      rightIcon={<Icons.close fill="#FFF" />}
      submit={e => handleConfirm(e)}
    >
      <AuthLayout.card title="Agora, alguns dados financeiros">
        <label className="inputSelect">
          <span>Banco:</span>
          <select
            name="bank_name"
            value={inputs.bank_name}
            onChange={e => {
              let current_number =
                e.target.options[e.target.selectedIndex].dataset.number;
              inputs.bank_number = current_number;
              handleValueChange(e);
            }}
          >
            <>
              <option></option>
              {banks
                ? banks.map((bank, index) => (
                    <option
                      key={`bankName${index}`}
                      value={bank.name}
                      data-number={bank.number}
                    >
                      {bank.number} - {bank.name}
                    </option>
                  ))
                : null}
            </>
          </select>
        </label>

        <InputText
          text="Agência"
          name="bank_agency"
          type="text"
          required
          value={inputs.bank_agency || ""}
          onChange={handleValueChange}
          className="login_input"
        />
        <InputText
          text="Nº da Conta"
          name="bank_account"
          type="text"
          required
          value={inputs.bank_account || ""}
          onChange={handleValueChange}
          className="login_input"
        />

        <label className="inputSelect">
          <span>Tipo de conta:</span>
          <select
            name="account_type"
            value={inputs.account_type}
            onChange={handleValueChange}
          >
            <option value="corrente">Conta corrente</option>
            <option value="poupanca">Conta poupança</option>
          </select>
        </label>


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

export { Bank };
