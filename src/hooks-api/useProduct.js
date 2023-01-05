import { gql, useQuery, useMutation, useLazyQuery } from '@apollo/client';
import PAGINATOR from './queryStrings/paginator';

const PRODUCT_DATA = `
    id
    name
    code
    enabled
    description
    quantity_items
    type
    datasheet
    published
    updated_at
    variants{
      id
      sku
      stock
      price
      list_price
      enabled
      quantity_items
      values {
        id
        name
      }
    }
    options{
      id
      name
      values {
        id
        name
      }
    }
    featured_asset{
      id
      url
      raw_url
    }
    facet_values{
      id
      name
      facet{
        id
        name
        color
        visible
        values{
          id
          name
        }
      }
    }
    assets{
      id
      url
      raw_url
    }
    share_asset{
      id
      url
      raw_url
    }
`;

const useIndexProduct = ({ first = 10, page = 1, filter = '' }) => {

  const QUERY_INDEX = gql`
    query Products($first: Int!, $page: Int, $filter: ProductsFilterWhereConditions){
      products(
        first: $first,
        page: $page,
        filter: $filter
      ){
        ${PAGINATOR}
        data{
          ${PRODUCT_DATA}
        }
      }
    }
  `;
  return useQuery(QUERY_INDEX, {
    variables: {
      first,
      page,
      filter
    },
    skip: false,
    fetchPolicy: 'no-cache'
  });
}

const useShowProduct = ({ id = '' }) => {
  const QUERY = gql`
    query Product($id: ID){
      product(id: $id){
        ${PRODUCT_DATA}
      }

    }
  `;
  return useQuery(QUERY, { variables: { id }, skip: false, fetchPolicy: 'no-cache' });
}

const useUpdateProduct = () => {
  const MUTATION = gql`
    mutation saveProduct(
        $id: ID,
        $name: String!,
        $code: String!,
        $description: String!,
        $type: String,
        $quantity_items: Int,
        $datasheet: String,
        $featured_image: String,
        $share_image: String,
        $images: [ProductImage],
        $enabled: Int!,
        $face_values: [ProductFaceValues]!,
        $options: [ProductOptionInput],
        $variants: [ProductVariantInput]
    ){
      saveCollection(input:{
        id: $id,
        name: $name,
        code: $code,
        descrition: $description,
        type: $type,
        quantity_items: $quantity_items,
        datasheet: $datasheet,
        featured_image: $featured_image,
        share_image: $share_image,
        images: $images,
        enabled!: $enabled!,
        face_values: $face_values,
        options: $options,
        variant: $variants
      }){
        id
        name
        quantity_items
        type
      }
    }
  `;
  return useMutation(MUTATION);
}


const useDuplicateProduct = () => {
  const MUTATION = gql`
    mutation duplicateProduct(
        $id: ID!,
        $name: String,
    ){
      replicateProduct(
        id: $id,
        name: $name,
      ){
        id
        name
      }
    }
  `;
  return useMutation(MUTATION);
}



const useDeleteProduct = () => {
  const MUTATION = gql`
    mutation DeleteProduct( $id: ID! ){
      deleteProduct( id: $id ){
        name
      }
    }
  `;
  return useMutation(MUTATION);
}

const useLazySearchProduct = ({ first = 10, page = 1, filter = '' }) => {

  const QUERY_INDEX = gql`
    query Products($first: Int!, $page: Int, $filter: ProductsFilterWhereConditions){
      products(
        first: $first,
        page: $page,
        filter: $filter
      ){
        ${PAGINATOR}
        data{
          ${PRODUCT_DATA}
        }
      }
    }
  `;

  const [getResults, {loading, error, data}] = useLazyQuery(QUERY_INDEX, {
    variables: {
      first,
      page,
      filter
    },
    skip: false,
    fetchPolicy: 'no-cache'
  });

  async function handleQuery({ first = 10, page = 1, searchText = "" }) {
    await getResults({
      variables: {
        first,
        page,
        filter: {
          AND: [
            {
              OR: [
                { column: "NAME", operator: "LIKE", value: `%${searchText}%` }
              ]
            }
          ]
        }
      },
    });
  }

  return{
    handleQuery,
    loading,
    error,
    data
  }
}

const useLazyProductsById = () => {

  const QUERY = gql`
    query ProductsByIds($list: [ID]){
      productsByIds(list: $list ){
        ${PRODUCT_DATA}
      }
    }
  `;

  const [getResults, {loading, error, data}] = useLazyQuery(QUERY, {
    variables: { list: [] },
    skip: false,
    fetchPolicy: 'no-cache'
  });

  async function handleQuery(list = []) {
    await getResults({ variables: { list } });
  }

  return{
    handleQuery,
    loading,
    error,
    data
  }
}

export {
  useIndexProduct,
  useShowProduct,
  useUpdateProduct,
  useDeleteProduct,
  useDuplicateProduct,
  useLazySearchProduct,
  useLazyProductsById
};
