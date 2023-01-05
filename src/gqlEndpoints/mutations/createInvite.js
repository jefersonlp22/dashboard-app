import { useState } from "react";

import client from "../../services/GraphQlRequest";

const useCreateInvite = callback => {
  const cli = client();

  const [newInvite, setNewInvite] = useState({});

  const [error, setError] = useState({});

  const createInvite = async ({name, email, level, responsible_user_id}) => {
    setError({});
    const mutation = `mutation{
      createInvite(
        input:{
          name: "${name}",
          email:"${email}",
          level:"${level}"
          ${ responsible_user_id ?
            `responsible_user_id: ${responsible_user_id}` : ''
          }
        }
      ){
        id
        code
      }
    }`;
    try {
      let result = await cli.request(mutation);
      setNewInvite(result);
    } catch (e) {
      setError(e);
    }
  };

  return {
    newInvite,
    error,
    createInvite
  };
};

export { useCreateInvite };
