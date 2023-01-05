import { gql, useQuery } from '@apollo/client';

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

const QUERY = gql`
  query Indicators($from: DateTime!, $to: DateTime!){
    indicators {

      users(date:{
        from: $from,
        to: $to
      }){
        ${usersInfos}
      }

      new_users(date:{
        from: $from,
        to: $to
      }){
        ${usersInfos}
      }

      active_users(date:{
        from: $from,
        to: $to
      }){
        ${usersInfos}
      }

      inactive_users(date:{
        from: $from,
        to: $to
      }){
        ${usersInfos}
      }

      trial_users(date:{
        from: $from,
        to: $to
      }){
        ${usersInfos}
      }

      paid_orders(date:{
        from: $from,
        to: $to
      }){
        ${ordersInfos}
      }

      canceled_orders(date:{
        from: $from,
        to: $to
      }){
        ${ordersInfos}
      }

      waiting_pay_orders(date:{
        from: $from,
        to: $to
      }){
        ${ordersInfos}
      }

      orders(date:{
        from: $from,
        to: $to
      }){
        ${ordersInfos}
      }
    }
  }
`;

const useQueryIndicators = ({from, to }) => {

  const { ...rest } = useQuery(QUERY, {
    variables:{ from, to },
    skip: false,
    fetchPolicy: 'no-cache'
  });

  return { ...rest } ;
};
export { useQueryIndicators };
