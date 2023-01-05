import client from "../../services/GraphQlRequest";

const useFacets = callback => {
  const cli = client();

  const loadFacets = async first => {
    const query = `query{
      facets(first:${first}){
        data{ 
          id
          name
          color
          visible
          values{
            id
            name
          }       
        }
      }
    }`;
    try {
      let result = await cli.request(query);
      return result;
    } catch (e) {
      console.log("Error ao buscar facetas", e);
    }
  };

  return {
    loadFacets
  };
};

export { useFacets };
