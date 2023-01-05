import React, { useState, useEffect } from 'react';
import { Manager, Reference, Popper } from "react-popper";
import DatePicker, { registerLocale} from 'react-datepicker';
import pt from "date-fns/locale/pt-BR"; 
import moment from 'moment';
import { Icons } from '../../../index';
import "./styles.scss";

const CalendarPoper = ({ setStatus, status, children, dateConfig, closeCalendar }) => {
  registerLocale("pt-BR", pt);
  const [isOpen, toggleOpen] = useState(false);  

  useEffect(()=>{
    if(!closeCalendar || status !== dateConfig.name){
      toggleOpen(false);
    }    
    // eslint-disable-next-line    
  },[closeCalendar, status]);

  const handleToogle = () =>{    

    if(dateConfig.name === 'from'){
      toggleOpen(true);
      setStatus('from');    
    }
    
    if(dateConfig.name === 'to'){
      toggleOpen(true);
      setStatus('to');
    }

    if(dateConfig.name === status && isOpen){
      toggleOpen(false);
      setStatus('');
    }
  }
    
  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <div ref={ref}  onClick={() =>handleToogle()}>
            {children}
          </div>
        )}
      </Reference>
      {isOpen && closeCalendar? (
        <Popper placement="right">
          {({ ref, style, placement }) => (
            <div
              ref={ref}
              style={style}
              data-placement={placement}
              className={`RangePicker--popover top`}
            >
               <DatePicker
                  dateFormat="dd/MM/yyyy" 
                  locale="pt-BR" 
                  inline
                  {...dateConfig}
                />

              <div className="RangePicker--arrow"></div>
            </div>
          )}
        </Popper>
      ): null}
    </Manager>
  );
};
  

const RangePicker = ({from, setFrom, to, setTo, closeCalendar }) =>{  

  const [status, setStatus] = useState('');

    
  return (
    <div className="df fdc RangePicker">
      { from ? 
        <CalendarPoper   
          dateConfig={{
            selected: from,
            startDate: from,
            endDate: to,
            onChange: date => setFrom(date),
            name: 'from'            
          }}  
          setStatus={setStatus} 
          status={status}       
          closeCalendar={closeCalendar}
        >
            <div className="df fdr alic RangePicker--option">
                <Icons.calendar fill="#979797" /> 
                <div> De: {moment(from).format('DD/MM/YYYY')} </div>
            </div>
        </CalendarPoper>
      :null}

      { to ? 
        <CalendarPoper 
           dateConfig={{
            selected: to,
            startDate: from,
            endDate: to,
            onChange: date => setTo(date),
            name: 'to'            
          }} 
          setStatus={setStatus} 
          status={status} 
          closeCalendar={closeCalendar}
        >
            <div className="df fdr alic  RangePicker--option">
                <Icons.calendar fill="#979797" /> 
                <div> Até: {moment(to).format('DD/MM/YYYY')}</div>
            </div>
        </CalendarPoper>
      :null}
    </div>
  );
};


export {RangePicker};
