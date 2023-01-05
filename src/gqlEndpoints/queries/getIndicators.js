import { useState } from "react";

import client from "../../services/GraphQlRequest";

const useIndicators = callback => {
  const [indicators, setData] = useState([]);
  const [ordersIndicators, setOrdersIndicators] = useState([]);
  const [loadingIndicators, setLoading] = useState(false);
  const cli = client();

  const ordersInfos = `
    quantity
    sum
    sum_formatted
    avg
    avg_formatted
  `;

  const usersInfos = `
    quantity
  `;

  const loadIndicators = async ({ from = "", to = "" }) => {
    const query = `query{
      indicators {
        
        users(date:{
          from: "${from}",
          to: "${to}" 
        }){
          ${usersInfos}
        }  

        new_users(date:{
          from: "${from}",
          to: "${to}" 
        }){
          ${usersInfos}
        } 

        active_users(date:{
          from: "${from}",
          to: "${to}" 
        }){
          ${usersInfos}
        } 

        inactive_users(date:{
          from: "${from}",
          to: "${to}" 
        }){
          ${usersInfos}
        } 

        trial_users(date:{
          from: "${from}",
          to: "${to}" 
        }){
          ${usersInfos}
        } 

        paid_orders(date:{
          from: "${from}",
          to: "${to}" 
        }){          
          ${ordersInfos}
        }        
       
        canceled_orders(date:{
          from: "${from}",
          to: "${to}" 
        }){          
          ${ordersInfos}
        }     

        waiting_pay_orders(date:{
          from: "${from}",
          to: "${to}" 
        }){
          ${ordersInfos}
        }


        orders(date:{
          from: "${from}",
          to: "${to}" 
        }){
          ${ordersInfos}
        }        
      }
    }`;
    try {
      setLoading(true);
      let result = await cli.request(query);
      setData(result?.indicators ? result.indicators : []);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log("erros", e);
      //throw new Error("Error ao buscar Indicadores", e);
    }
  };

  const loadOrderIndicators = async ({ from = "", to = "" }) => {
    const query = `query{
      indicators {
        paid_orders(date:{
          from: "${from}",
          to: "${to}" 
        }){          
          ${ordersInfos}
        }        
       
        canceled_orders(date:{
          from: "${from}",
          to: "${to}" 
        }){          
          ${ordersInfos}
        }     

        waiting_pay_orders(date:{
          from: "${from}",
          to: "${to}" 
        }){
          ${ordersInfos}
        }

        orders(date:{
          from: "${from}",
          to: "${to}" 
        }){
          ${ordersInfos}
        }        
      }
    }`;
    try {
      setLoading(true);
      let result = await cli.request(query);
      setOrdersIndicators(result?.indicators ? result.indicators : []);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log("erros", e);
      //throw new Error("Error ao buscar Indicadores", e);
    }
  };

  return {
    loadIndicators,
    loadOrderIndicators,
    indicators,
    ordersIndicators,
    loadingIndicators
  };
};

export { useIndicators };
