import client from "../../services/GraphQlRequest";
import { useState } from "react";

const useIndications = callback => {
  const [indications, setIndications] = useState([]);
  const [paginatorInfo, setPaginatorInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const getIndications = async ({first = 10, page = 1, search = ''}) => {
    const query = `query{
        indications(
          first:${first},
          page:${page}
          ${ search !== '' ? `
            ,filter:{
              AND: [
                  { column: NAME, operator: LIKE, value: "%${search}%" }
                  {
                    OR: [
                      { column: EMAIL, operator: LIKE, value: "%${search}%" }
                    ]
                  }
                ]
            }
          `: ''}
        ) {
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
            data {
              id
              email
              phone
              name
              status_formatted
              responsibleUser{
                name
                email
              }
              creator{
                name
                email
                network{
                  level
                }
              }
              invite {
                id
                name
                email
                phone
                status
                status_formatted
                level
              }
            }
        }
    }`;
    try {
      setLoading(true);
      let result = await client().request(query);
      setIndications(result.indications.data);
      setPaginatorInfo(result.indications ? result.indications.paginatorInfo : {});
      setLoading(false);
    } catch (e) {
      console.log("Error ao buscar indicações", e);
    }
  };

  return { indications, getIndications, paginatorInfo, loading };
};

export { useIndications };
