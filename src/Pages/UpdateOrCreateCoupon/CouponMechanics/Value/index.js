import React from 'react';
import { Formik, Form } from "formik";
import {
  RadioButton,
  NumberField,
  InputText
} from '../../../../components';
import VMasker from 'vanilla-masker';

import { Container, ContainerTitle, ContainerOption } from './styles';

const Value = ({ type, handleType, currentValue, setCurrentValue, published }) => {

  return (
    <Container>
      <div>
        <ContainerTitle>Tipo de desconto</ContainerTitle>
        <div className="type_radios">
          <ContainerOption>
            <RadioButton
              type="radio"
              disabled={published}
              checked={type === 'PRICE'}
              value="PRICE"
              onChoose={(e) => {handleType(e.currentTarget.value);  setCurrentValue(0) }}
              classes="comissionTable--checkbox"
            />
            <span className="cardStep__content">Valor</span>
          </ContainerOption>

          <ContainerOption>
            <RadioButton
              type="radio"
              disabled={published}
              checked={type === 'PERCENTAGE'}
              value="PERCENTAGE"
              onChoose={(e) => {handleType(e.currentTarget.value); setCurrentValue(0)}}
              classes="comissionTable--checkbox"
            />
            <span className="cardStep__content">Percentual</span>
          </ContainerOption>
        </div>
      </div>
      {type === 'PERCENTAGE' ?
        <Formik initialValues={{ valval: 0 }}>
        {({ ...props }) => (
          <Form>
            <NumberField
              text="Percentual de desconto"
              name="valval"
              disabled={published}
              format={{
                thousandSeparator: ".",
                decimalSeparator: ",",
                decimalScale: 2,
                prefix: type === 'PRICE' ? 'R$ ' : '',
                suffix: type === 'PERCENTAGE' ? ' %' : '',
              }}
              className="coupon_value_input"
              currentValue={type === 'PERCENTAGE' ? currentValue : VMasker.toMoney(currentValue)}
              directChange={(value) => {
                let checkedValue = type === 'PERCENTAGE' ? value.floatValue : value.value;
                if (type === 'PERCENTAGE' && checkedValue > 100) {
                  checkedValue = 100
                }
                setCurrentValue( type === 'PERCENTAGE' ? checkedValue : checkedValue);
              }}
            />
          </Form>
        )}
      </Formik>
      :
      <InputText
        readOnly={published}
        text={
          <span>
            Valor de desconto
          </span>
        }
        type="text"
        // onChange={published ? () => {} : e => {
        //   setCouponAudience('max_discount_amount', removeCharactersAndParseInt(e.target.value));
        //   setMaxDiscountValue(removeCharactersAndParseInt(e.target.value))
        // }}
        onChange={published ? () => {} : e => { setCurrentValue(e.target.value)}}
        value={`R$ ${VMasker.toMoney(currentValue)}`}
        className="coupon_value_input"
        required
      />
      }
    </Container>
  );
};

export default Value;

