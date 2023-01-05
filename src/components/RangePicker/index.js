import React from 'react';

import DatePicker, { registerLocale} from 'react-datepicker';
import pt from "date-fns/locale/pt-BR"; // the locale you want

import { Icons } from '../index';

import "./styles.scss";

const RangePicker = ({startDate, setStartDate, endDate, setEndDate, ...props}) =>{
    registerLocale("pt-BR", pt); // register it with the name you want

    return (
    <div className="df fdr alic RangePicker">
        <div className="df fdr alic  RangePicker__startDate">
            <Icons.calendar fill="#979797" />
            <DatePicker  
                dateFormat="dd/MM/yyyy" 
                locale="pt-BR" 
                selected={startDate} 
                startDate={startDate}
                endDate={endDate}
                onChange={date => setStartDate(date)} 
            />
        </div>
        <div className="RangePicker__separator"/>
        <div className="df fdr alic RangePicker__endDate">
            <Icons.calendar fill="#979797" />
            <DatePicker 
                dateFormat="dd/MM/yyyy"  
                locale="pt-BR" 
                selected={endDate} 
                endDate={endDate}
                startDate={startDate}
                minDate={startDate}
                onChange={date => setEndDate(date)} />
        </div>
    </div>
    );
};


export {RangePicker};
