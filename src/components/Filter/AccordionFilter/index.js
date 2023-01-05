import React, {useState} from 'react';
import { IconsSidebar } from '../../IconsSidebar';

import "./styles.scss";

const AccordionFilter = ({filterName, children, ...props}) => {

    const [toggle, setToggle] = useState(false); 

    return(
        <div className="AccordionFilter">
            <div className="df fdr alic jc-sb AccordionFilter--header" onClick={()=>setToggle(!toggle)}>
                <div>{filterName}</div>
                {toggle? (
                    <IconsSidebar.arrow_up />
                ): (
                    <IconsSidebar.arrow_down />
                )}
            </div>
            <div className={`AccordionFilter--content`} style={{height: toggle ? React.Children.count(children) * 60 : 0}}>{children}</div>            
        </div>
    );
}

AccordionFilter.option = ({type,label, name, checked, onChoose, value, ...props}) =>{
    return (
        <label>
            <div className="AccordionFilter--option">
                <input type={type} name={name} value={value} checked={checked}  onChange={onChoose}/>
                <span className="check"></span>
                {label}
            </div>
        </label>
    )
}

export { AccordionFilter }