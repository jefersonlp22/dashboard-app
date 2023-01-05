import { useState } from "react";

import client from "../../services/GraphQlRequest";

const useMutationIndication = callback => {
  const cli = client();

  const [resultIndication, setResultIndication] = useState({});
  const [error, setError] = useState([]);

  const disapproveIndication = async (id, disapproval) => {
    setError({});
    const mutation = `mutation{
        disapproveIndication(
        input:{id :"${id}" disapproval: "${disapproval}"}
      ){
        id
      }
    }`;
    try {
      let result = await cli.request(mutation);
      setResultIndication(result);
    } catch (e) {
      setError(e);
    }
  };

  const approveIndication = async id => {
    setError({});
    const mutation = `mutation{
        approveIndication(id: "${id}")
        {
        id
        }
    }`;
    try {
      let result = await cli.request(mutation);
      setResultIndication(result);
    } catch (e) {
      setError(e);
    }
  };

  return {
    resultIndication,
    error,
    disapproveIndication,
    approveIndication
  };
};

export { useMutationIndication };
