import { useState } from "react";

import client from "../../services/GraphQlRequest";

const useProduct = product => {
  const [product, setProduct] = useState({});
  const cli = client();

  const loadUsers = async first => {
    const mutation = `mutation{
        insertProduct(input:${JSON.stringify(product)}){id}
    }`;
    try {
      let result = await cli.request(mutation);
      setUsers(result.users ? result.users.data : []);
    } catch (e) {
      throw new Error("Error ao buscar usuários", e);
    }
  };

  return {
    loadUsers,
    users
  };
};

export { useUsers };
