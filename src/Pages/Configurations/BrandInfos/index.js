import React, { useEffect, useState, useContext } from "react";
import Select from 'react-select';
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import _ from "lodash";
import {
  Button,
  Loader,
  InputRadio,
  formatCnpjCpf,
  validarCNPJ,
  FormField2,
  NumberField2,
  Line,
  UploadImage,
  Switch
} from "../../../components";

import { useIndexBanks } from "../../../hooks-api/useBanks";

import { STATES, UF_LEGEND } from "../../../helpers/mocks/StatesForSelects";
import { LEGAL_NATURE, ACCOUNT_TYPE, PERSON_TYPE, TAX_REGIME } from "../../../helpers/mocks/PersonalOrBusinessInformations";

import { SessionContext } from '../../../contexts/Session.ctx';
import { useUpdateTenant, useUpdateSettings } from '../../../hooks-api/useTenant';

import { usePostalCode } from '../../../hooks-api/usePostalCode';

import "./style.scss";

Yup.addMethod(Yup.string, 'isFree', function (message) {
  return this.test('is-free-state-registry', message, function (value) {
    const { path, createError, parent } = this;
    if (parent.isencao || value !== undefined) {
      return true;
    }
    return createError({ path, message });
  });
});

Yup.addMethod(Yup.string, 'validCep', function (message) {
  return this.test('is-valid-cep', message, function (value) {
    const { path, createError, parent } = this;
    if ((parent.postal_code || value !== undefined) && parent.postal_code.length === 8) {
      return true;
    }
    return createError({ path, message });
  });
});

const FormValidation = Yup.object().shape({
  company_name: Yup.string()
    .required("Preencha este campo"),
  company_trade_name: Yup.string()
    .required("Preencha este campo"),
  company_document: Yup.string()
    .required("Preencha este campo")
    .test('is-cnpj', 'Digite um CNPJ válido', (value) => {
      if (value) {
        let formattedValue = formatCnpjCpf(value);
        let test = validarCNPJ(formattedValue);
        return test;
      }
      return false;
    }),
  company_state_registration: Yup.string()
    .isFree('Preencha este campo'),
  isencao: Yup.bool(),
  company_legal_nature: Yup.string()
    .required("Preencha este campo"),
  company_tax_regime: Yup.string()
    .required("Preencha este campo"),
  bank_agency: Yup.string()
    .required("Preencha este campo"),
  bank_account: Yup.string()
    .required("Preencha este campo"),
  postal_code: Yup.string()
    .validCep("Preencha este campo"),
});

const BrandInfos = ({ className }) => {

  const { Session, updateCurrentProperty } = useContext(SessionContext);
  const [updatedTenant] = useUpdateTenant({data: 'all'});
  const [updatedSetting] = useUpdateSettings({ data: "legality_settings" });

  const [searchPostalCode, {
    data: dataPostalCode,
    error: errorPostalCode,
    loading: loadingPostalCode
  }] = usePostalCode();

  const { data: loadedBanks } = useIndexBanks();

  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [brandData, setBrandData] = useState(null);
  const [originalData, setOriginaldData] = useState(null);
  const [brandLegality, setBrandLegality] = useState(null);

  const legalNatureDefault = {
    "MEI": "MEI",
    "ME": "ME"
  };

  const taxRegimeDefault = {
    "Simples nacional": "Simples nacional",
    "Lucro presumido": "Lucro presumido",
    "Lucro real": "Lucro real"
  };

  const personTypeDefault = {
    "PJ": "Pessoa Jurídica",
    "PF": "Pessoa Física"
  };

  const accountTypeDefault = {
    "conta-corrente": "Conta-corrente",
    "conta-poupanca": "Poupança"
  };

  const handlePostalCode = async value => {
    try {
      await searchPostalCode({
        variables: {
          postalCode: value
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const findCurrentBank = (bankName) => {
    if (loadedBanks?.banks?.length) {
      let result = _.find(loadedBanks.banks, ["name", bankName]);
      if (result) {
        return { value: result.name, label: result.name };
      }
    }
  }

  const saveLegality = async (legality_settings) => {
    try {
      let result = await updatedSetting({ variables: { legality_settings} });
      if (result) {
        updateCurrentProperty({
          property: "legality_settings",
          value: result.data.settings.legality_settings,
          data: true,
        });
      }
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  };

  async function handleSave(values) {
    setLoading(true);
    try {
      const result = await updatedTenant({
        variables:{
          lp_banner: values.lp_banner_image || "",
          company_name: values.company_name || "",
          company_trade_name: values.company_trade_name || "",
          company_document: values.company_document || "",
          company_state_registration: values.company_state_registration || "",
          company_legal_nature: values.company_legal_nature || "",
          company_tax_regime: values.company_tax_regime || "",
          account_type: values.account_type || "",
          person_type: values.person_type || "",
          bank_name: values.bank_name || "",
          bank_number: values.bank_number || "",
          bank_agency: values.bank_agency || "",
          bank_account: values.bank_account || "",
          address: {
            id: values.address_id || "",
            address: values.address || "",
            complement: values.complement || "",
            number: values.address_number || "",
            postal_code: values.postal_code || "",
            city: values.city || "",
            district: values.district || "",
            state: values.state || "",
            city_code: values.state || "",
          }
        }
      });

      const resultLegality = saveLegality({
        lover: {
          mandatory_age: values.lover_mandatory_age,
          minimum_age:  values.lover_mandatory_age ? Number(values.lover_minimum_age) : null
        },
        customer: {
          mandatory_age: values.customer_mandatory_age,
          minimum_age: values.customer_mandatory_age ? Number(values.customer_minimum_age) : null
        }
      });

    } catch (error) {
      console.log('Erro ao salvar alterações no dados da marca',error);
    }
    setLoading(false);
  }

  const compareObjects = (obj1, obj2) => {
    return false;
    // if (_.isEqual(obj1, obj2)) {
    //   return true;
    // } else {
    //   return false;
    // }
  }

  const updateAddressValue = (field_name, form_value) =>{
    if(dataPostalCode){
      return dataPostalCode?.searchPostalCode[field_name];
    }
    return form_value;
  }

  useEffect(() => {
    setLoading(true);
    if (Session) {
      let cloned = _.cloneDeep(Session?.tenant?.current);
      let address = cloned.address;
      address.address_id = cloned.address.id;
      address.address_name = cloned.address.name;
      address.address_number = cloned.address.number;
      delete address.id;
      delete address.name;
      delete address.number;
      delete cloned.address;
      delete cloned.data;
      let legality_settings = Session?.tenant?.current?.data?.legality_settings;
      let legalityData = {
        lover_mandatory_age: legality_settings?.lover?.mandatory_age || false,
        lover_minimum_age: legality_settings?.lover?.minimum_age || 18,
        customer_mandatory_age: legality_settings?.customer?.mandatory_age || false,
        customer_minimum_age: legality_settings?.customer?.minimum_age || 18,
      };
      setBrandLegality({ ...legality_settings });
      setBrandData({ ...cloned, ...legalityData, ...address });
      console.log({ ...cloned, ...legalityData, ...address });
      setOriginaldData({ ...cloned, ...address, ...legalityData });
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Session]);

  useEffect(() => {
    if (loadedBanks) {
      let filtered_banks = loadedBanks.banks.map((bank, index) => ({
        value: bank.name,
        bank_number: bank.number,
        label: `${bank.number} - ${bank.name}`
      })
      );
      setBanks(filtered_banks);
    }
  }, [loadedBanks]);

  if (loading && !Session) {
    return <Loader active={loading} />;
  }

  return brandData && !loading ? (
    <Formik
      initialValues={{ ...brandData }}
      validateOnChange
      validateOnBlur
      validationSchema={FormValidation}
      enableReinitialize={true}
      onSubmit={handleSave}
      validateOnMount={false}
    >
      {({ ...props }) => (<Form>

        <div style={{height: 40, display: 'flex', alignItems: 'center'}}>
          <h1>Dados da marca</h1>
        </div>

        <div className="yourBrand__brandinfo__wrapper brandInfos--wrapper df fdc">
          <div className="cards row">
            <div className="col boxCard">
              <h1 className="headerCard">Dados</h1>
              <div className="col card">

                <FormField2
                  text="Nome fantasia"
                  required
                  isRequired
                  className="login_input"
                  name="company_name"
                />

                <FormField2
                  text="Razão social"
                  required
                  isRequired
                  className="login_input"
                  name="company_trade_name"
                />

                <NumberField2
                  text='CNPJ'
                  name="company_document"
                  isRequired
                  format={{
                    format: "##.###.###/####-##",
                    mask: "_",
                    thousandSeparator: false
                  }}
                  currentValue={props.values.company_document}
                  className="login_input"
                />

                <FormField2
                  text="Inscrição estadual"
                  required
                  className="login_input"
                  name="company_state_registration"
                  isRequired={props.values.company_state_registration !== "Isento"}
                  disabled={props.values.company_state_registration === "Isento"}
                />

                <InputRadio
                  name="stateRegistration"
                  value={props.values.company_state_registration}
                  className="radioButton"
                  checked={props.values.company_state_registration === "Isento"}
                  labelClass="radioButton"
                  onClick={() => {
                    let val = ''
                    if (props.values.company_state_registration === "Isento") {
                      val = '';
                    } else {
                      val = 'Isento'
                    }
                    props.setFieldValue('company_state_registration', val);
                  }}
                >
                  Isento
                </InputRadio>
                <br />
                <div className={`input__ReactSelect`}>
                  <label>
                    <span>
                      Natureza jurídica
                    </span>
                  </label>

                  <Select
                    onChange={(value) => {
                      props.setFieldValue('company_legal_nature', value.value);
                    }}
                    isClearable
                    classNamePrefix="input__ReactSelect"
                    placeholder="Selecione..."
                    name="company_legal_nature"
                    value={
                      {
                        value: props.values.company_legal_nature,
                        label: legalNatureDefault[props.values.company_legal_nature]
                      }}
                    options={LEGAL_NATURE}
                  />
                </div>
                <div className={`input__ReactSelect`}>
                  <label>
                    <span>
                      Regime tributário
                    </span>
                  </label>

                  <Select
                    onChange={(value) => {
                      props.setFieldValue('company_tax_regime', value.value);
                    }}
                    isClearable
                    classNamePrefix="input__ReactSelect"
                    placeholder="Selecione..."
                    name="company_tax_regime"
                    value={
                      {
                        value: props.values.company_tax_regime,
                        label: taxRegimeDefault[props.values.company_tax_regime]
                      }}
                    options={TAX_REGIME}
                  />
                </div>
              </div>

              <Line />

              <div className="col boxCard">
                <h1 className="headerCard">Endereço</h1>
                <div className="col card">
                  <NumberField2
                    text='CEP'
                    name="postal_code"
                    format={{
                      format: "#####-###",
                      mask: "_",
                      thousandSeparator: false
                    }}
                    currentValue={updateAddressValue("postal_code",props.values.postal_code)}
                    directChange={(value) => {
                      if (value.value.length === 8) {
                        handlePostalCode(value.value);
                      }
                    }}
                    disabled={loadingPostalCode}
                    loading={loadingPostalCode}
                    className="login_input"
                    error={{
                      isError: errorPostalCode,
                      message: "CEP não encontrado"
                    }}
                  />

                  <FormField2
                    text="Rua/Avenida"
                    required
                    className="login_input"
                    name="address"
                    disabled={loadingPostalCode}
                    loading={loadingPostalCode}
                    value={dataPostalCode?.searchPostalCode?.address || props.values.address}
                    onChange={(e)=>{

                      props.setFieldValue('address',e.target.value)
                    }}
                  />

                  <div className="row ">
                    <div style={{ marginRight: 20 }}>
                      <FormField2
                        text="Número"
                        required
                        className="login_input"
                        name="address_number"
                      />
                    </div>

                    <FormField2
                      text="Complemento"
                      required
                      className="login_input"
                      name="complement"
                    />
                  </div>

                  <FormField2
                    text="Bairro"
                    required
                    className="login_input"
                    name="district"
                    disabled={loadingPostalCode}
                    loading={loadingPostalCode}
                    value={dataPostalCode?.searchPostalCode?.district || props.values.district}
                    onChange={(e)=>{

                      props.setFieldValue('district',e.target.value)
                    }}
                  />

                  <div className="row">
                    <FormField2
                      text="Município"
                      required
                      className="login_input"
                      name="city"
                      disabled={loadingPostalCode}
                      loading={loadingPostalCode}
                      value={dataPostalCode?.searchPostalCode?.city || props.values.city}
                      onChange={(e)=>{

                        props.setFieldValue('city',e.target.value);
                        props.setFieldValue('city_code', dataPostalCode?.searchPostalCode?.city_code );
                      }}
                    />
                    <div className="select-uf">
                      <Select
                        onChange={(value) => {
                          props.setFieldValue('state', value?.value);
                        }}
                        isClearable
                        classNamePrefix="input__ReactSelect"
                        placeholder="Selecione..."
                        name="state"
                        disabled={loadingPostalCode}
                        loading={loadingPostalCode}
                        value={
                          {
                            value: dataPostalCode?.searchPostalCode?.state || props.values.state,
                            label: UF_LEGEND[dataPostalCode?.searchPostalCode?.state || props.values.state]
                          }}
                        options={STATES}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col boxCard">
              <h1 className="headerCard">Finanças</h1>
              <div className="col card">
                <div className={`input__ReactSelect`}>
                  <label><span><span style={{ color: "red" }}>*</span>Banco</span></label>

                  <Select
                    onChange={(value) => {
                      props.setFieldValue('bank_name', value.value);
                      props.setFieldValue('bank_number', value.bank_number);
                    }}
                    classNamePrefix="input__ReactSelect"
                    placeholder="Selecione..."
                    name="bank_name"
                    value={findCurrentBank(props.values.bank_name)}
                    options={banks}
                  />
                </div>

                <FormField2
                  text="Agência"
                  required
                  isRequired
                  className="login_input"
                  name="bank_agency"
                />

                <FormField2
                  text="Nº da conta"
                  required
                  isRequired
                  className="login_input"
                  name="bank_account"
                />

                <div className={`input__ReactSelect`}>
                  <label><span><span style={{ color: "red" }}>*</span>Tipo de conta</span></label>

                  <Select
                    onChange={(value) => {
                      props.setFieldValue('account_type', value.value);
                    }}

                    classNamePrefix="input__ReactSelect"
                    placeholder="Selecione..."
                    name="account_type"
                    value={{
                      value: props.values.account_type,
                      label: accountTypeDefault[props.values.account_type]
                    }}
                    options={ACCOUNT_TYPE}
                  />
                </div>

                <div className={`input__ReactSelect`}>
                  <label><span><span style={{ color: "red" }}>*</span>Tipo de pessoa</span></label>

                  <Select
                    onChange={(value) => {
                      props.setFieldValue('person_type', value.value);
                    }}

                    classNamePrefix="input__ReactSelect"
                    placeholder="Selecione..."
                    name="person_type"
                    value={{
                      value: props.values.person_type,
                      label: personTypeDefault[props.values.person_type]
                    }}
                    options={PERSON_TYPE}
                  />
                </div>
              </div>

              <div className="col boxCard">
                <h1 className="headerCard">Obrigatoriedade de idade</h1>
                <div className="col card">

                  <div className="legality_title">Lover</div>
                  <Line />
                  <div style={{marginBottom: 20}}>
                    <Switch
                      label="Data nascimento obrigatória"
                      isOn={props.values.lover_mandatory_age || false}
                      switchLabelClassName="brithdate_required"
                      handleToggle={(e, multipleKey) => {
                        props.setFieldValue('lover_mandatory_age', !props.values.lover_mandatory_age);
                      }}
                      style={{width: '100%'}}
                    />
                  </div>

                  {props.values.lover_mandatory_age ?
                    <>
                      <br />
                      <FormField2
                        text="Idade Miníma"
                        type="number"
                        className="login_input"
                        name="lover_minimum_age"
                        disabled={!props.values.lover_mandatory_age}
                      />
                   </>
                  :null}

                  <Line />

                  <div className="legality_title">Cliente</div>
                  <Line />
                  <Switch
                    label="Data nascimento obrigatória"
                    isOn={props.values.customer_mandatory_age || false}
                    switchLabelClassName="brithdate_required"
                    handleToggle={(e, multipleKey) => {
                      props.setFieldValue('customer_mandatory_age', !props.values.customer_mandatory_age);
                    }}
                  />

                  {props.values.customer_mandatory_age ?
                    <>
                      <br />
                      <FormField2
                        text="Idade Miníma"
                        type="number"
                        className="login_input"
                        name="customer_minimum_age"
                      />
                    </>
                  :null}

                </div>
              </div>
            </div>
          </div>

          {props?.values?.id != "6" ?
            <div className="col boxCard" style={{maxWidth: 'fit-content'}}>
              <h1 className="headerCard">Banner Landing Page Auto Convite</h1>
              <div className="col card">
                <p>
                  Link da landing: {'  '}
                  <a href={`https://app.onawa.me/welcome/${props?.values?.external_id}`} target="_blank">Clique aqui</a>
                </p>
                <br/>
                <UploadImage
                  url={props?.values?.lp_banner_image}
                  name="lp_banner_image"
                  onChange={image => {
                    props.setFieldValue('lp_banner_image', image);
                  }}
                  buttonText={{
                    btChange: "Trocar Imagem",
                    btDefault: "Adicionar Imagem"
                  }}
                />
              </div>
            </div>
          :null}

          <div
            style={{
              display: compareObjects(originalData, props.values) ? "none" : "block"
            }}
            className="boxFooterSaveButton"
          >
            <div className="footerSaveButton">
              {/* <p>Você realizou alterações.</p> */}
              <Button
                primary
                className="btFullWidth"
                disabled={loading}
                text="SALVAR ALTERAÇÕES"
                type="submit"
              />
            </div>
          </div>
        </div>

      </Form>)
      }
    </Formik>
  ): <Loader active={true} />;
};
export { BrandInfos };
