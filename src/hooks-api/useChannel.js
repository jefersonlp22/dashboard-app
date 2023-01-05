import { useState, useEffect } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import PAGINATOR from "./queryStrings/paginator";

const USER = `
  external_id
  tenant_id
  level
  user{    
    name
    email   
  }
`;

const useSearchChannel = ({ first = 10, page = 1, hasUser = "" }) => {
  const [results, setResults] = useState([]);

  const QUERY_INDEX = gql`
    query Channels($first: Int!, $page: Int, $hasUser: ChannelsHasUserWhereConditions){
      channels(
        first: $first,
        page: $page,
        hasUser: $hasUser
      ){
        ${PAGINATOR}
        data{
          ${USER}
        }
      }
    }
  `;
  const [getResults, { loading, error, data }] = useLazyQuery(
    QUERY_INDEX,
    {
      variables: {
        first,
        page,
        hasUser,
      },
      skip: false,
      fetchPolicy: "no-cache",
    }
  );

  const level = {
    'ambassador': 'Lover',
    'master': 'Master'
  }

  useEffect(() => {
    if (data) {
      let serialize = data.channels.data?.map((channel) => ({
        email: channel?.user?.email,
        label: `${channel?.user?.name} (${level[channel?.level]})`,        
      }));
      setResults(serialize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  async function handleQuery({ first = 10, page = 1, searchText = "" }) {
    await getResults({
      variables: {
        first,
        page,
        hasUser: {
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
};

export { useSearchChannel };
