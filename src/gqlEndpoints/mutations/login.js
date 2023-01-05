import client from "../../services/GraphQlRequest";

const useLogin = callback => {
  const cli = client();

  const login = async (email, password) => {
    const mutation = `mutation{
      login(input:{username:"${email}", password:"${password}"}){
        access_token
      }
    }`;
    try {
      let result = await cli.request(mutation);
      return { access_token: result.login.access_token || undefined };
    } catch (e) {
      return {
        error: e.response.errors[0].message
      };
    }
  };

  return {
    login
  };
};

export { useLogin };
