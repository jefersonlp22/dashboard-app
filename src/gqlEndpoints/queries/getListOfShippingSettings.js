import { useState } from "react";
import client from "../../services/GraphQlRequest";

// import { Container } from './styles';

const UseListShipping = props => {
  const [loadListShipping, setLoadListShipping] = useState(false);
  const [listShipping, setListShipping] = useState([]);

  const [shipping, setShipping] = useState(null);
  const cli = client();

  const getAllShipments = async () => {
    const query = `query{
      allShipments(first:50 page: 1){
        data{
          id
          name
          description
          active
          created_at
          user{
            id
            name
            email
          }
          tenant{
            name
            external_id
          }
          settings{
            id
            value
            type_value
            days_to_delivery
            postal_code_ranges{
              id
              from_cep
              to_cep
              uf_id
              uf_nome
              uf_sigla
            }
          }
        }
      }
    }`;
    try {
      setLoadListShipping(true);
      let result = await cli.request(query);

      setListShipping(
        result.allShipments?.data ? result.allShipments?.data : []
      );
      setLoadListShipping(false);
    } catch (e) {
      console.log("Error ao buscar o Canal", e);
    }
  };

  const getShipping = async id => {
    const query = `query{
      shipping(id: ${id}){
        id
        name
        description
        active
        created_at
        user{
          id
          name
          email
        }
        tenant{
          name
          external_id
        }
        settings{
          id
          value
          type_value
          days_to_delivery
          postal_code_ranges{
            id
            from_cep
            to_cep
            uf_id
            uf_nome
            uf_sigla
          }
        }
      }
    }`;
    try {
      setLoadListShipping(true);
      let result = await cli.request(query);

      setShipping(result.shipping ? result.shipping : {});
      setLoadListShipping(false);
    } catch (e) {
      console.log("Error ao buscar o Canal", e);
    }
  };

  return {
    loadListShipping,
    getAllShipments,
    listShipping,
    getShipping,
    shipping
  };
};

export { UseListShipping };
