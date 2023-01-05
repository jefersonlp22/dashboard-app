import { 
  ApolloClient, 
  HttpLink,
  ApolloLink,  
  InMemoryCache,
  concat
} from '@apollo/client';

function getCredential(){
  const ACCESS_TOKEN = localStorage.getItem("@Auth:token");
  const TENANT_ID = localStorage.getItem("@Auth:tenant");
  return {
    authorization: `Bearer ${ACCESS_TOKEN}`,
    "x-peoplecommerce-tenant-id": TENANT_ID && TENANT_ID !== "empty" ? TENANT_ID : ""
  }
}

const httpLink = new HttpLink({ uri: process.env.REACT_APP_API_URL });

const authMiddlware = new ApolloLink((operation, forward)=>{
  operation.setContext({
    headers: getCredential()
  });
  return forward(operation);
})

const client = new ApolloClient({
  cache: new InMemoryCache({
    addTypename: false
  }),
  link: concat(authMiddlware, httpLink)
});



export default client;
