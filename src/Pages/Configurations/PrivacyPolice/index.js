import React, { useState } from 'react';
import {
  Row,
  Line,
  Button,
  Col,
  Loader,
  Icons
} from "../../../components";


import { TermsOfUse }  from './TermsOfUse'
import { Privacy }  from './Privacy'

import './styles.scss'

const PrivacyPolice = ({level}) => {
  const [ screen, SetScreen ] = useState('');

  return (
    <div className="privacyPolice">
      {screen === '' ?
        <>
          <div style={{height: 40, display: 'flex', alignItems: 'center'}}>
            <h1>Política de Privacidade</h1>
          </div>
          <Line />
          <Row>
            <div className="card-section df fdr alic jc-sb" onClick={()=>SetScreen('privacy-police')}>
              <div>{level ==="master" ? "Ver ": "Editar "}Política de Privacidade</div>
              <Icons.next />
            </div>
          </Row>
          <Line />
          <Row>
            <div className="card-section df fdr alic jc-sb" onClick={()=>SetScreen('use-terms')}>
              <div>Ver Termos de Uso da Plataforma</div>
              <Icons.next />
            </div>
          </Row>
        </>
      : null}

      {screen === 'privacy-police' ?  <Privacy setScreen={()=>SetScreen('')} level={level}/> : null}

      {screen === 'use-terms' ? <TermsOfUse setScreen={()=>SetScreen('')} level={level} /> : null}

    </div>
  );
}

export { PrivacyPolice };
