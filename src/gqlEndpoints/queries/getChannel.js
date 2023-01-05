import { useState } from "react";
import client from "../../services/GraphQlRequest";

const useChannel = callback => {
  const cli = client();

  const [channel, setChannel] = useState([]);
  const [paginatorInfo, setPaginatorInfo] = useState([]);
  const [channelById, setChannelById] = useState({});
  const [loading, setLoading] = useState(false);
  const [ordersChannel, setOrdersChannel] = useState([]);
  const [loadOrders, setLoadOrders] = useState(false);
  const [channelCustomers, setChannelCustomers] = useState([]);

  const loadChannel = async ({ first = 10, page = 1, searchText = "" }) => {
    const query = `query{
      channels(
        first:${first}, page:${page}
        ${
          searchText !== ""
            ? `
          hasUser:{
            AND: [
              {
                OR: [
                  { column: NAME, operator: LIKE, value: "%${searchText}%" }
                  { column: EMAIL, operator: LIKE, value: "%${searchText}%" }
                ]
              }
            ]
          }
        `
            : ""
        }
        ){
        data{
          id
          level
          user{
            id
            name
            agreed_at
            email
            company_address{
              id
              name
              postal_code
              addressee
              address
              number
              district
              complement
              city
              state
              city_code
              local_reference
            }
            customers{
              id
              name
              email
            }
          }
          responsible{
            user{
              id
              name
            }
          }

        }
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
      }
    }`;
    try {
      setLoading(true);
      let result = await cli.request(query);
      setChannel(result.channels ? result.channels.data : []);
      setPaginatorInfo(result.channels ? result.channels.paginatorInfo : {});
      setLoading(false);
    } catch (e) {
      console.log("Error ao buscar o Canal", e);
    }
  };

  const loadCustomers = async ({ first = 10, page = 1, searchText = "" }) => {
    const query = `query{
      findCustomersByEmail(
        first:${first}, page:${page}
        ${
          searchText !== ""
            ? `
          filter:{
            OR: [
              { column: NAME, operator: LIKE, value: "%${searchText}%" }
              { column: EMAIL, operator: LIKE, value: "%${searchText}%" }
            ]
          }
        `
            : ""
        }
        ){
        data{
          id
          email
          name
        }
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
      }
    }`;
    try {
      setLoading(true);
      let result = await cli.request(query);
      setChannelCustomers(result.findCustomersByEmail ? result.findCustomersByEmail.data : []);
      setPaginatorInfo(result.findCustomersByEmail ? result.findCustomersByEmail.paginatorInfo : {});
      setLoading(false);
    } catch (e) {
      console.log("Error ao buscar o clientes", e);
    }
  };

  const getChannel = async id => {
    const query = `query{
      channel(id:"${id}"){
        id
        level
        user{
          id
          name
          email
          phone
          birthday
          document
          picture_url
          company_name
          company_trade_name
          company_document
          company_state_registration
          company_legal_nature
          company_tax_regime
          agreed_at

          accounts {
            id
            account_type
            person_type
            bank_number
            bank_account
            bank_agency
            bank_name
            account_name
            account_document
          }

          company_address{
            id
            name
            postal_code
            addressee
            address
            number
            district
            complement
            city
            state
            city_code
            local_reference
          }

          address{
            id
            name
            postal_code
            addressee
            address
            number
            district
            complement
            city
            state
            city_code
            local_reference
          }
        }
        responsible{
          user{
            id
            name
          }
        }
      }
    }`;
    try {
      setLoading(true);
      let result = await cli.request(query);
      setChannelById(result.channel ? result.channel : []);
      setLoading(false);
    } catch (e) {
      console.log("Error ao buscar o Canal", e);
    }
  };

  const getOrdersChannel = async id => {
    const query = `query{
      channel(id:"${id}"){
        id
        user{
          id
          orders{
            id
            external_id
            placed_at
            approved_at
            canceled_at
            total_formatted
            customer{
              name
            }
          }
        }
      }
    }`;
    try {
      setLoadOrders(true);
      let result = await cli.request(query);
      setOrdersChannel(result.channel ? result.channel?.user?.orders : []);
      setLoadOrders(false);
    } catch (e) {
      console.log("Error ao buscar o Canal", e);
    }
  };

  return {
    loadChannel,
    channel,
    paginatorInfo,
    loading,
    getChannel,
    channelById,
    getOrdersChannel,
    ordersChannel,
    loadOrders,
    loadCustomers,
    channelCustomers,
  };
};

export { useChannel };
