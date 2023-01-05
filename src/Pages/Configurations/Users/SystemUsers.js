import React from "react";

import {
  Table,
  Loader,
  VoidTemplate,
  Line
} from "../../../components";

import Tabs from "../../../Layouts/Tabs";
import { useIndexTenantAdmins } from "../../../hooks-api/useTenant";

const items = [
  {
    url: "/configs/usuarios",
    title: "Usuários"
  },
  {
    url: "/configs/convites-do-sistema",
    title: "Convites"
  }
];

const SystemUsers = ({ className }) => {
  const { data: sysUsers, loading } = useIndexTenantAdmins({});  

  return (
    <div>
      <Tabs items={items} />        
      <div style={{height: 40, display: 'flex', alignItems: 'center'}}>
      <h1>Usuários de sistema</h1>
      </div>  
      <Line />        
    
      <Loader active={loading} /> 
      <div style={loading ? { display: "none" } : null}>
        <Table
          voidtemplate={
            <VoidTemplate
              message={
                <VoidTemplate.default
                  message={
                    <>
                      Sem usuários
                      <br /> por enquanto...
                    </>
                  }
                />
              }
            />
          }
          headers={["Nome", "Email", "Permissão", "Status"]}
        >
          {sysUsers?.admins?.data.map((user, index) => {            
            return (
              <Table.tr key={`pl-${index}`} >
                <Table.td>{user.name}</Table.td>
                <Table.td>{user.email}</Table.td>
                <Table.td>Administrador</Table.td>
                <Table.td>Ativo</Table.td>                                
              </Table.tr>
            );
          })}
        </Table>
      </div>
    </div>
  );
};

export { SystemUsers };
