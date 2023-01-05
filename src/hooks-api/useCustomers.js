import { useState, useEffect } from "react";
import { gql, useLazyQuery } from '@apollo/client';
import PAGINATOR from './queryStrings/paginator';

const CUSTOMER = `  
  name
  email   
`;

const useSearchCustomer = ({ first = 10, page = 1, filter = '' }) => {
  const [results, setResults] = useState([]);

  const QUERY_INDEX = gql`
    query Customers($first: Int!, $page: Int, $filter: CustomersFilterWhereConditions){
      customers(
        first: $first,
        page: $page,
        filter: $filter
      ){
        ${PAGINATOR}
        data{
          ${CUSTOMER}
        }
      }
    }
  `;

  const [getResults, { loading, error, data }] =  useLazyQuery(QUERY_INDEX,{
    variables: {
      first,
      page,
      filter
    },
    skip: false,
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    if (data) {
      let serialize = data.customers.data?.map((customer) => ({
        email: customer?.email,
        label: `${customer?.name}`,
      }));
      setResults(serialize);
    }
  }, [data]);

  async function handleQuery({ first = 10, page = 1, searchText = "" }) {
    await getResults({
      variables: {
        first,
        page,
        filter: {
          AND: [{ column: "NAME", operator: "LIKE", value: `%${searchText}%` }],
        },
      },
    });
  }

  return {
    handleQuery,
    loading,
    results,
    error,
  };
}

export { useSearchCustomer };
