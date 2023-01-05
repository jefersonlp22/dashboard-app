import { gql, useQuery } from '@apollo/client';

const useIndexBanks = () => {

  const QUERY = gql`
    query Banks{
      banks{
        number
        name
      }
    }
  `;
  return useQuery(QUERY,{
    skip: false,
    fetchPolicy: 'no-cache'
  });
}

export { useIndexBanks };
