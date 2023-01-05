import client from "../../services/GraphQlRequest";

const useLoginFacebook = callback => {
  const cli = client();

  const loginFacebook = async token => {
    const mutation = `mutation{
      loginFacebook(input:{facebook_access_token:"${token}"}){
        access_token
      }
    }`;
    try {
      let result = await cli.request(mutation);
      return result || undefined;
    } catch (e) {
      console.error(`Error ao fazer login`, e);
    }
  };

  return {
    loginFacebook
  };
};

export { useLoginFacebook };
