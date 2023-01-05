import React from 'react';

import {Icons, Button } from '../../index';

import "./styles.scss";


const FilterMenu = ({closeDrawer, handleAction, clearFilter, children, ...props}) => {
   return (
       <div className="FilterMenu df fdc">
           <div className="FilterMenu--header df fdr alic jc-sb">
                <div className="df fdr alic ">
                    <Icons.close className="FilterClose"  fill="#FFF" onClick={()=> closeDrawer(false)}/>
                    <span>Filtrar</span>
                </div>
                <Icons.trash className="FilterTrash" cursor="pointer" fill="#FFF" onClick={clearFilter}/>
           </div>

           <div className="FilterMenu--content">
               {children}
           </div>


           <div className="FilterMenu--footer">
                <Button primary type="button" onClick={handleAction} className="btFullWidth">Aplicar Filtros</Button>
           </div>
       </div>
   )
}

export { FilterMenu };