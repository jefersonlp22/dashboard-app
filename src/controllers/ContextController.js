import React from 'react';

function ContextController({ components = [], children }){
  return(
    <>
      {components.reduceRight((acc, Comp)=>{
        return <Comp>{acc}</Comp>;
      }, children)}
    </>
  );
}

export { ContextController };
