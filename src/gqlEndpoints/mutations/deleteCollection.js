import client from "../../services/GraphQlRequest";

const useDeleteCollection = callback => {
  const cli = client();

  const deleteCollection = async id => {
    const mutation = `mutation{
      deleteCollection(id:${id}){
        name
      }
    }`;

    try {
      let result = await cli.request(mutation);
      return result;
    } catch (e) {
      // throw new Error(`Error ao configurar One signal do usuário`, e);
      console.error(e);
    }
  };

  return {
    deleteCollection
  };
};

export { useDeleteCollection };
