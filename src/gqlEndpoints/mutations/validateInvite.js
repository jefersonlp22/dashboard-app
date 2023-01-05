import client from "../../services/GraphQlRequest";

const useValidateInvite = callback => {
  const cli = client();

  const validateInvite = async code => {
    const mutation = `mutation{
      validateInvite(input:{code:"${code}"}){
        id
        name
        email
        status
        status_formatted
        code
      }
    }`;
    try {
      let result = await cli.request(mutation);
      return { validateInvite: result.validateInvite || undefined };
    } catch (e) {
      return {
        error: e.response.errors[0].debugMessage
      };
    }
  };

  return {
    validateInvite
  };
};

export { useValidateInvite };
