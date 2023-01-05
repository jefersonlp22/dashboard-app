import { useState } from "react";

import client from "../../services/GraphQlRequest";

const useCreateFreight = callback => {
  const cli = client();

  const [newFreight, setNewFreight] = useState(null);
  const [loadFreight, setLoadFreight] = useState(false);

  const [newSettings, setNewSettings] = useState({});
  const [loadSettings, setLoadSettings] = useState(false);

  const [error, setError] = useState({});

  const createFreight = async createData => {
    setError({});
    setLoadFreight(true);
    const mutation = `mutation{
        saveShippingAndSettings(input:
        {
            shipping:
                {
                    name: "${createData?.name}"
                    description: "${createData?.description}"
                    active: ${createData?.active}
                }
             settings:
            {
                value: ${createData?.value}
                ${
                  createData?.type_value === "Valor fixo $"
                    ? `type_value: PRICE`
                    : `type_value: PERCENTAGE`
                }
                days_to_delivery: ${createData?.days_to_delivery}
                postal_code_range_id: ${createData?.postal_code_range_id}
            }
        })
        {
            id
            name
        }
    }`;
    try {
      let result = await cli.request(mutation);
      return result.saveShippingAndSettings;
    } catch (e) {
      setLoadFreight(false);

      setError(e);
    }
  };

  const createSettings = async createData => {
    const mutation = `mutation{
        saveSettings(input:
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
        })
        {
            id
        }
    }`;
    try {
      let result = await cli.request(mutation);
      setNewSettings(result);
    } catch (e) {
      setError(e);
    }
  };

  return {
    createSettings,
    newSettings,
    newFreight,
    error,
    createFreight,
    loadFreight,
    loadSettings
  };
};

export { useCreateFreight };
