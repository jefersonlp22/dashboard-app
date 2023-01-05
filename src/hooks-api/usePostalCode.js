import { gql, useLazyQuery } from '@apollo/client';

const usePostalCode = () => {

  const QUERY = gql`
    query PostalCode($postalCode: String){
      searchPostalCode(postal_code: $postalCode){
        postal_code
        state
        city
        address
        district
        city_code
      }
    }
  `; 
  return useLazyQuery(QUERY,{
    skip: false,
    fetchPolicy: 'no-cache'
  });
}

export { usePostalCode };
