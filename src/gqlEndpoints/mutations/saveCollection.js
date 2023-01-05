import client from "../../services/GraphQlRequest";

const useSaveCollection = callback => {
  const cli = client();

  const saveCollection = async params => {
    const mutation = `mutation{
      saveCollection(input:{
        ${params.id ? `id: ${params.id},` : ""}
        name: "${params.name}",
        description: "${params.description}",
        facet_values: ${params.facets},
        enabled: ${params.enabled},
        condition: "${params.condition}",
        image: "${params.image}",
        parent_id: ${params.parent_id}
      }){
        name
      }
    }`;

    try {
      let result = await cli.request(mutation);
      return result;
    } catch (e) {
      console.error(e);
    }
  };

  return {
    saveCollection
  };
};

export { useSaveCollection };
