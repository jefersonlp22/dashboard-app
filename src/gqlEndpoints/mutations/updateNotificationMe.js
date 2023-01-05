import client from "../../services/GraphQlRequest";

const useNotification = callback => {
  const cli = client();

  const updateNotificationMe = async playerId => {
    const mutation = `mutation{
      updateNotificationMe(input:{
          notification_token:"${playerId}",
          notification_type:"WEB"
      }){
        id
        name
      }
    }`;
    try {
      let result = await cli.request(mutation);
    } catch (e) {
      console.error(e);
    }
  };

  return {
    updateNotificationMe
  };
};

export { useNotification };
