import { useState } from "react";

import client from "../../services/GraphQlRequest";

const useResponsibles = callback => {
  const [responsibles, setResponsibles] = useState([]);
  const cli = client();

  const loadResponsibles = async ({first = 2000}) => {
    const query = `query{
      responsibles(first: ${first}) {
        data {
          user {
            id
              name
              email
              status
          }
          level
        }
      }    
    }`;
    try {
      let result = await cli.request(query);
      setResponsibles(result.responsibles ? result.responsibles.data : []);
    } catch (e) {
      console.log("Error ao buscar Responsáveis", e);
    }
  };

  return {
    loadResponsibles,
    responsibles
  };
};

export { useResponsibles };
