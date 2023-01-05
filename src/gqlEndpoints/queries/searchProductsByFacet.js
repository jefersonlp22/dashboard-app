import client from "../../services/GraphQlRequest";

const useProductsByFacet = callback => {
  const cli = client();

  const loadProductsByFacet = async (facets, condition) => {
    const query = `query{
      searchProductsByFacets(input:{facet_values: ${facets},condition:"${condition}"}){
        code
        name
      }
    }`;
    try {
      let result = await cli.request(query);
      return result.searchProductsByFacets;
    } catch (e) {
      console.log("Error ao buscar os produtos da faceta", e);
    }
  };

  return {
    loadProductsByFacet
  };
};

export { useProductsByFacet };
