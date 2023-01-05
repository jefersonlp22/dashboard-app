import { gql, useQuery, useLazyQuery } from "@apollo/client";
import PAGINATOR from "./queryStrings/paginator";

const useGetStateList = () => {
  const QUERY = gql`
    query{
      stateList{
        uf_id
        uf_nome
        uf_sigla
        location_range{
          from_cep
          to_cep
          id
        }
      }
    }
  `;
  return useQuery(QUERY, {
    skip: false,
    fetchPolicy: "no-cache",
  });
};

const useGetZipRangeList = () => {
  const QUERY = gql`
    query ZipRangeList(
      $id: ID
      $uf_id: Int
    ){
      zipRangeList(id: $id, uf_id: $uf_id){
        id
        uf_id
        localidade        
        cep_inicial
        cep_final        
      }
    }
  `;
  return useLazyQuery(QUERY,{
    skip: false,
    fetchPolicy: "no-cache",
  });
};


export { useGetStateList, useGetZipRangeList };
