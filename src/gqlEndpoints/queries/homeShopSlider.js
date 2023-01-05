import { useState } from "react";
import client from "../../services/GraphQlRequest";

const useHomeShopSlider = callback => {
  const cli = client();
  const [storeShopSlider, setStoreShopSlider] = useState([]);

  const homeShopSlider = async () => {
    const query = `query{
      homeShopSlider(first: 3){
        data{
          id
          title
          channel
          device
          description
          link
          featured_asset{
            url
          }
        }
      }
      storeHomeShopSlider(first: 6) {
        data {
          id
          channel
          device
          title
          description
          link
          featured_asset {
            url
          }
        }
      }
    }`;
    try {
      let result = await cli.request(query);
      setStoreShopSlider(result)
      return result;
    } catch (e) {
      console.log("Error ao buscar", e);
    }
  };

  return {
    homeShopSlider,
    storeShopSlider
  };
};

export { useHomeShopSlider };
