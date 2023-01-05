import client from "../../services/GraphQlRequest";

const useHomeShopCollection = callback => {
  const cli = client();

  const homeShopCollection = async () => {
    const query = `query{
      homeShopCollection(first: 1000){
        data{
          id
          collection{
            id
            name
            featured_asset{
              url
            }
          }
        }
      }
    }`;
    try {
      let result = await cli.request(query);
      return result.homeShopCollection.data;
    } catch (e) {
      console.log("Error ao buscar", e);
    }
  };

  return {
    homeShopCollection
  };
};

export { useHomeShopCollection };
