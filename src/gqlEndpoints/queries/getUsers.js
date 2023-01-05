import { useState } from "react";

import client from "../../services/GraphQlRequest";

const useUsers = callback => {
  const [users, setUsers] = useState([]);
  const cli = client();

  const loadUsers = async first => {
    const query = `query{
      users(first: ${first}){
        data{
          id
          name
        }
      }
    }`;
    try {      
      let result = await cli.request(query);      
      setUsers(result.users ? result.users.data : []);
    } catch (e) {
      console.log("Error ao buscar usuários", e);
    }
  };

  return {
    loadUsers,
    users
  };
};

export { useUsers };
