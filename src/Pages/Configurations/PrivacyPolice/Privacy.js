import React, {useState, useContext, useEffect} from 'react'

import {
  RichText,
  Line,
  Button,
  Loader,
  Icons,
  FormField
} from "../../../components";
import {Formik, Form} from "formik";

import { SessionContext } from '../../../contexts/Session.ctx';
import { useUpdateTenant } from '../../../hooks-api/useTenant';

const Privacy = ({setScreen, level}) =>{
  const { Session, updateCurrentProperty  } = useContext(SessionContext);
  const [updatedTenant] = useUpdateTenant({});
  const [term, setTerm] = useState('');
  const [typeOfTerm, setTypeOfTerm] = useState('');
  const [loading, setLoading] = useState(false);


  const checkChanges = (values) => {
    if(values?.term_of_use !== Session?.tenant?.current?.term_of_use ||
      values?.typeof_terms !== Session?.tenant?.current?.typeof_terms ){
        return true;
    }
    return false;
  }

  const handleSave = async (values) => {
    setLoading(true);
    try {
      let result = await updatedTenant({
        variables:{
          term_of_use: values?.term_of_use,
          typeof_terms: values?.typeof_terms
        }
      });
      if (result) {
        updateCurrentProperty({
          property: 'term_of_use',
          value: result.data.updateTenantMe.term_of_use
        });
        updateCurrentProperty({
          property: 'typeof_terms',
          value: result.data.updateTenantMe.typeof_terms
        });
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(()=>{
    setLoading(true);
    if(Session){
      setTerm(Session?.tenant?.current?.term_of_use);
      setTypeOfTerm(Session?.tenant?.current?.typeof_terms);
      setLoading(false);
    }
    // eslint-disable-next-line
  },[Session]);

  return(
    <Formik
      initialValues={{
        term_of_use: term || "",
        typeof_terms: typeOfTerm
      }}
      enableReinitialize={true}
      onSubmit={handleSave}
    >
    {({...props}) => (
      <Form className="policyForm">

        <div style={{height: 40, display: 'flex', alignItems: 'center'}}>
          <h1>Política de Privacidade</h1>
        </div>

        <Line />
          <div className="policyForm--container">
          {loading ? <Loader active={true}/> : <>
            <div className="policyForm--board" style={{width: '100%'}}>
              <div className="iconBack">
                <Icons.back onClick={()=>setScreen()} />
              </div>

              <Line/>
              { level !== 'master' ? <>
                <div className="df fdr alic">
                  <label>
                    <div className="specialRadioBox">
                      <input
                        type="radio"
                        name="typeof_terms"
                        value="text"
                        checked={props?.values?.typeof_terms === "text"}
                        onChange={()=>{
                          props.setFieldValue('typeof_terms', 'text')
                        }}
                      />
                      <span className="check"></span>
                      Texto
                    </div>
                  </label>

                  <label>
                    <div className="specialRadioBox">
                      <input
                        type="radio"
                        name="typeof_terms"
                        value="link"
                        checked={props?.values?.typeof_terms === "link"}
                        onChange={()=>{
                          props.setFieldValue('typeof_terms', 'link');
                        }}
                      />
                      <span className="check"></span>
                      Link externo
                    </div>
                  </label>
                </div>

                {props?.values?.typeof_terms === "text" ?
                  <RichText
                    placeholder="Escreva os termos aqui"
                    onChange={(value) => {
                      props.setFieldValue('term_of_use', value);
                    }}
                    initialValue={term}
                  />
                :
                  <>
                    <Line />
                    <Line />
                    <FormField
                      text="Link para politica de privacidade"
                      required
                      className="login_input"
                      name="term_of_use"
                      type="url"
                    />
                  </>
                }
              </> :
                 <div>
                  {props?.values?.typeof_terms === "text" ?
                    <div  dangerouslySetInnerHTML={{__html: props?.values?.term_of_use }} />
                    :
                    <div>
                      <p>Veja a política de privacidade da marca em: </p>
                      <a href={props?.values?.term_of_use} target="_blank">{props?.values?.term_of_use}</a>
                    </div>
                  }
                </div>
              }
            </div>
            </>}
          </div>
          <div
            style={{
              display: checkChanges(props.values) && !loading ? 'block' : 'none'
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

      </Form>
    )}
  </Formik>
  )
}

export { Privacy };
