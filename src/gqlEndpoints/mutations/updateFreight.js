import client from "../../services/GraphQlRequest";

const useUpdateFreight = callback => {
  const cli = client();

  const deleteFreight = async id => {
    const mutation = `mutation{
        deleteShipping(id:${id}){
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

  const deleteSettings = async id => {
    const mutation = `mutation{
        deleteSettings(id:${id}){
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

  const updateSettings = async (id, createData) => {
    const mutation = `mutation{
        updateShippingSetting(id: ${id} input:
            {
                value: ${createData?.value}
                ${
                  createData?.type_value === "Valor fixo $"
                    ? `type_value: PRICE`
                    : `type_value: PERCENTAGE`
                }
                days_to_delivery: ${createData?.days_to_delivery}
                postal_code_range_id: ${createData?.postal_code_range_id}
                shipping_id: ${createData?.shipping_id}
            }
        )
        {
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

  const updateShipping = async (id, createData) => {
    const mutation = `mutation{
        updateShipping(id: ${id} input:
            {
                name: "${createData?.name}"
                description: "${createData?.description}"
                active: ${createData?.active}
            }
        )
        {
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
    updateSettings,
    deleteFreight,
    deleteSettings,
    updateShipping
  };
};

export { useUpdateFreight };
