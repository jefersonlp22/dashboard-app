import React, {useEffect, useState, useContext, useMemo} from 'react';

import {
  Line,
  FormField,
  Button,  
  Loader
} from "../../../components";

import _ from 'lodash';

import {Formik, Form} from "formik";

import { SessionContext } from '../../../contexts/Session.ctx';
import { useUpdateSettings, useGenerateWebhookSecret } from '../../../hooks-api/useTenant';

import "./styles.scss";


const Webhooks = () => {
  const { Session, updateCurrentProperty  } = useContext(SessionContext);
  const [generateSecret, { data: updatedSecret }] = useGenerateWebhookSecret();
  const [updatedSetting] = useUpdateSettings({ data: 'webhooks' });

  const [hooks, setHooksData] = useState({});
  const [fullSecret, setFullSecret] = useState('');
  const [suffixSecret, setSuffixSecret] = useState('');
  const [loading, setLoading] = useState(false);

  const compareObjects = (obj1, obj2) => {     
    if (_.isEqual(obj1, obj2)) {
      return true;
    } else {
      return false;
    }
  }

  const handleSave = async (values) => {
    setLoading(true);
    try {
      let result = await updatedSetting({ variables: {
        webhooks: values
      } });            
      if (result) {                    
        updateCurrentProperty({
          property: 'webhooks',
          value: result.data.settings.webhooks,
          data: true
        });          
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  
  const handleHMACKey = async () => {
    setLoading(true);
    try {
      await generateSecret();
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useMemo(()=>{
    if (updatedSecret) {      
      setFullSecret(updatedSecret.generateWebhookSecret.secret);
      setSuffixSecret(updatedSecret.generateWebhookSecret.suffix);      
      updateCurrentProperty({
        property: 'webhooks',
        value: {
          ...Session?.tenant?.current?.data?.webhooks,
          secret: updatedSecret.generateWebhookSecret.suffix
        },
        data: true
      });          
    
    }
    // eslint-disable-next-line
  } , [updatedSecret]);

  useEffect(() => {    
    if(Session){
      setSuffixSecret(Session?.tenant?.current?.data?.webhooks?.secret);        
      setHooksData(Session?.tenant?.current?.data?.webhooks);
    }    
  }, [Session]);

  return (
    <Formik
      initialValues={{
        order_created: hooks?.order_created || "",
        order_approved: hooks?.order_approved || "",
        order_canceled: hooks?.order_canceled || "",
        order_paid: hooks?.order_paid || "",
        secret: hooks?.secret || "",
      }}
      enableReinitialize={true}
      onSubmit={handleSave}
    >
      {({...props}) => (
        <Form className="webhooks--wrapper">
          {loading ? <Loader active={true}/> : <>
            <div className="webhooks">
            <div style={{height: 40, display: 'flex', alignItems: 'center'}}>
                <h1>Integração</h1>
              </div>   
              <Line />
              <div className="webhooks--board">                

                <FormField
                  text="Hook de pedido enviado"
                  required
                  className="login_input"
                  name="order_created"
                />

                <FormField
                  text="Hook de pedido aprovado"
                  required
                  className="login_input"
                  name="order_approved"
                  value={props.values.order_approved}
                />

                <FormField
                  text="Hook de pedido cancelado"
                  required
                  className="login_input"
                  name="order_canceled"
                  value={props.values.order_canceled}
                />

                <FormField
                  text="Hook de pedido pago"
                  required
                  className="login_input"
                  name="order_paid"
                  value={props.values.order_paid}
                />

                <Line/>

                <div className="df fdc alic">

                  {fullSecret !== '' ?
                    <>
                      <p>Salve sua chave para utilizar nas validações dos webhooks</p>
                      <p>{fullSecret}</p>
                    </>
                    : null}

                  {fullSecret === '' && suffixSecret !== '' ?
                    <p>Última chave gerada ****{suffixSecret}</p>
                    : null}

                  <Button
                    type="button"
                    className="success"
                    onClick={() => {
                      handleHMACKey();
                    }}
                  >
                    {fullSecret !== '' ? 'Gerar nova chave HMAC' : null}
                    {fullSecret === '' && suffixSecret !== '' ? 'Atualizar chave HMAC' : null}
                    {fullSecret === '' && suffixSecret === '' ? 'Gerar chave HMAC' : null}
                  </Button>
                </div>


              </div>
            </div>
            <div
              style={{
                display: compareObjects(props.values, hooks) ? 'none' : "block"
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
          </>}
        </Form>
      )}
    </Formik>
  );
}

export {Webhooks};
