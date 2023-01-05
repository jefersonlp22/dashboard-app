import { gql, useQuery, useLazyQuery, useMutation } from "@apollo/client";
import PAGINATOR from "./queryStrings/paginator";

const FREIGHT_DATA = `
  id
  external_id
  name
  description
  created_at
  active
  user{
    name
  }
  settings{
    id
    external_id
    name
    value
    type_value
    days_to_delivery
    minimum_items
    maximum_items
    zip_code_inclusion
    zip_range_id
    uf_id
    shipping_setting_zip_range{
      id
      from_cep
      to_cep
    }
    has_min_amount_free
    min_amount_free
  }
`;

const useIndexFreight = ({ first = 10, page = 1 }) => {
  let QUERY = gql`
    query AllShipments(
      $first: Int!,
      $page: Int
    ){
      allShipments(
        first: $first,
        page: $page,
      ){
        ${PAGINATOR}
        data{
          ${FREIGHT_DATA}
        }
      }
    }
  `;
  return useLazyQuery(QUERY, {
    variables: {
      first,
      page,
    },
    skip: false,
    fetchPolicy: "no-cache",
  });
};

const useShowFreight = ({ external_id = "" }) => {
  const QUERY = gql`
    query ShippingById($external_id: String!){
      shipping(external_id: $external_id){
        ${FREIGHT_DATA}
      }
    }
  `;
  return useQuery(QUERY, {
    variables: { external_id },
    skip: false,
    fetchPolicy: "no-cache",
  });
};

const useUpdateFreight = () => {
  const QUERY = gql`
    mutation UpdateShippingMethod(
      $shipping: Shipping
      $locations: [LocationsInput]
    ) {
      updateShippingMethod(
        input: { shipping: $shipping, locations: $locations }
      ) {
        ${FREIGHT_DATA}
      }
    }
  `;
  return useMutation(QUERY, {
    skip: false,
    fetchPolicy: "no-cache",
  });
};

const useDeleteFreightLocale = () => {
  const QUERY = gql`
    mutation DeleteSettings(
      $external_id: String!
    ) {
      deleteSettings(
        external_id: $external_id
      ) {
        external_id
      }
    }
  `;
  return useMutation(QUERY, {
    skip: false,
    fetchPolicy: "no-cache",
  });
};

const useDeleteFreight = () => {
  const QUERY = gql`
    mutation DeleteShipping(
      $external_id: String!
    ) {
      deleteShipping(
        external_id: $external_id
      ) {
        external_id
      }
    }
  `;
  return useMutation(QUERY, {
    skip: false,
    fetchPolicy: "no-cache",
  });
};

export { useIndexFreight, useShowFreight, useUpdateFreight, useDeleteFreight, useDeleteFreightLocale };
