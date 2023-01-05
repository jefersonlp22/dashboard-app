import { useState } from "react";

import client from "../../services/GraphQlRequest";

const useSystemInvites = callback => {
  const [systemInvites, setSystemInvites] = useState([]);
  const [searched, setSearched] = useState(false);
  const [paginatorInfo, setPaginatorInfo] = useState([]);
  const cli = client();

  const loadSystemInvites = async ({first = 10, page = 1, search = ''}) => {
    const query = `query{
      systemInvites(first: ${first},
        page:${page}
          ${ search !== '' ? `
            ,filter:{
              AND: [
                { column: NAME, operator: LIKE, value: "%${search}%" }
                { column: STATUS, operator: EQ, value: 1}
                {
                  OR: [
                    { column: EMAIL, operator: LIKE, value: "%${search}%" }
                    ]
                  }
                ]
            }
          `: `
            ,filter:{
              AND: [
                { column: STATUS, operator: EQ, value: 1}
              ]
            }
          `}){
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
          data{
            id
            name
            code
            level
            email
            status_formatted
          }
      }
    }`;
    try {
      let result = await cli.request(query);
      setSystemInvites(result.systemInvites ? result.systemInvites.data : []);
      setPaginatorInfo(result.systemInvites ? result.systemInvites.paginatorInfo : {});
      setSearched(search !== '');
    } catch (e) {
      console.log("Error ao buscar Convites", e);
    }
  };

  return {
    loadSystemInvites,
    systemInvites,
    paginatorInfo,
    searched
  };
};

export { useSystemInvites };
