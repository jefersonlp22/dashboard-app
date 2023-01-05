import React, {useState, useContext, useEffect } from 'react';

import {
  Line,
  Button,
  Loader,
  RichText
} from "../../../components";

import {Formik, Form} from "formik";
import { SessionContext } from '../../../contexts/Session.ctx';
import { useUpdateTenant } from '../../../hooks-api/useTenant';

import "./styles.scss";


const AmbassadorTerm = ({level}) => {
  const { Session, updateCurrentProperty  } = useContext(SessionContext);
  const [updatedTenant] = useUpdateTenant({ data: 'ambassador_contract' });
  const [loading, setLoading] = useState(false);
  const [term, setTerm] = useState('');

  const checkChanges = (value) => {           
    let contract = Session?.tenant?.current?.ambassador_contract;
    return contract === value.replace(/\r?\n|\r/g,"");
  }

  const handleSave = async (values) => {

    setLoading(true);
    try {
      let result = await updatedTenant({
        variables:{
          ambassador_contract: values.ambassador_contract
        }
      });            
      if (result) {            
        updateCurrentProperty({
          property: 'ambassador_contract',
          value: result.data.updateTenantMe.ambassador_contract
        });            
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };  

  useEffect(()=>{
    if(Session?.tenant?.current?.ambassador_contract){
      setTerm(Session?.tenant?.current?.ambassador_contract);
    }
  },[Session]);
  
  return (
    <Formik
      initialValues={{
        ambassador_contract: term || "",
      }}
      enableReinitialize={true}
      onSubmit={handleSave}
    >
      {({...props}) => (
        <Form className="term--wrapper">
          {loading ? <Loader active={true}/> : <>
          <div style={{height: 40, display: 'flex', alignItems: 'center'}}>
            <h1>Contrato do Lover</h1>
          </div>   
          <Line />
            <div className="expertRegister">
              <div className="expertRegister--board" style={{width: '100%', marginBottom: 100}}>
                {level !== 'master' ? <>
                  <h1 className="expertRegister--title">Texto do contrato</h1>
                  <Line/>
                  <RichText
                    placeholder="Escreva os termos aqui"
                    onChange={(value) => {
                      props.setFieldValue('ambassador_contract', value);
                    }}
                    initialValue={term}
                  />
                </> : <>
                  <div  dangerouslySetInnerHTML={{__html: term }} />                    
                </>}
              </div>
            </div>       
            {level !== 'master' ? 
              <div
                style={{
                  display: checkChanges(props.values.ambassador_contract) ? 'none' : "block"
                }}
                className="boxFooterButton"
              >
                <div className="footerButton">
                  <p>Você realizou alterações.</p>
                  <Button
                    primary
                    className="btFullWidth"
                    disabled={false}
                    text="SALVAR ALTERAÇÕES"
                    type="submit"
                  />
                </div>
              </div>
            : null}     
          </>}
        </Form>
      )}
    </Formik>
  );
}

export {AmbassadorTerm};
