import React, { useContext, useState, useEffect } from "react";
import {Icons, Loader } from "../../components";
import { ReactComponent as Logo } from "../../assets/svg/logo-people.svg";
import { useHistory } from "react-router-dom";

import { AuthLayout } from "../../Layouts/AuthLayout";

import mood4 from "./mood-4.svg";
import appleStore from "./appleStore.svg";
import playStore from "./playStore.svg";

import { SessionContext } from '../../contexts/Session.ctx';
import { usePersistedState } from '../../customHooks/usePersistedState';
import "./style.scss";
import TotalStorage from "total-storage";
import Swal from "sweetalert2";

const swalStyled = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success"
  },
  buttonsStyling: true
});

function ChooseTenant() {
  const history = useHistory();  
  const { Session, changeTenant, refreshSession } = useContext(SessionContext);
  const [ authTenant, setIdTenant ] = usePersistedState('@Auth:tenant', '');
  const [loading, setLoading] = useState(false);
  const [uniqueTenant, setUniqueTenant] = useState(false);  

  function checkAccess(sessionUser) {
    let isAdmin = sessionUser?.roles?.find(role => role.name === "admin");
    let confirmation = sessionUser?.apps?.find(app => app.name === "dashboard");

    let checkUserRole = sessionUser?.roles?.find(role => role.name === "ambassador");
    let isMaster = checkUserRole && sessionUser?.network?.level === 'master';    

    if (isAdmin || isMaster || confirmation || sessionUser?.is_super_admin ) {
      TotalStorage.set("USER", sessionUser);
      TotalStorage.set("USERNAME", sessionUser.name);
      TotalStorage.set("TENANT_LIST", Session.tenant.list);
      if(Session?.tenant?.current?.external_id){
        TotalStorage.set("TENANT", Session.tenant.current.external_id);
      }
      return true;
    }else {
      swalStyled
        .fire({
          html: `<div class="df fdc modalAuthInvalid">
                  <h1 class="title">Segura a ansiedade</h1>
                    <img src="${mood4}" class="mood"/>
                    <p class="text">Estamos trabalhando para liberar essa área para você.</p>
                    <p class="text">Acess nosso app com os mesmo dados e comece a vender</p>
                    <div class="df fdr jc-c storesLogos">
                      <img src="${appleStore}" />
                      <img src="${playStore}" />
                    </div>
                  </div>`,
          showConfirmButton: false,
          showCloseButton: true
        })
        .then(() => {
          TotalStorage.set("TENANT", "empty");
          setLoading(false);
        });
    }
    return false;
  }

  function handleTenant(id) {    
    changeTenant(id);
    setTimeout(()=>{
      if(checkAccess(Session.user)){      
        history.replace({ pathname: "/" });
      }else{
        console.log('Você não pôde logar por algum motivo!');
      }
    }, 300);   
  }

  const logout = () => {
    Swal.fire({
      text: "Tem certeza que deseja sair?",
      icon: "question",
      confirmButtonText: "Sair",
      confirmButtonColor: "#0489cc",
      cancelButtonText: "Voltar",
      cancelButtonColor: "#086899",
      showCancelButton: true,
      showCloseButton: true
    }).then(result => {
      if (result.value) {
        localStorage.clear();
        window.location.reload();
      }
    });
  };

  useEffect(()=>{
    if(uniqueTenant){
      setLoading(true);
      setIdTenant(Session.tenant.list[0].external_id);      
    }   
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  },[uniqueTenant]);

  useEffect(()=>{
    if(authTenant && authTenant !== ''){                  
      refreshSession();               
    }    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[authTenant]);

  useEffect(() => {
    setLoading(true);
    if (Session) {       
      if(!Session.tenant.current){
        if(Session.tenant.list.length === 1){            
          setUniqueTenant(true);
        }
      }else if(Session.tenant.list.length === 1){        
        if(checkAccess(Session.user)){                
          history.replace({ pathname: "/" });
        }else{
          console.log('Você não pôde logar por algum motivo!');
        }
      }
      setLoading(false); 
    } else {
      refreshSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Session]);

  return (
    <AuthLayout
      title={loading ? "" : "Escolher Empresa"}
      layoutClassName="choose__tenant"      
      contentClassName="choose__tenant--content"
      formClassName="choose__tenant--form"
    >
      <AuthLayout.card layoutClassName="layout choose__tenant--contentCard" contentClassName="content">
        <Logo className="layout choose__tenant--contentCardLogo" />
        {loading ? (
          <Loader active={loading} />
        ) : (
            <>
              <header className="top" style={{position: 'absolute', top: 20+'px', right: 40+'px'}}>
                <div className="top__username  alic df fdr jc-end">
                  <Icons.logout
                    className="top__iconlogout"
                    fill="#FFFFFF"
                    onClick={logout}
                  />
                </div>
              </header>
              <div className="wrapper__tenants">
                {Session?.tenant?.list?.map((tenant, index) => (
                  <div
                    key={`tenant${index}`}
                    className="df fdc tenant_card--wrapper"
                  >
                    <div
                      className="tenant_card"
                      key={`tenantKey${index}`}
                      onClick={() => handleTenant(tenant.external_id)}
                    >
                      <img
                        className="tenant_card--logo"
                        src={tenant.picture_url}
                        alt={tenant.name}
                      />
                    </div>
                    {tenant.name || null}
                  </div>
                ))}
              </div>
            </>
          )}
      </AuthLayout.card>
      <AuthLayout.actions />
    </AuthLayout>
  );
}

export default ChooseTenant;
