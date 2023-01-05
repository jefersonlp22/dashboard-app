import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client';
import PAGINATOR from './queryStrings/paginator';

const COLLECTION_DATA = `
  data{
    id
    name
    description
    is_root
    position
    parent_id
    enabled
    condition
  }
`;

const FACET_VALUES = `
  facet_values{
    id
    name
    facet{
      name
    }
  }
`;

const PRODUCTS = `
  products{
    data{
      id
      name
    }
  }
`;

const FEATURED_ASSET = `
  featured_asset{
    url
    raw_url
  }
`;

const useIndexCollection = ({ first = 10, page = 1, filter = '' }) => {

  const QUERY = gql`
    query Collections($first: Int!, $page: Int, $filter: CollectionsFilterWhereConditions){
      collections(
        first: $first,
        page: $page,
        filter: $filter
      ){
        ${PAGINATOR}
        ${COLLECTION_DATA}
      }
    }
  `;
  return useQuery(QUERY, {
    variables: {
      first,
      page,
      filter
    },
    skip: false,
    fetchPolicy: 'no-cache'
  });
}

const useShowCollection = ({ id = '' }) => {
  const QUERY = gql`
    query Collection($id: ID){
      collection(id: $id){
        ${COLLECTION_DATA}
        ${FACET_VALUES}
        ${PRODUCTS}
        ${FEATURED_ASSET}
      }
    }
  `;
  return useQuery(QUERY, { variables: { id }, skip: false, fetchPolicy: 'no-cache' });
}

const useUpdateCollection = () => {
  const MUTATION = gql`
    mutation SaveCollection(
        $id: ID,
        $name: String!,
        $description: String!,
        $parent_id: Int,
        $position: Int,
        $enabled: Int,
        $condition: String,
        $image: String,
        $face_values: [CollectionFaceValues]!
    ){
      saveCollection(input:{
        id: $id,
        name: $name,
        description: $description,
        parent_id: $parent_id
        position: $position,
        enabled: $enabled,
        condition: $condition,
        image: $image,
        facet_values: $face_values,
      }){
        name
      }
    }
  `;
  return useMutation(MUTATION);
}

const useDeleteCollection = () => {
  const MUTATION = gql`
    mutation DeleteCollection( $id: ID ){
      deleteCollection( id: $id ){
        name
      }
    }
  `;
  return useMutation(MUTATION);
}


const useLazySearchCollection = ({ first = 10, page = 1, filter = '' }) => {

  const QUERY = gql`
    query catalogCollections($first: Int!, $page: Int, $filter: CatalogCollectionsFilterWhereConditions){
      catalogCollections(
        first: $first,
        page: $page,
        filter: $filter
      ){
        ${PAGINATOR}
        ${COLLECTION_DATA}
      }
    }
`;

  const [getResults, { loading, error, data }] = useLazyQuery(QUERY, {
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

  return {
    handleQuery,
    loading,
    error,
    data
  }
}

const useLazyCollectionsById = () => {

  const QUERY = gql`
    query CollectionsByIds($list: [ID]){
      collectionsByIds(list: $list ){
        id
        name
        description
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
  useIndexCollection,
  useShowCollection,
  useUpdateCollection,
  useDeleteCollection,
  useLazySearchCollection,
  useLazyCollectionsById
};
