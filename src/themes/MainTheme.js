import React, { useEffect, useContext, useState } from "react";
import useTheme from "../customHooks/useTheme";

import "./MainTheme.scss";
import { Icons,  RightDrawer, PerfilMenu } from "../components";
import { CookiesAlert } from "../components/CookiesAlert";
import Sidebar from "../components/Sidebar";
import Select from 'react-select'
import selectArrow from "../assets/svg/i_arrow-select.svg";
import { SessionContext } from '../contexts/Session.ctx';

import Swal from "sweetalert2";

function MainTheme({ children }) {
  const { Session, changeTenant } = useContext(SessionContext);
  const { setTheme } = useTheme();
  const [optionsTenants, setOptionsTenants] = useState([]);
  const [currentOption, setCurrentOption] = useState(null);
  const [rightDrawer, toggleRightDrawer] = useState(false);


  useEffect(() => {
    setTheme();
    if(Session?.tenant?.list && Session?.tenant?.current){
      setCurrentOption({value: Session?.tenant?.current?.external_id, label: Session?.tenant?.current?.name});
      setOptionsTenants(Session?.tenant?.list?.map(item=>{
        return {label: item.name, value: item.external_id};
      }));
      setCurrentOption({value: Session?.tenant?.current?.external_id, label: Session?.tenant?.current?.name});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Session]);

  const handleTenant = value => {
    changeTenant(value.value);
  };

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

  return (
    <div className="mainWrapper">
      <Sidebar />
      <header className="top">
        <div className="top__title">Dashboard People Commerce</div>
        <div className="top__select">
          {currentOption && optionsTenants?.length ?
            <Select
              onChange={value=> handleTenant(value)}
              isSearchable={false}
              classNamePrefix="top__select--Select"
              styles={{ backgroundImage: `url(${selectArrow})` }}
              options={optionsTenants}
              value={{value: Session?.tenant?.current?.external_id, label: Session?.tenant?.current?.name}}
              defaultValue={{value: Session?.tenant?.current?.external_id, label: Session?.tenant?.current?.name}}
            />
          : null}
        </div>
        <div className="top__username  alic df fdr jc-end">
          <div onClick={()=> toggleRightDrawer(false)} >Olá, {Session?.user?.name || '...'}{" "}</div>
          <Icons.logout
            className="top__iconlogout"
            fill="currentColor"
            onClick={logout}
          />
        </div>
      </header>

      <section className="content">{children}</section>
      <CookiesAlert />
      <RightDrawer toggleActive={rightDrawer}>
        <PerfilMenu closeDrawer={toggleRightDrawer} />
      </RightDrawer>
    </div>
  );
}

export { MainTheme };
