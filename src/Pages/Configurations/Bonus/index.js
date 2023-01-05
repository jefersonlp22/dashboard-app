import React, { useState, useEffect, useContext } from 'react';
import {Formik, Form} from "formik";
import _ from 'lodash';
import Select from 'react-select';
import {
  Row,
  Line,
  Button,
  Col,
  Loader
} from "../../../components";
import { BonificationField } from './BonificationField';
import { SessionContext } from '../../../contexts/Session.ctx';
import { useUpdateSettings } from '../../../hooks-api/useTenant';

import "./styles.scss";

const Bonus = () => {
  const { Session, updateCurrentProperty } = useContext(SessionContext);
  const [updatedSetting] = useUpdateSettings({ data: 'bonus' });
  const [loading, setLoading] = useState(false);
  const [bonusData, setBonusData] = useState(null);

  const selectBonusType = {
    "money" : "Dinheiro",
    "points": "Pontos"
  };

  const selectSplitType = {
    0 : "Inativo",
    1 : "Ativo"
  };

  const selectBonusPaymentType = {
    "cash_payment" : "A vista",
    "installment": "Parcelado"
  };

  const compareObjects = (obj1, obj2) =>{
    if(_.isEqual(obj1, obj2)){
      return true;
    }else{
      return false;
    }
  }

  const checkChanges = (values) =>{
    return compareObjects(values, Session?.tenant?.current?.data?.bonus);
  }

  const handleSave =  async (values) =>{
    setLoading(true);
    try {
      let result = await updatedSetting({ variables: {
        bonus: values
      } });
      if (result) {
        updateCurrentProperty({
          property: 'bonus',
          value: result.data.settings.bonus,
          data: true
        });
        // setBonusData(result.data.settings.bonus);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(()=>{
    if(Session){
      let cloned = _.cloneDeep(Session?.tenant?.current?.data?.bonus);
      setBonusData(cloned);
    }
  },[Session]);

  return bonusData ? (
    <Formik
      initialValues={{
        bonus_type: bonusData?.bonus_type || "",
        bonus_rules: bonusData?.bonus_rules || [],
        split_payment: bonusData?.split_payment || 0,
        bonus_payment_type: bonusData?.bonus_payment_type || "",
      }}
      onSubmit={handleSave}
      >
        {({ ...props }) => (
          <Form className="bonus--wrapper">

           {loading ? <Loader active={true}/> : <>
              <div className="bonus">
                  <div style={{height: 40, display: 'flex', alignItems: 'center'}}>
                <h1>Bonificação</h1>
              </div>
              <Line />
                <div className="bonus--board">

                      <Row>
                        <Col style={{marginRight: 40}}>
                          <div className={`input__ReactSelect`}>
                            <label>
                              <span>
                                Tipo de bonificação
                              </span>
                            </label>

                            <Select
                              onChange={(value)=>{
                                props.setFieldValue('bonus_type',value.value);
                              }}
                              isClearable={false}
                              classNamePrefix="input__ReactSelect"
                              placeholder="Selecione..."
                              name="bonus_type"
                              value={
                                {
                                  value: props.values.bonus_type,
                                  label: selectBonusType[props.values.bonus_type]
                                }}
                              options={[
                                {value: "money", label: "Dinheiro"},
                                {value: "points", label: "Pontos"}
                              ]}
                            />
                          </div>
                        </Col>
                        <Col>
                          <div className={`input__ReactSelect`}>
                            <label>
                              <span>
                                Split do pagamento
                              </span>
                            </label>

                            <Select
                              onChange={(value)=>{
                                props.setFieldValue('split_payment',value.value);
                              }}
                              isClearable={false}
                              classNamePrefix="input__ReactSelect"
                              placeholder="Selecione..."
                              name="split_payment"
                              value={
                                {
                                  value: props.values.split_payment,
                                  label: selectSplitType[Number(props.values.split_payment)]
                                }}
                              options={[
                                {value: 0, label: "Inativo"},
                                {value: 1, label: "Ativo"}
                              ]}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col style={{maxWidth: 300}}>
                        <div className={`input__ReactSelect`}>
                            <label>
                              <span>
                              Pagamento da bonificação
                              </span>
                            </label>

                            <Select
                              onChange={(value)=>{
                                props.setFieldValue('bonus_payment_type',value.value);
                              }}
                              isClearable={false}
                              classNamePrefix="input__ReactSelect"
                              placeholder="Selecione..."
                              name="bonus_payment_type"
                              value={
                                {
                                  value: props.values.bonus_payment_type,
                                  label: selectBonusPaymentType[props.values.bonus_payment_type]
                                }}
                              options={[
                                {value: "cash_payment", label: "A vista"},
                                {value: "installment", label: "Parcelado"}
                              ]}
                            />
                          </div>
                        </Col>
                      </Row>

                      <BonificationField
                        text="Regra de bonificação"
                        form={props}
                        name="bonus_rules"
                      />
                </div>
              </div>
              <div
                style={{
                  display: checkChanges(props.values)? 'none' : "block"
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
    </Formik>) : (<Loader active={true} />);
}

export { Bonus };
