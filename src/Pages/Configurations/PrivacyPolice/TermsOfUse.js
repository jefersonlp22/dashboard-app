import React from 'react'
import {
  Line,
  Loader,
  Icons
} from "../../../components";
import { usePlatformConfigs } from '../../../hooks-api/usePlatFormConfigs'

const TermsOfUse = ({setScreen}) =>{
  const {data, loading} = usePlatformConfigs();
  const createMarkup = (text) => {
    return {__html: text};
  };
  return(
    <div>      
      <div style={{height: 40, display: 'flex', alignItems: 'center'}}>
        <h1>Termos de uso da plataforma</h1>
      </div>         
      <Line />
      
        <div className="termOfUse__wrapper">
          <div className="iconBack">
            <Icons.back onClick={()=>setScreen()} />
          </div>
          {loading ? <Loader active={true} />: <></>}      
          {data?.getPlatformTermsOfUse ?    
            <>
              <div  dangerouslySetInnerHTML={createMarkup(data?.getPlatformTermsOfUse?.terms_of_use)} />
              <div  dangerouslySetInnerHTML={createMarkup(data?.getPlatformTermsOfUse?.privacy_police)} />
            </>
          : <></>}
        </div>

    </div>
  )
}

export { TermsOfUse };