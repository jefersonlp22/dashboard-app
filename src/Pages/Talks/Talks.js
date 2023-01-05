import React, { useState, useEffect } from "react";
import "./styles.scss";
import { List } from "./List";

import gqlClient from "../../services/GraphQlRequest";
import { Paginator } from "../../components";

import { useUpdateTalk } from "../../gqlEndpoints/mutations";

const Talks = () => {
  const [loading, setLoading] = useState(false);
  const [talks, setTalks] = useState([]);
  const { deleteTalk } = useUpdateTalk();
  const [paginator, setPaginator] = useState(false);
  const [paginatorValues, setPaginatorValue] = useState(false);

  const handleDelete = async id => {
    setLoading(true);
    let result = await deleteTalk(id);
    if (result) {
      getTalks(10, 1);
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getTalks = async (first, page) => {
    const query = `query{
      talks(first: ${first}, page: ${page}){
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
          title
          featured_asset{
            url
          }
          content
          tags
          created_at
        }
      }
    }`;

    const results = await gqlClient().request(query);
    setTalks(results.talks.data);
    setPaginator(results.talks.paginatorInfo);
    setLoading(false);
  };

  useEffect(() => {
    let first = paginatorValues?.first || 10;
    let page = paginatorValues?.page || 1;
    setLoading(true);
    getTalks(first, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginatorValues]);

  return (
    <div className="orders__wrapper">
      <List
        data={talks}
        loading={loading}
        deleteItem={id => handleDelete(id)}
      />
      <Paginator
        data={paginator}
        onChange={setPaginatorValue}
      />
    </div>
  );
};

export { Talks };
