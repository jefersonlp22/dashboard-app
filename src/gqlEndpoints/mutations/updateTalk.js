import client from "../../services/GraphQlRequest";

const useUpdateTalk = callback => {
  const cli = client();

  const updateByQuery = async queryString => {
    const mutation = `mutation{${queryString}}`;

    try {
      let result = await cli.request(mutation);
      return result || undefined;
    } catch (e) {
      console.error(`Error ao Salvar updateTalk`, e);
    }
  };

  const deleteTalk = async id => {
    const mutation = `mutation{
      deleteTalk(id:${id}){
        id
      }
    }`;

    try {
      let result = await cli.request(mutation);
      return result || undefined;
    } catch (e) {
      console.error(`Error ao Deletar talk`, e);
    }
  };


  return {
    updateByQuery,
    deleteTalk
  };
};

export { useUpdateTalk };
