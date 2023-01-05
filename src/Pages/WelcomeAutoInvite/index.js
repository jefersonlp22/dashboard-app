import React from 'react';
import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat,
  ApolloProvider
} from '@apollo/client';
import { useParams } from "react-router-dom";
import Welcome from './welcome';


export default function () {

  const { tenant } = useParams();

  function createClient(tenantId) {
    const httpLink = new HttpLink({ uri: process.env.REACT_APP_API_URL });

    const authMiddlware = new ApolloLink((operation, forward) => {
      operation.setContext({
        headers: {
          "x-peoplecommerce-tenant-id": tenantId
        }
      });
      return forward(operation);
    });

    const client = new ApolloClient({
      cache: new InMemoryCache({
        addTypename: false
      }),
      link: concat(authMiddlware, httpLink)
    });

    return client;
  }

  return (
      <ApolloProvider client={createClient(tenant)}>
        <Welcome tenantId={tenant} />
      </ApolloProvider>
    )
}
