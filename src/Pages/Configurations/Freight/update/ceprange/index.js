import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../../../../../components/Icons';
import "./styles.scss";

const CepRange = ({ text, onChange, defaultValue, ...props }) => {

  const [fields, setField] = useState([]);

  const handleChange = (key, index, value) => {
    let update = fields;
    update[index][key] = value;
    setField([...update]);
  };

  const handleRemove = (index) => {
    let remove = fields;
    remove.splice(index, 1);
    setField([...remove]);
  };

  const addField = () => {
    setField([...fields, { "from_cep": '', "to_cep": '' }]);
  };


  useEffect(() => {
    if (onChange && fields.length) {
      onChange(fields);
    } else {
      onChange(defaultValue);
    }
    // eslint-disable-next-line
  }, [fields]);

  useEffect(() => {
    try {
      if (defaultValue) {
        setField(defaultValue);
      }
    } catch (e) {
      console.error('e', e);
    }
    // eslint-disable-next-line
  }, [defaultValue]);

  return (
    <div className="cepRange">
      <label>{text}</label>
      {fields.map((field, index) =>
        <div key={`inKv${index}`} className="cepRange__row">
          <input
            type="text"
            placeholder="CEP inicial"
            onChange={e => handleChange('from_cep', index, e.target.value)}
            value={field?.from_cep || ''}
            type="number"
          />
          <input
            type="text"
            placeholder="CEP final"
            onChange={e => handleChange('to_cep', index, e.target.value)}
            value={field?.to_cep || ''}
            type="number"
          />
          <div className="cepRange__remove"
            onClick={() => handleRemove(index)}><Icons.circleTrash /></div>
        </div>
      )}
      <div className="cepRange__add" onClick={() => addField()}><Icons.circleAdd />Incluir nova faixa de cep</div>
    </div>
  )
}

export { CepRange };
