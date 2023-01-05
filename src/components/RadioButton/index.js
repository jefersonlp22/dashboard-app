import React from 'react';

import "./styles.scss";

const RadioButton = ({type,label, name, checked, onChoose, value, classes, ...props}) =>{
    return (
        <label>
            <div className={`RadioButton ${classes || ''}`}>
                <input type={type} name={name} value={value} checked={checked}  onChange={onChoose} {...props}/>
                <span className="check"></span>
                {label}
            </div>
        </label>
    )
}

export { RadioButton }