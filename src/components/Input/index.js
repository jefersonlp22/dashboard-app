import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Select from 'react-select';
import { Field, ErrorMessage, useField } from "formik";
import NumberFormat from "react-number-format";

import "./Input.style.scss";

const LayoutField = ({
  field,
  text,
  light,
  placeholder,
  className,
  inputName,
  loading,
  ...props
}) => {
  return (
    <>
      <div
        className={`input_text
        ${className || ""}
        ${props.form.errors[inputName] ? "inputError" : ""}
        ${className || ""}
        ${light ? "light" : ""}`}
      >
        <InputLayout
          text={text}
          light={light}
          className={className}
          placeholder={placeholder}
          {...field}
          {...props}
        />
        {loading? <span className="inputLoader"></span> : null}
        <ErrorMessage component={LayoutError} name={inputName} />
      </div>
    </>
  );
};

const LayoutError = ({ children }) => {
  return <div className="input__erroText">{children}</div>;
};

const FormField = ({ name, ...props }) => (
  <Field name={name} inputName={name}  {...props} component={LayoutField} />
);

const FormField2 = ({ name, ...props }) => (
  <Field name={name} >
    {({field, form, meta}) =>(
      <LayoutField
        inputName={name}
        field={field}
        form={form}
        meta={meta}
        {...props}
      />
    )}
  </Field>
);

const NumberField2 = ({ text, name, currentValue, loading, isRequired, className, light, format, value, setFormattedValue, directChange, onBlur, ...props }) => {
  return (
    <Field name={name} >
      {({field, form, meta}) =>(
        <div
          className={`input_text ${className || ""} ${
            form.errors[name] || props?.error?.isError ? "inputError" : ""
          } ${light ? "light" : ""}`}
        >
          <NumberFormat
            {...format}
            value={currentValue}
            text={<>
              {isRequired && <span style={{ color: "red" }}>* </span>}
              {text ||"Número do celular"}
            </>}
            required
            name={"phone"}
            onValueChange={values => {
              form.setFieldValue(name, values.value);
              if(directChange){
                directChange(values);
              }else{
                if(setFormattedValue){
                  setFormattedValue(values.formattedValue);
                }
              }
            }}
            form={form}
            customInput={InputLayout}
            onBlur={onBlur}
          />
          {loading? <span className="inputLoader"></span> : null}
          {form.errors[name] || props?.error?.isError ?  <LayoutError>{form.errors[name] || props?.error?.message}</LayoutError> : null}
          <ErrorMessage component={LayoutError} name={name} />
        </div>
      )}
    </Field>
  );
};


const NumberField = ({ text, disabled, name, currentValue, isRequired, className, light, format, value, setFormattedValue, directChange, onBlur, ...props }) => {
  return (
    <Field
      name={name}
      {...props}
      render={({ form, ...props }) => {
        return (
          <div
            className={`input_text ${className || ""} ${
              form.errors[name] ? "inputError" : ""
            } ${light ? "light" : ""}`}
          >
            <NumberFormat
              {...format}
              value={currentValue}
              disabled={disabled}
              text={<>
                {isRequired && <span style={{ color: "red" }}>* </span>}
                {text ||"Número do celular"}
              </>}
              required
              name={"phone"}
              onValueChange={values => {
                form.setFieldValue(name, values.value);
                if(directChange){
                  directChange(values);
                }else{
                  if(setFormattedValue){
                    setFormattedValue(values.formattedValue);
                  }
                }
              }}
              form={form}
              customInput={InputLayout}
              onBlur={onBlur}
            />
            <ErrorMessage component={LayoutError} name={name} />
          </div>
        );
      }}
    />
  );
};

function InputLayout({ light, className, isRequired, placeholder, text, ...props }) {
  return (
    <>
      <input {...props} placeholder={placeholder || " "} pattern=".*\S.*" />
      <span className="highlight"></span>
      <span className="bar"></span>
      <label>
        <span>
          {isRequired && <span style={{ color: "red" }}>* </span>}
          {text}
        </span>
      </label>
    </>
  );
}

function InputText({ light, className, placeholder, text, ...props }) {
  return (
    <div className={`input_text ${className || ""} ${light ? "light" : ""}`}>
      <input {...props} placeholder={placeholder || " "} pattern=".*\S.*" />
      <span className="highlight"></span>
      <span className="bar"></span>
      <label>{text}</label>
    </div>
  );
}

function InputTextarea({ light, text, value, className, ...props }) {
  return (
    <div className={`df fdc input__textarea ${light ? "light" : ""}`}>
      <label>
        {text}
        <textarea
          className={`${props.className || ""}`}
          {...props}
          value={value}
        >
          {value}
        </textarea>
      </label>
    </div>
  );
}

const InputRadio = ({ children, checked, label, labelClass, name, value, ...props }) => (
  <label className={`input__radio ${labelClass || ""}`}>
    <input
      type="radio"
      name={name}
      value={value}
      onChange={props.onChange}
      className={`${props.inputClass || ""}`}
      defaultChecked={checked}
      {...props}
    />
    <span className="checkmark">
      <span></span>
    </span>
    {children}
  </label>
);


const InputAddress = ({
  text,
  id,
  name,
  addressee,
  address,
  complement,
  number,
  district,
  city,
  postalCode,
  state,
  className}) =>(
  <div className={`input_address ${className || ""}`}>
    {id ?<input type="hidden" value={id} /> : null }
    {address || number || complement || district || name || city || state ?
      <div className='input_address--title'>{text}</div>
    :
      <div className='input_address--title empty'>{text}</div>
    }
    <div>
      {address? `${address}, `: ''}
      {number? `${number}, `: ''}
      {complement? `${complement}, `: ''}
      {district? `${district}, `: ''}
      {name? `${name}, `: ''}
      {postalCode? `${postalCode.substring(0, 5) + '-' + postalCode.substring(5)}, `: ''}
      {city? `${city} - `: ''}
      {state? `${state}`: ''}
    </div>
  </div>
);

const FormSelect = ({text, name, isRequired, disabled, initialValue, ...props}) =>{
  const [field, meta, helpers] = useField(name);
  const externalValue = useMemo(()=> initialValue, [initialValue]);
  const [fake, setFake] = useState(true);
  const onFakeChange = () => setFake(false);

  const onChange = (value, { action, removedValue }) =>{
    let actions = {
      'select-option': ()=>{
        helpers.setValue(value.value);
      },
      'clear': ()=>{
        helpers.setValue(null);
      }
    };
    actions[action]();
  }

  useEffect(()=>{

  },[field,meta]);


  return(
    <div className={`input__ReactSelect ${props.form.errors[name] ? "error" : ""} `}>
      <label>
        <span>
          {isRequired && <span style={{ color: "red" }}>* </span>}
          {text}
        </span>
      </label>
      {externalValue && fake?
        <Select
          onChange={props.onChange || onFakeChange}
          isClearable
          isDisabled={disabled}
          defaultValue={externalValue}
          value={externalValue}
          options={props.options}
        />
      :
        <Select
            onChange={props.onChange || onChange}
            isClearable
            classNamePrefix="input__ReactSelect"
            isDisabled={disabled}
            placeholder="Selecione..."
            {...props}
        />
      }
      <ErrorMessage component={LayoutError} name={name} />
    </div>
  )
};

InputText.propTypes = {
  light: PropTypes.bool
};


export {
  InputText,
  InputTextarea,
  InputRadio,
  InputAddress,
  FormField,
  FormField2,
  NumberField,
  NumberField2,
  FormSelect,
  InputLayout
};
