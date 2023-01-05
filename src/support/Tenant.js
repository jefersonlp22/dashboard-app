import _ from 'lodash';

const useTenant = () =>{

  let tenantsStorageKey = 'TENANT_LIST';
  let currentTenantStorageKey = 'TENANT';
  let tenants = JSON.parse(localStorage.getItem(tenantsStorageKey));

  const getCurrentTenant = () =>{
    return _.find(tenants, {'external_id': localStorage.getItem(currentTenantStorageKey)});    
  }

  const getCurrentIndexTenant = () =>{
    return _.findIndex(tenants, {'external_id': localStorage.getItem(currentTenantStorageKey)});
  }

  const updateCurrentProperty = ({property, value}, subProperty) =>{
    let currentUpdated = getCurrentTenant();    
    if(subProperty){
      currentUpdated[subProperty][property] = value;  
    }else{
      currentUpdated[property] = value;
    }
    tenants[getCurrentIndexTenant()] = currentUpdated;
    localStorage.setItem(tenantsStorageKey, JSON.stringify(tenants));
  }

  const updateCurrentDepthProperty = (main, parent, property, value) =>{
    let currentUpdated = getCurrentTenant();    
    currentUpdated[main][parent][property] = value;      
    tenants[getCurrentIndexTenant()] = currentUpdated;
    localStorage.setItem(tenantsStorageKey, JSON.stringify(tenants));
  }

  return{
    getCurrentTenant,
    getCurrentIndexTenant,
    updateCurrentProperty,
    updateCurrentDepthProperty
  }
}

export default useTenant;
