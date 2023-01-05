import React from 'react';

import { 
  Row, 
  Line, 
  Icons, 
  Breadcrumbs,
  FormField,   
  InputText,
  InputAddress
} from "../../../../components";

import NumberFormat from "react-number-format";

import {Formik, Form} from "formik";

import Tabs from "../../../../Layouts/Tabs";

import "./styles.scss";
import moment from 'moment';


const accountType = {
  "corrente": "Corrente",
  "poupanca": "Poupança"
};

const personType = {
  "pf": "Pessoa Física",
  "pj": "Pessoa Jurídica"
};

const ExpertRegister = ({onBack, breadcrumbs, expert, tabItems}) => {   
  
    return (
      <Formik 
        initialValues={{
          email: expert?.email || "",    
          name: expert?.name || "", 
          phone: expert?.phone || "",  
          document: expert?.document || "",
          birthday: expert?.birthday ? moment(expert?.birthday).format("DD/MM/YYYY") : '',
          company_name: expert?.company_name || "",
          company_trade_name: expert?.company_trade_name || "",
          company_document: expert?.company_document || "",
          company_state_registration: expert?.company_state_registration || "",
        }}>
          {({ errors, touched, handleBlur, setFieldValue,validateField, validateForm, values }) => (
            <>
            {tabItems ? <Tabs items={tabItems} /> :null}
            <div className="expertRegister">
              {breadcrumbs.length ? 
                <Breadcrumbs itens={breadcrumbs} /> 
              : null}              
            
              <div className="expertRegister--board">
                  <div className="expertRegister--returnWrapper">
                    <div
                      className="expertRegister--iconBack"
                      onClick={onBack}
                    >
                      <Icons.back />
                    </div>
                  </div>
                  <div>
                    <p className="previus">{expert?.name}</p>

                    <h1 className="expertRegister--title">Cadastro</h1>            
                    <h2 className="expertRegister--subtitle">Dados Pessoa Física</h2>            
                    <Line />
                    <Line />
                    <Row>  
                      
                        <Form>
                          <FormField
                            text="E-mail"
                            required
                            className="login_input"
                            name="email"  
                            disabled={true}                     
                          />
                          <FormField
                            text="Nome"
                            required
                            className="login_input"
                            name="name" 
                            disabled={true}                        
                          />
                          
                          <NumberFormat
                            thousandSeparator={false}
                            text="Telefone"
                            required
                            format="(##) #####-####"
                            mask="_"
                            customInput={InputText}
                            value={expert.phone || ""}
                            className="login_input"
                            disabled={true}   
                          />
                          
                          <NumberFormat
                            thousandSeparator={false}
                            text="CPF"
                            required
                            format="###.###.###-##"
                            mask="_"
                            customInput={InputText}
                            value={expert.document || ""}
                            className="login_input"
                            disabled={true}   
                          />
                          
                          <FormField
                            text="Data de nascimento"
                            required
                            className="login_input"
                            name="birthday"  
                            disabled={true}                     
                          />
                          
                          <InputAddress 
                            text="Endereço pessoal"
                            id={expert?.address?.id}
                            name={expert?.address?.name}
                            address={expert?.address?.address}
                            addressee={expert?.address?.addressee}
                            number={expert?.address?.number}
                            complement={expert?.address?.complement}
                            district={expert?.address?.district}
                            city={expert?.address?.city}
                            postalCode={expert?.company_address?.postal_code}
                            state={expert?.address?.state}                          
                          />
                                                   
                          <h2 className="expertRegister--subtitle">Dados Pessoa Jurídica</h2>            
                          <Line />
                          <Line />

                          <FormField
                            text="Razão social"
                            required
                            className="login_input"
                            name="company_name" 
                            disabled={true}                        
                          /> 

                          <FormField
                            text="Nome fantasia"
                            required
                            className="login_input"
                            name="company_trade_name" 
                            disabled={true}                        
                          /> 

                          <NumberFormat
                            thousandSeparator={false}
                            text="CNPJ"
                            required
                            format="##.###.###/####-##"
                            mask="_"
                            customInput={InputText}
                            value={expert.company_document || ""}
                            className="login_input"
                            disabled={true}   
                          />
                          
                          <FormField
                            text="Inscrição estadual"
                            required
                            className="login_input"
                            name="company_state_registration" 
                            disabled={true}                        
                          />      
                          
                          <InputAddress 
                            text="Endereço empresarial"
                            id={expert?.company_address?.id}
                            name={expert?.company_address?.name}
                            address={expert?.company_address?.address}
                            addressee={expert?.company_address?.addressee}
                            number={expert?.company_address?.number}
                            complement={expert?.company_address?.complement}
                            district={expert?.company_address?.district}
                            city={expert?.company_address?.city}
                            postalCode={expert?.company_address?.postal_code}
                            state={expert?.company_address?.state}                           
                          />

                          {expert?.accounts?.length ? (
                            <>
                              <h2 className="expertRegister--subtitle">Dados Financeiros</h2>            
                              <Line /> 
                              {expert?.accounts.map((account,index)=>(
                                <div 
                                  key={`${account.id}${account.bank_name}`}
                                  className="expertRegister--account"
                                >
                                  <div className="expertRegister--account--title">Conta bancária</div>                                  
                                  <div>{account?.bank_number || '---'} - {account?.bank_name  || '---'}</div>                                  
                                  <div>
                                    {account.account_type ? 
                                      'Conta '+ accountType[account.account_type.toLowerCase()] : ''}
                                    
                                    {account.person_type ? ' - ' + personType[account.person_type.toLowerCase()] : '' }
                                  </div>
                                  <div>Agência: {account?.bank_agency || '---'} | Conta: {account?.bank_account  || '---'}</div>
                                              
                                </div>
                              ))}
                            </>
                          ):null}

                          

                        </Form>
                    </Row>            
                  </div>
              </div>
            </div>
          </>
        )}
      </Formik>
    );
}

export default ExpertRegister;
