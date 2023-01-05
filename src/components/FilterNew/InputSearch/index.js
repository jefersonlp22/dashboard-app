import React, { useState, useEffect } from "react";

import { Icons } from '../../Icons';

import "./style.scss";

function InputSearch({
  value,
  onValueChange,
  triggerAction,
  placeholder,
  forceState,
  ...props
}) {

  const [toggle, setToggle] = useState(false);

  useEffect(()=>{
    if(forceState){      
      if(value === ''){
        setToggle(false);
      }
    }
  //eslint-disable-next-line
  },[value]);
  
  return (
    <div className={`df fdr alic search__input ${true ? 'searchInputOpen': ''}`} >        
      <input 
        type="text" 
        placeholder={placeholder} 
        value={value} 
        onChange={(e)=>{
          onValueChange(e.currentTarget.value);
        }}

        onKeyPress={
          (e)=>{            
            if(e.key === "Enter" && triggerAction){
              triggerAction();
            }
          }
        }
      />

      <div className="df fdr alic">
      
        {true && value !== '' ? (
          <Icons.inputError className="iconClear" cursor="pointer" fill={toggle ? '#b2b2b3' : '#B2B2B3'} onClick={()=>{            
            onValueChange('');            
          }} />
        ) : null }

          <Icons.search className="iconSearch" cursor="pointer" fill={toggle ? '#5a5a5a' : '#B2B2B3'} onClick={()=>{
            triggerAction();            
          }} 
        />
      
      </div>

    </div>
  );
}

export default InputSearch;