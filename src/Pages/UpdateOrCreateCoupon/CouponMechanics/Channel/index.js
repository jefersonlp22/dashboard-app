import React from 'react';
import {
  RadioButton
} from '../../../../components';

import { Container, ContainerTitle, ContainerOption } from './styles';

const Channel = ({channel, setChannel, published, recipient}) => {
  return (
    <Container>
      <ContainerTitle>Canal</ContainerTitle>
      { recipient === "CUSTOMER"?
        <>
        <ContainerOption>
        <RadioButton
           disabled={published}
           type="radio"
           checked={channel === 'ANY'}
           value={'ANY'}
           onChoose={(e)=>setChannel(e.currentTarget.value)}
           classes="comissionTable--checkbox"
         />
         <span className="cardStep__content">APP + Lojinha</span>
       </ContainerOption>

       <ContainerOption>
         <RadioButton
           type="radio"
           //disabled={true}
           checked={channel === 'STORE'}
           value={'STORE'}
           onChoose={(e)=>setChannel(e.currentTarget.value)}
           classes="comissionTable--checkbox"
         />
         <span className="cardStep__content">Lojinha</span>
       </ContainerOption>
       </>
       :
        <span className="cardStep__content">Cupom para uso exclusivo do embaixador através do aplicativo<br/>(na modalidade "Compre para você").</span>
      }

    </Container>
  );
};

export default Channel;

