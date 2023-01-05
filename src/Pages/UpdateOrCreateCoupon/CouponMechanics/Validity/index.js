import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import pt from "date-fns/locale/pt-BR";
import {
  BlankCard,
  Icons
} from '../../../../components';

import { Container, DateContainer, DateTitle, DateContent } from './styles';

const Validity = ({ setCouponMechanics, dateEnd, dateStart, setDateEnd, setDateStart, published }) => {
  registerLocale("pt-BR", pt);
  return (
    <Container>
      <DateContainer>
        <DateTitle>Vigência (Início)</DateTitle>
        <DateContent>
          <DatePicker
            disabled={published}
            maxDate={dateEnd}
            minDate={dateStart}
            dateFormat="dd/MM/yyyy"
            locale="pt-BR"
            selected={dateStart}
            onChange={(date) => {
              setCouponMechanics('start_at', date);
              setDateStart(date);
            }}
          />
          <Icons.calendar fill="#979797" />
        </DateContent>
      </DateContainer>
      <DateContainer>
        <DateTitle>Vigência (fim)</DateTitle>
        <DateContent>
          <DatePicker
            autoFocus={true}
            disabled={published}
            minDate={dateStart}
            dateFormat="dd/MM/yyyy"
            locale="pt-BR"
            selected={dateEnd}
            onChange={(date) => {
              setCouponMechanics('end_at', date);
              setDateEnd(date);
            }}
          />
          <Icons.calendar fill="#979797" />
        </DateContent>
      </DateContainer>
    </Container>
  );
};

export default Validity;

