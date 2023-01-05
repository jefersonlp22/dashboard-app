import React, { useEffect, useState, useContext } from "react";
import {
  Line,
  FormField,
  Button,
  NumberField,
  Loader,
} from "../../../components";
import Select from "react-select";
import _ from "lodash";
import { Formik, Form } from "formik";
import { SessionContext } from "../../../contexts/Session.ctx";
import { useUpdateSettings } from "../../../hooks-api/useTenant";
import "./styles.scss";

const PaymentMethods = () => {
  const { Session, updateCurrentProperty } = useContext(SessionContext);
  const [updatedSetting] = useUpdateSettings({ data: "payment_methods" });

  const [paymentsData, setPaymentData] = useState({});
  const [loading, setLoading] = useState(false);

  const selectAutoManu = {
    manual: "Manual",
    auto: "Automático",
  };

  const selectPaymentType = {
    credit_card: "Cartão de crédito",
    bank_slip: "Boleto",
    all: "Ambos",
  };

  const compareObjects = (obj1, obj2) => {
    if (_.isEqual(obj1, obj2)) {
      return true;
    } else {
      return false;
    }
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      let result = await updatedSetting({
        variables: {
          payment_methods: {
            ...values,
            max_installments: Number(values.max_installments),
            min_amount_per_installment: Number(
              values.min_amount_per_installment
            ),
            min_transaction_value: Math.round(parseFloat(values.min_transaction_value) * 100),
            working_days_to_expire_transaction: Number(
              values.working_days_to_expire_transaction
            ),
          },
        },
      });
      if (result) {
        updateCurrentProperty({
          property: "payment_methods",
          value: result.data.settings.payment_methods,
          data: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (Session) {
      setPaymentData(Session?.tenant?.current?.data?.payment_methods);
    }
    // eslint-disable-next-line
  }, [Session]);

  return Session ? (
    <Formik
      initialValues={{
        working_days_to_expire_transaction:
          paymentsData?.working_days_to_expire_transaction || "",
        payment_type: paymentsData?.payment_type || "",
        max_installments: paymentsData?.max_installments || "",
        min_amount_per_installment:
          paymentsData?.min_amount_per_installment || "",
        min_transaction_value: paymentsData?.min_transaction_value / 100 || "",
        order_approve_juridical_person:
          paymentsData?.order_approve_juridical_person || "",
        order_approve_natural_person:
          paymentsData?.order_approve_natural_person || "",
      }}
      enableReinitialize={true}
      onSubmit={handleSave}
    >
      {({ ...props }) => (
        <Form className="paymentMethods--wrapper">
          {loading ? (
            <Loader active={true} />
          ) : (
            <>
              <div className="expertRegister">
                <div
                  style={{ height: 40, display: "flex", alignItems: "center" }}
                >
                  <h1>Cobrança</h1>
                </div>
                <Line />
                <div className="expertRegister--board">
                  <div className={`input__ReactSelect`}>
                    <label>
                      <span>
                        {/* {isRequired && <span style={{ color: "red" }}>* </span>} */}
                        Aprovação pedido cliente pessoa física
                      </span>
                    </label>

                    <Select
                      onChange={(value) => {
                        props.setFieldValue(
                          "order_approve_natural_person",
                          value.value
                        );
                      }}
                      isClearable
                      classNamePrefix="input__ReactSelect"
                      placeholder="Selecione..."
                      name="order_approve_natural_person"
                      value={{
                        value: props.values.order_approve_natural_person,
                        label:
                          selectAutoManu[
                            props.values.order_approve_natural_person
                          ],
                      }}
                      options={[
                        { value: "manual", label: "Manual" },
                        { value: "auto", label: "Automático" },
                      ]}
                    />
                  </div>

                  {/*<div className={`input__ReactSelect`}>*/}
                  {/*  <label>*/}
                  {/*    <span>*/}
                  {/*      Aprovação pedido cliente pessoa jurídica*/}
                  {/*    </span>*/}
                  {/*  </label>*/}

                  {/*  <Select*/}
                  {/*    onChange={(value)=>{*/}
                  {/*      props.setFieldValue('order_approve_juridical_person',value.value);*/}
                  {/*    }}*/}
                  {/*    isClearable*/}
                  {/*    classNamePrefix="input__ReactSelect"*/}
                  {/*    placeholder="Selecione..."*/}
                  {/*    name="order_approve_juridical_person"*/}
                  {/*    value={*/}
                  {/*      {*/}
                  {/*        value: props.values.order_approve_juridical_person,*/}
                  {/*        label: selectAutoManu[props.values.order_approve_juridical_person]*/}
                  {/*      }}*/}
                  {/*    options={[*/}
                  {/*      {value: "manual", label: "Manual"},*/}
                  {/*      {value: "auto", label: "Automático"}*/}
                  {/*    ]}*/}
                  {/*  />*/}
                  {/*</div>*/}

                  <FormField
                    text="Dias úteis para o vencimento do pedido após aprovação"
                    required
                    className="login_input"
                    name="working_days_to_expire_transaction"
                    type="number"
                  />

                  <div className={`input__ReactSelect`}>
                    <label>
                      <span>Tipo de pagamento</span>
                    </label>

                    <Select
                      onChange={(value) => {
                        props.setFieldValue("payment_type", value.value);
                      }}
                      isClearable
                      classNamePrefix="input__ReactSelect"
                      placeholder="Selecione..."
                      name="payment_type"
                      value={{
                        value: props.values.payment_type,
                        label: selectPaymentType[props.values.payment_type],
                      }}
                      options={[
                        { value: "credit_card", label: "Cartão de crédito" },
                        { value: "bank_slip", label: "Boleto" },
                        { value: "all", label: "Ambos" },
                      ]}
                    />
                  </div>

                  <FormField
                    text="Máximo de parcelas"
                    required
                    className="login_input"
                    name="max_installments"
                    type="number"
                    value={props.values.max_installments}
                  />

                  <NumberField
                    text="Valor mínimo por parcela"
                    name="min_amount_per_installment"
                    format={{
                      thousandSeparator: ".",
                      decimalSeparator: ",",
                      prefix: "R$ ",
                    }}
                    className="login_input"
                    currentValue={props.values.min_amount_per_installment}
                    directChange={(value) => {
                      props.setFieldValue(
                        "min_amount_per_installment",
                        value.floatValue
                      );
                    }}
                  />

                  <NumberField
                    text="Valor mínimo por transação"
                    name="min_transaction_value"
                    format={{
                      thousandSeparator: ".",
                      decimalSeparator: ",",
                      prefix: "R$ ",
                    }}
                    className="login_input"
                    currentValue={props.values.min_transaction_value}
                    directChange={(value) => {
                      props.setFieldValue(
                        "min_transaction_value",
                        value.floatValue
                      );
                    }}
                  />

                </div>
              </div>
              {Session && !loading ? (
                <div
                  style={{
                    display: compareObjects(props.values, {...paymentsData, min_transaction_value: paymentsData.min_transaction_value/100})
                      ? "none"
                      : "block",
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
              ) : null}
            </>
          )}
        </Form>
      )}
    </Formik>
  ) : (
    <Loader active={true} />
  );
};

export { PaymentMethods };
