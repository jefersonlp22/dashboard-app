import client from "../../services/GraphQlRequest";

const useFacet = callback => {
  const cli = client();

  const facet = async obj => {
    let mutationInstruction;

    try {
      mutationInstruction = JSON.stringify(obj[0]).replace(
        /"([^(")"]+)":/g,
        "$1:"
      );
    } catch (error) {
      mutationInstruction = JSON.stringify(obj).replace(
        /"([^(")"]+)":/g,
        "$1:"
      );
    }

    const mutation = `mutation{
        saveFacet(input:${mutationInstruction}){ id  name color values{
          id
          name
        } }
      }`;

    try {
      let result = await cli.request(mutation);
      return result || undefined;
    } catch (e) {
      console.log(`Error ao fazer salvar ou atualizar o facet`, e);
    }
  };

  const deleteFacet = async id => {
    const mutation = `mutation{
        deleteFacet(id:${id}){ id  name }
      }`;

    try {
      let result = await cli.request(mutation);
      return result || undefined;
    } catch (e) {
      console.error(`Error ao remover o facet`, e);
    }
  };

  return {
    facet,
    deleteFacet
  };
};

export { useFacet };
