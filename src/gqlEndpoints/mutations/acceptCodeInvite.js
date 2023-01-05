import client from "../../services/GraphQlRequest";

const useAcceptCodeInvite = callback => {
  const cli = client();

  const acceptCodeInvite = async params => {
    const mutation = `mutation{
      acceptCodeInvite(
        input:{
          code:"${params.code}",
          name:"${params.name}",
          ${params.phone ? `phone: "${params.phone}",` : ""}
          password:"${params.password}",
          password_confirmation:"${params.password_confirmation}"
          ${params.picture_url ? `,picture_url: "${params.picture_url}"` : ""}
          ${params.facebook_id ? `,facebook_id: "${params.facebook_id}"` : ""}
        }){
        email
        level
        tenant{
          external_id
        }
      }
    }`;
    try {
      let result = await cli.request(mutation);
      return { acceptCodeInvite: result.acceptCodeInvite || undefined };
    } catch (e) {
      return {
        error: e.response.errors[0].message
      };
    }
  };

  return {
    acceptCodeInvite
  };
};

export { useAcceptCodeInvite };
