import React, { useState } from "react";

import {Formik, Form} from "formik";
import * as Yup from 'yup';


import { Button, Icons, FormField, NumberField, validarCNPJ, formatCnpjCpf } from "../../components";
import { AuthLayout } from "../../Layouts/AuthLayout";
import { useHistory } from "react-router-dom";

import { useUpdateTenantMe } from "../../gqlEndpoints/mutations";

import "./style.scss";
import { entidadesEmpresariais } from "./naturezasJuridicas";


Yup.addMethod(Yup.string, 'isFree', function(message) {
  return this.test('is-free-state-registry', message, function(value) {
      const { path, createError,parent } = this;
      if(parent.isencao || value !== undefined){        
        return true;
      }
      return  createError({path, message});
  });
}); 

const FormValidation = Yup.object().shape({
  company_name: Yup.string()
    .required("Preencha este campo"),
  company_trade_name:  Yup.string()
    .required("Preencha este campo"),
  company_document:  Yup.string()
    .required("Preencha este campo")
    .test('is-cnpj','Digite um CNPJ válido', (value)=>{   
      if(value){
        let formattedValue = formatCnpjCpf(value);
        let teste = validarCNPJ(formattedValue);
        return teste;
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

});


function Company() {
  const history = useHistory();
  const { updateByQuery } = useUpdateTenantMe();

  const [loading, setLoading] = useState(false);

  async function handleConfirm(props) {
    setLoading(true);

    const {
        company_name,
        company_trade_name, 
        company_document, 
        company_state_registration,
        company_legal_nature,
        company_tax_regime
    } = props;
    
    let saved = await updateByQuery(`{        
      company_name: "${company_name}",
      company_trade_name: "${company_trade_name}",
      company_document: "${company_document}",
      company_state_registration: "${company_state_registration}",
      company_legal_nature: "${company_legal_nature}",
      company_tax_regime: "${company_tax_regime}"
    }`);

    if (saved) {
      setTimeout(() => {
        history.push("/register-bank");
      }, 300);
    }
  
    setLoading(false);
  }

  return (
    <Formik
      initialValues={{
        company_name: "",
        company_trade_name: "",
        company_document: "",
        formatted_company_document: "",
        company_state_registration: "",
        company_legal_nature: "",
        company_tax_regime: "",
        isencao: false
      }}
      validateOnChange={true}
      validateOnBlur={true}
      validationSchema={FormValidation}      
      onSubmit={handleConfirm}
    >
    {({ errors, touched, handleBlur, setFieldValue,validateField, validateForm, values }) => (
    <Form>
      <AuthLayout
        title="Criar nova marca"
        leftIcon={<Icons.back fill="#FFF" onClick={() => history.goBack()} />}
        rightIcon={<Icons.close fill="#FFF" />}
        submit={e => handleConfirm(e)}
        layoutClassName="companyWizard"
      >
        <AuthLayout.card title="Vamos precisar de alguns dados sobre sua marca">

          <FormField
            text="Nome fantasia"
            required
            className="login_input"
            name="company_trade_name"   
                   
          />

          <FormField
            text="Razão social"
            required
            className="login_input"
            name="company_name"          
          />
      

          <NumberField
            text='CNPJ'
              name="company_document"
              format={{
                format: "##.###.###/####-##",
                mask: "_",
                thousandSeparator: false
              }}
              className="login_input"
             
          />


          <NumberField
            text='Inscrição estadual'
            name="company_state_registration"
            format={{
              format: "#########################",
              
              thousandSeparator: false
            }}       
            className="login_input"
          />
          
          <label className="inputCheckbox">
            <input
              type="checkbox"
              value={values.isencao}
              onChange={
                (e)=>{
                  e.persist();                   
                  values.isencao = (e.target.value === "false" && values.isencao === false);                  
                }
              }
            />
            <span>Isento</span>
          </label>

          <label  className={`inputSelect ${errors.company_legal_nature && touched.company_legal_nature? 'selectError' : ''}`}>
            <span>Natureza jurídica:</span>
            <select              
              onChange={(e)=>{
                e.persist();
                setFieldValue("company_legal_nature", e.target.value);               
              }}
            >
              <option value=""></option>
              {entidadesEmpresariais.map((item, index) => (
                <option key={`juridc${index}`} value={item.codigo}>
                  ({item.codigo}) {item.natureza}
                </option>
              ))}
            </select>
            {errors.company_legal_nature && touched.company_legal_nature && <div className='selectErroMessage'>{errors.company_legal_nature}</div>}
          </label>

          <label className={`inputSelect ${errors.company_tax_regime && touched.company_tax_regime? 'selectError' : ''}`}>
            <span>Regime tributário:</span>
            <select                        
              onChange={(e)=>{
                e.persist();
                setFieldValue("company_tax_regime", e.target.value);                
              }}
            >
              <option value=""></option>
              <option>Simples nacional</option>
              <option>Lucro presumido</option>
              <option>Lucro real</option>
            </select>
            {errors.company_tax_regime && touched.company_tax_regime && <div className='selectErroMessage'>{errors.company_tax_regime}</div>}
          </label>

        </AuthLayout.card>
        <AuthLayout.actions>
          <Button
            text="Próximo"
            primary
            type="submit"
            disabled={loading}
            className="register__wizard--buttonConfirm"
          />
        </AuthLayout.actions>
      </AuthLayout>
    </Form>
    )}
    </Formik>
  );
}

export { Company };
