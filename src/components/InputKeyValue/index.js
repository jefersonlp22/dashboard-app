import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../Icons';
import "./styles.scss";


const TexteAreaAutoSize = ({ value, onChange, ...props }) => {
  const reff = useRef(null);

  const handleChange = (e) => {
    reff.current.style.height = reff.current.scrollHeight + 'px';
    if (onChange) {
      onChange(e);
    }
  }
  return (
    <textarea
      {...props}
      ref={reff}
      onChange={(e) => {
        handleChange(e);
      }}
      value={value}
    >
      {value}
    </textarea>
  )
}


const InputKeyValue = ({ text, onChange, defaultValue, ...props }) => {

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
    setField([...fields, { "name": '', "value": '' }]);
  };


  useEffect(() => {
    if (onChange && fields.length) {
      onChange(JSON.stringify(fields));
    } else {
      onChange(defaultValue);
    }
    // eslint-disable-next-line
  }, [fields]);

  useEffect(() => {
    try {
      if (defaultValue && typeof defaultValue === 'string') {
        let parsed = JSON.parse(defaultValue);
        setField(parsed);
      }
    } catch (e) {
      console.error('e', e);
    }
    // eslint-disable-next-line
  }, [defaultValue]);

  return (
    <div className="inputKeyValue">
      <label>{text}</label>
      {fields.map((field, index) =>
        <div key={`inKv${index}`} className="inputKeyValue__row">
          <input
            type="text"
            placeholder="Campo"
            onChange={e => handleChange('name', index, e.target.value)}
            value={field?.name || ''}
          />
          <TexteAreaAutoSize
            placeholder="Descrição"
            onChange={e => handleChange('value', index, e.target.value)}
            defaultValue={field?.value || ''}
          />
          <div className="inputKeyValue__remove"
            onClick={() => handleRemove(index)}><Icons.circleTrash /></div>
        </div>
      )}
      <div className="inputKeyValue__add" onClick={() => addField()}><Icons.circleAdd />Adicionar campo</div>
    </div>
  )
}

export { InputKeyValue };
