import { gql, useQuery } from "@apollo/client";
import PAGINATOR from "./queryStrings/paginator";

const ORDERS_DATA = `
  id
  code
  external_id
  user_id
  placed_at
  delivered_at
  paid_at
  approved_at
  billed_at
  shipped_at
  canceled_at
  total_formatted
  shipping
  customer{
    id
    name
  }
  items{
    id
    order_id
    name
    quantity
    subtotal
    discount
    total
  }
  user{
    name
  } 
`;

const useIndexOrders = ({ first = 10, page = 1, filter = "", hasUser = "", hasCustomer = "", orderBy = "" }) => {
  let QUERY = gql`
    query Orders(
      $first: Int!,
      $page: Int,
      $filter: OrdersFilterWhereConditions,
      $hasUser: OrdersHasUserWhereConditions,
      $hasCustomer: OrdersHasCustomerWhereConditions,
      $orderBy: [OrdersOrderByOrderByClause!]
    ){
      orders(
        first: $first,
        page: $page,
        filter: $filter,
        hasUser: $hasUser,
        hasCustomer: $hasCustomer,
        orderBy: $orderBy 
      ){
        ${PAGINATOR}
        data{
          ${ORDERS_DATA}
        }
      }
    }
  `;
  return useQuery(QUERY, {
    variables: {
      first,
      page,
      filter,
      hasUser,
      hasCustomer,
      orderBy
    },
    skip: false,
    fetchPolicy: "no-cache",
  });
};

const useShowOrder = ({ id = "" }) => {
  const QUERY = gql`
    query BonusId($id: String){
      bonusId(id: $id){
        ${ORDERS_DATA}        
      }
    }
  `;
  return useQuery(QUERY, {
    variables: { id },
    skip: false,
    fetchPolicy: "no-cache",
  });
};

const useIndicatorsOrder = ({ date }) => {
  let QUERY = gql`
    query OrderIndicator(
      $date: DateRange
    ) {
      indicators {
        paid_orders(date: $date) {
          quantity
          sum
          sum_formatted
          avg
          avg_formatted
        }
      }
    }
  `;
  return useQuery(QUERY, {
    variables: {
      date
    },
    skip: false,
    fetchPolicy: "no-cache",
  });
};

export { useIndexOrders, useShowOrder, useIndicatorsOrder };
