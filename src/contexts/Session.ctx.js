import React, { useState, useEffect, createContext, useMemo } from 'react';
import _ from 'lodash';
import { useMe } from '../hooks-api/useMe';

import { usePersistedState } from '../customHooks/usePersistedState';

const SessionContext = createContext({});

function SessionProvider({ children }) {
  const [getSessionData, { loading, error, data }] = useMe();
  const [, , getItem] = usePersistedState('@Auth:token', '');
  const [, setIdTenant, getTenant ] = usePersistedState('@Auth:tenant', '');
  const [, setOldTenant, ] = usePersistedState('TENANT', '');
  const [tenant, setTenant] = useState(null);

  const Session = useMemo(() => {         
    if (data) {      
      let currentTenantId = getTenant("@Auth:tenant");
      let currentTenant = null;
      if(currentTenantId !== ""){
        currentTenant = _.find(data.me.tenants, {external_id: currentTenantId});
      }
      let updatedSession = {
        user: data?.me,
        tenant: tenant || {
          current: currentTenant,
          list: data?.me?.tenants
        }
      };
      return updatedSession;
    }
  // eslint-disable-next-line
  }, [tenant, data]);

  async function refreshSession() {    
    if (getItem("@Auth:token")) {            
      try {
        getSessionData();        
      } catch (err) {
        console.log('erro to get session data',err);
      }
    }
  }

  function changeTenant(external_id) {
    setTenant({
      current: _.find(Session?.tenant?.list, {'external_id' : external_id }),
      list: Session?.tenant?.list,
    });
    setIdTenant(external_id);
    setOldTenant(external_id);
  }

  function updateCurrentProperty({property, value, data}){    
    let updated = Session.tenant.current;
    if(data){
      updated.data[property] = value;
    }else {
      updated[property] = value;
    }
    setTenant({
      current: updated,
      ...tenant,
    });    
  }
 
  useEffect(() => {
    refreshSession();
    // eslint-disable-next-line
  }, []);

  // if (loading) { console.log('Tenant is Fetching'); }

  // if (error) { console.log('Tenant Could not Retrived'); }
  
  return (
    <SessionContext.Provider value={{
      Session,
      changeTenant,
      refreshSession,
      updateCurrentProperty      
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export { SessionContext, SessionProvider };
