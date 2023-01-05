import { gql, useQuery, useMutation } from '@apollo/client';
import PAGINATOR from './queryStrings/paginator';

const FACET_DATA = `
  id
  name
  color
  visible
  values{
    id
    name
  }  
`;

const useIndexFacet = ({ first = 10, page = 1}) => {
  const QUERY = gql`
    query Facets($first: Int!, $page: Int){
      facets( first: $first, page: $page ){
        ${PAGINATOR}
        data{ ${FACET_DATA} }
      }
    }
  `;
  return useQuery(QUERY, {
    variables: { first, page },
    skip: false,
    fetchPolicy: 'no-cache'
  });
};

const useUpdateFacet = () =>{
  const MUTATION = gql`
    mutation SaveFacet(
        $id: ID, 
        $name: String, 
        $color: String,         
        $visible: Int,        
        $values: [FacetValueInput]        
    ){
      saveFacet(input:{
        id: $id,
        name: $name, 
        color: $color, 
        visible: $visible,        
        values: $values        
      }){        
        ${FACET_DATA}
      }
    }
  `;
  return useMutation(MUTATION);
}

const useDeleteFacet = () =>{
  const MUTATION = gql`
    mutation DeleteFacet( $id: ID! ){
      deleteFacet( id: $id ){ id  name }
    }
  `;
  return useMutation(MUTATION);
}

export { useIndexFacet, useUpdateFacet, useDeleteFacet };
