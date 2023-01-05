import client from "../../services/GraphQlRequest";

const useForgotPassword = callback => {
  const cli = client();

  const forgotPassword = async email => {
    const mutation = `mutation{
      forgotPassword(
        input:{
          email:"${email}"         
        }){
        status
        message
      }
    }`;
    try {
      let result = await cli.request(mutation);
      return { forgotPassword: result.forgotPassword || undefined };
    } catch (e) {
      return {
        error: e.response.errors[0].message
      };
    }
  };

  return {
    forgotPassword
  };
};

export { useForgotPassword };
