import { gql, useQuery, useMutation } from '@apollo/client';
import PAGINATOR from './queryStrings/paginator';

const BONUS_DATA = `
  id
  external_id
  order{
    id
    external_id
    code
    total_formatted
    paid_at
  }
  user{
    id
    name
    relationship_brand
  }
  depth
  type
  network_bonus_type
  network_bonus_value
  network_bonus_formatted
  original_total
  original_total_formatted
  total
  total_formatted
  installments
  fully_rescued_at
  canceled_at
  tenant{
    external_id
  }
  latest_audit{
    id
    user{
        name
    }   
}
`;

const BONUS_INSTALLMENT = `
  bonus_installments{
    id
    description
    value
    value_formatted
    available_at
    rescued_at
    canceled_at
    bonus{
      ${BONUS_DATA}
    }
  }
`

const useIndexBonus = ({ first = 10, page = 1, filter = '', hasOrder = '', hasUser = '' }) => {

  let QUERY = gql`
    query Bonus(
      $first: Int!,
      $page: Int,
      $filter: BonusFilterWhereConditions,
      $hasOrder: BonusHasOrderWhereConditions,
      $hasUser: BonusHasUserWhereConditions
    ){
      bonus(
        first: $first,
        page: $page,
        filter: $filter,
        hasOrder: $hasOrder,
        hasUser: $hasUser
      ){
        ${PAGINATOR}
        data{
          ${BONUS_DATA}
        }
      }
    }
  `;
  return useQuery(QUERY,{
    variables: {
      first,
      page,
      filter,
      hasOrder,
      hasUser
    },
    skip: false,
    fetchPolicy: 'no-cache'
  });
}

const useShowBonus = ({ id = '' }) => {
  const QUERY = gql`
    query BonusId($id: String){
      bonusId(id: $id){
        ${BONUS_DATA}
        ${BONUS_INSTALLMENT}
      }
    }
  `;
  return useQuery(QUERY, { variables: { id } , skip: false, fetchPolicy: 'no-cache' });
}

const useBonusRescuedList = () => {
  const MUTATION = gql`
    mutation BonusRescuedList( $data: [BonusRescued] ){
      bonusRescuedList(
        input: {
          data: $data
        }){        
        external_id
      }
    }
  `;
  return useMutation(MUTATION);
}

const useBonusUnRescueList = () => {
  const MUTATION = gql`
    mutation BonusUnRescueList( $data: [BonusRescued] ){
      bonusUnRescueList(
        input: {
          data: $data
        }){        
        external_id
      }
    }
  `;
  return useMutation(MUTATION);
}

const useIndicatorsBonus = ({ filter = '', hasOrder = '', hasUser = '' }) => {

  let QUERY = gql`
    query BonusIndicator(      
      $filter: BonusIndicatorFilterWhereConditions,
      $hasOrder: BonusIndicatorHasOrderWhereConditions
      $hasUser: BonusIndicatorHasUserWhereConditions
    ){
      bonusIndicator(        
        filter: $filter,
        hasOrder: $hasOrder,
        hasUser: $hasUser
      ){              
        total_formatted
        total_pending_formatted
        total_rescued_formatted        
      }
    }
  `;
  return useQuery(QUERY,{
    variables: {      
      filter,
      hasOrder,
      hasUser
    },
    skip: false,
    fetchPolicy: 'no-cache'
  });
}

export { useIndexBonus, useShowBonus, useBonusRescuedList, useBonusUnRescueList, useIndicatorsBonus };
