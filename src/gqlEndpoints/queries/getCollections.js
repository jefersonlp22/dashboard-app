import { useState } from "react";

import client from "../../services/GraphQlRequest";

const useColections = callback => {
  const [collections, setColections] = useState([]);

  const cli = client();
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

  const loadCollections = async (first, page) => {
    const query = `query{
      collections(first:${first || 10}, page:${page || 1}){
        data{
          id
          name
          description
          is_root
          position
          parent_id
          enabled
         }
         paginatorInfo{
           count
           currentPage
           firstItem
           lastItem
           lastPage
           hasMorePages
           perPage
           total
         }
      }
    }`;
    try {
      return await cli.request(query);
    } catch (e) {
      console.log("Error ao buscar collections", e);
    }
  };

  const catalogCollections = async ({first, page, searchText}) => {
    const query = `query  {
      catalogCollections(
        first:  ${first},
        page:  ${page}
        ${
          searchText !== ""
            ? `
          filter:{
            OR: [
              { column: NAME, operator: LIKE, value: "%${searchText}%" }
            ]
          }
        `
            : ""
        }
      ){
        paginatorInfo{
          total
          count
          currentPage
          firstItem
          hasMorePages
          lastItem
          lastPage
          perPage
        }
        ${COLLECTION_DATA}
      }
    }`;

    try {
      let result = await cli.request(query);
      return result?.catalogCollections?.data
    } catch (e) {
      console.log("Error ao buscar collections", e);
    }
  };

  return {
    loadCollections,
    catalogCollections,
    collections
  };
};

export { useColections };
