import { useState } from "react";

import client from "../../services/GraphQlRequest";

const useResendInvite = callback => {
  const cli = client();

  const [newResendInvite, setnewResendInvite] = useState({});

  const [erroResendInvite, setErroResendInvite] = useState({});
  const resendInvite = async id => {
    setErroResendInvite({});
    const mutation = `mutation{
      resendInvite(id: "${id}")
      {
        id
        email
        name
        level_formatted
        code
      }
    }`;
    try {
      let result = await cli.request(mutation);
      setnewResendInvite(result);
    } catch (e) {
      setErroResendInvite(e);
    }
  };

  return {
    newResendInvite,
    erroResendInvite,
    resendInvite
  };
};

export { useResendInvite };
