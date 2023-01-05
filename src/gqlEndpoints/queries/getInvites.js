import { useState } from "react";

import client from "../../services/GraphQlRequest";

const useInvites = callback => {
  const [invites, setInvites] = useState([]);
  const [paginatorInfo, setPaginatorInfo] = useState([]);
  const [searched, setSearched] = useState(false);
  const cli = client();

  const loadInvites = async ({ first = 10, page = 1, search = '', channel = false }) => {
    const query = `query{
      invites(
        first:${first},
        page:${page}
        ,filter: {
          AND: [
            ${search !== '' ? `
              {
                OR: [
                  { column: NAME, operator: LIKE, value: "%${search}%" }
                  { column: EMAIL, operator: LIKE, value: "%${search}%" }
                ]
              },
            `: ''}
            ${channel ? `
              { column: CHANNEL, operator: IS_NOT_NULL }
            `:
        `
                { column: CHANNEL, operator: IS_NULL }
              `
      }
          ]
        }
        ){
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
          code
          name
          level
          email
          channel
          status
          status_formatted
          responsibleUser{
            id
            name
            email
          }
          user{
            network{
              id
            }
          }
          creator{
            id
            name
          }
        }
      }
    }`;
    try {
      let result = await cli.request(query);
      setInvites(result.invites ? result.invites.data : []);
      setPaginatorInfo(result.invites ? result.invites.paginatorInfo : {});
      setSearched(search !== '');
    } catch (e) {
      console.log("Error ao buscar Convites", e);
    }
  };

  return {
    loadInvites,
    invites,
    paginatorInfo,
    searched
  };
};

export { useInvites };
