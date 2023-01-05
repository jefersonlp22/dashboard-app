import client from "../../services/GraphQlRequest";

const useSingleColection = callback => {
  const cli = client();

  const loadCollectionById = async id => {
    const query = `query{
      collection(id:${id}){
        id
        name
        description
        is_root
        position
        parent_id
        enabled
        condition
        facet_values{
          id
          name
          facet{
            name
          }
        }
        products{
          data{
            id
            name
          }

        }
        featured_asset{
          url
          raw_url
        }
      }
    }`;
    try {
      let result = await cli.request(query);
      return result;
    } catch (e) {
      console.log("Error ao buscar collections", e);
    }
  };

  return {
    loadCollectionById
  };
};

export { useSingleColection };
