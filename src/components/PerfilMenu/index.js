import React from 'react';

import {Grid, Row} from '../index';

import "./styles.scss";


const PerfilMenu = ({closeDrawer, ...props}) => {
   return (
       <Grid>
           <Row>
                Este é o Perfil, Feche nesse: 
                <span onClick={()=> closeDrawer(false)}> -X- </span>
           </Row>
       </Grid>
   )
}

export { PerfilMenu };