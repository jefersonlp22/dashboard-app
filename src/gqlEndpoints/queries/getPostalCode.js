import client from "../../services/GraphQlRequest";

const usePostalCode = callback => {
  const cli = client();

  const searchPostalCode = async postal_code => {
    const query = `query{
      searchPostalCode(postal_code:"${postal_code}"){
        postal_code
        state
        city
        address
        district
        city_code
      }
    }`;
    try {
      let result = await cli.request(query);
      return result.searchPostalCode;
    } catch (e) {
      console.log("Error ao buscar cep", e);
    }
  };

  return {
    searchPostalCode
  };
};

export { usePostalCode };
