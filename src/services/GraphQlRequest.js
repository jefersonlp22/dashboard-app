import { GraphQLClient } from "graphql-request";
import TotalStorage from "total-storage";
import axios from 'axios';



const client = () => {
  const API = process.env.REACT_APP_API_URL;
    const [ACCESS_TOKEN, TENANT_ID] = TotalStorage.get([
      "@Auth:token",
      "@Auth:tenant"
    ]);

  const gqlClient = new GraphQLClient(API, {
    headers: {
      authorization: ACCESS_TOKEN ? `Bearer ${ACCESS_TOKEN}` : "",
      "x-peoplecommerce-tenant-id":
        TENANT_ID && TENANT_ID !== "empty" ? TENANT_ID : ""
    }
  });

  return gqlClient;
};


function serviceFile(formData, external_id, list_id) {
    console.log('chegou', formData?.name)
    console.log('external_id', external_id)
    console.log('list_id', list_id)

  const form = new FormData();

  const URL = process.env.REACT_APP_SEND_FILE;
  const [ACCESS_TOKEN, TENANT_ID] = TotalStorage.get([
    "@Auth:token",
    "@Auth:tenant"
  ]);

  form.append("spreadsheet", formData);
  form.append("coupon", external_id);
  form.append("list", list_id);
  form.append("filename", formData?.name);
//url: "https://api.sandbox.peoplecommerce.com.br/coupon/audience",
  const options = {
    method: 'POST',
    //url: "https://api.sandbox.peoplecommerce.com.br/coupon/audience",
    //url: "https://api.onawa.me/coupon/audience",
    url: URL,
    headers: {
      'x-peoplecommerce-tenant-id': TENANT_ID && TENANT_ID !== "empty" ? TENANT_ID : "",
      'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
      Authorization: ACCESS_TOKEN ? `Bearer ${ACCESS_TOKEN}` : "",
    },
    data: form
  };
  let responseRequest = axios.request(options).then(function (response) {
    console.log('sucesso',response.data);
    return response.data
  }).catch(function (error) {
    console.error('error',error);
    return error
  });
  return  responseRequest;
}

export  {serviceFile};

export default client;
