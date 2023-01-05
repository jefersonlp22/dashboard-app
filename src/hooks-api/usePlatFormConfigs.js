import { gql, useQuery } from '@apollo/client';

const usePlatformConfigs = () => {

  const QUERY = gql`
    query{
      getPlatformTermsOfUse(id: 1){
        terms_of_use
        privacy_police
      }
    }
  `;
  return useQuery(QUERY,{
    skip: false,
    fetchPolicy: 'no-cache'
  });
}

export { usePlatformConfigs };
