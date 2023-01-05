import { useState } from "react";

import client from "../../services/GraphQlRequest";

const useAdmins = callback => {
  const [admins, setAdmins] = useState([]);
  const cli = client();

  const loadAdmins = async first => {
    const query = `query{
      admins(first: 10) {
        data {
          name
          email
        }
    }
    }`;
    try {
      let result = await cli.request(query);
      setAdmins(result.admins ? result.admins.data : []);
    } catch (e) {
      console.log("Error ao buscar Responsáveis", e);
    }
  };

  return {
    loadAdmins,
    admins
  };
};

export { useAdmins };
