import client from "../../services/GraphQlRequest";

const useSaveHomeShopCollection = callback => {
  const cli = client();

  const saveShopCollection = async id => {
    const mutation = `mutation{
      saveHomeShopCollection(
        input:{
          collection_id: ${id}
        }
      ){
        id
      }
    }`;
    try {
      let result = await cli.request(mutation);
      return result;
    } catch (e) {
      console.log("Erro ao deletar shopp collection", e);
    }
  };

  const deleteShopCollection = async id => {
    const mutation = `mutation{
      deleteHomeShopCollection(id: ${id}){
        id
      }
    }`;
    try {
      let result = await cli.request(mutation);
      return result;
    } catch (e) {
      console.log("Erro ao deletar shopp collection", e);
    }
  };

  return {
    saveShopCollection,
    deleteShopCollection
  };
};

export { useSaveHomeShopCollection };
