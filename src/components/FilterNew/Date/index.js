import React, { useState, useEffect } from 'react';
import { Icons } from '../../Icons';
import { RangePicker } from './RangePicker';
import { SingleDate } from './SingleDate';

import "./styles.scss";

const DateOption = ({ label, values, editable, clear, closeCalendar, onChange, date_type, ...props }) => {

  const [value, setValue] = useState(values || null);

  useEffect(() => {
    if (clear) {
      setValue(null);
    }
  }, [clear]);

  return (
    <div className="AccordionFilter">
      <div className="df fdr alic jc-sb AccordionFilter--header" onClick={() => { }}>
        <div>{label}</div>
        {editable ?
          <>
            {value ?
              <Icons.delete fill="#b2b2b3" onClick={() => { setValue(null); onChange(null); }} /> :
              <Icons.plus fill="#4d4d4d" onClick={() => { setValue({ from: new Date(), to: new Date() }); onChange({ from: new Date(), to: new Date() }); }} />
            }
          </>
          : null}
      </div>
      <div className={`AccordionFilter--content`} >
        {value ?
          <>
            {date_type === "SINGLE_DATE" ?
              <SingleDate
                closeCalendar={closeCalendar}
                from={new Date(value.from)}
                setFrom={date => {
                  setValue({ ...value, from: date })                  
                  if (onChange) {
                    onChange({ ...value, from: date });
                  }
                }}              
              />

              :
              <RangePicker
                closeCalendar={closeCalendar}
                from={new Date(value.from)}
                setFrom={date => {
                  setValue({ ...value, from: date })
                  if (onChange) {
                    onChange({ ...value, from: date });
                  }
                }}
                to={new Date(value.to)}
                setTo={date => {
                  setValue({ ...value, to: date })
                  if (onChange) {
                    onChange({ ...value, to: date });
                  }
                }}
              />
            }</>
          : null}
      </div>

    </div>
  );
}

export { DateOption }