import React from 'react';
import { FieldArray } from "formik";
import { Icons } from '../../../../components/Icons';
import NumberFormat from "react-number-format";
import Select from 'react-select';
import "./styles.scss";

const BonificationField = ({ text, name, form }) => {

  const typeLabel = {
    "percentage": "Percentual",
    "fixed": "Dinheiro Fixo"
  };

  const typeValuePrefix = {
    "percentage": "% ",
    "fixed": "R$ "
  };

  return (
    <div className="bonificationField">
      <label>{text}</label>
      <FieldArray
        name={name}
        render={arrayHelper => (
          <div>
            {form.values[name].map((field, index) =>
              <div key={`inKv${index}`} className="inputKeyValue__row">
                <div className="input_wrapper">
                  <input
                    type="text"
                    disabled={true}
                    value={index === 0 ? "Lover" : "Lover Responsável"}
                  />
                </div>
                <div className="input_wrapper">
                  <Select
                    className="typevalue"
                    classNamePrefix="typevalue"
                    placeholder="Selecione..."
                    isSearchable={false}
                    isClearable={false}
                    value={{ value: field.type, label: typeLabel[field.type] }}
                    defaultValue={{ value: field.type, label: typeLabel[field.type] }}
                    onChange={({ value }) => {
                      field.type = value;
                      arrayHelper.replace(index, field);
                    }}
                    options={[
                      { value: 'percentage', label: "Percentual" },
                      { value: 'fixed', label: "Dinhero Fixo" }
                    ]}
                  />
                </div>

                <NumberFormat
                  thousandSeparator={"."}
                  decimalSeparator={","}
                  decimalScale={2}
                  prefix={typeValuePrefix[field.type]}
                  text="valor"
                  value={field.value}
                  className="light input_wrapper"
                  onValueChange={values => {
                    field.value = values.floatValue;
                    arrayHelper.replace(index, field);
                  }}
                />
                <div
                  className="inputKeyValue__remove"
                  onClick={() => {
                    if (index > 0) arrayHelper.remove(index)
                  }}
                >
                  <Icons.circleTrash
                    fill={index > 0 ? 'currentColor' : 'transparent'}
                    style={{ cursor: index > 0 ? 'pointer' : 'default' }}
                  />
                </div>

              </div>
            )}

            {/* <div
              className="inputKeyValue__add"
              onClick={() => {
                let depth = form.values[name].length > 0 ? form.values[name].length : 0;
                arrayHelper.push({ depth, type: "percentage", value: 0 });
              }}>
                <Icons.circleAdd />Adicionar regra
            </div> */}

          </div>
        )}
      />
    </div>
  )
}

export { BonificationField };
