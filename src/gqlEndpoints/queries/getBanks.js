import client from "../../services/GraphQlRequest";

const useBanks = callback => {
  const cli = client();

  const loadBanks = async () => {
    const query = `query{
      banks{
        number
        name
      }
    }`;
    try {
      let result = await cli.request(query);
      return result.banks;
    } catch (e) {
      console.log("Error ao bancos", e);
    }
  };

  return {
    loadBanks
  };
};

export { useBanks };
