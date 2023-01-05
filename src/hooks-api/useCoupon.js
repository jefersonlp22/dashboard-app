import { gql, useQuery, useLazyQuery, useMutation } from "@apollo/client";
import PAGINATOR from "./queryStrings/paginator";

const COUPON_DATA = `
  id
  external_id
  code
  title
  channel
  description
  object_type
  first_purchase
  value
  recipient
  type_value
  discount_formatted
  discount_granted
  discount_granted_formatted
  usage_limit
  discount_amount
  status
  push_title
  push_text
  send_push
  send_email
  email_layout
  email_subject
  used_times
  limit_person_usage
  order_min_amount
  max_discount_amount
  tenant_id
  start_at
  end_at
  closed_at
  locations
  expired_at
  published_at
  audiences{
    id
    type
    audience
    coupon_id
    failed_import
    elegibles
    list_name
  }
  objects{
    id
    type
    references
  }
`;

const COUPON_INDICATORS = `
published{
  quantity

}
expired{
  quantity

}
canceled{
  quantity

}
not_published{
  quantity

}
`;

const useIndexCoupons = ({ first = 10, page = 1, filter = "" }) => {
  let QUERY = gql`
    query(
      $first: Int!,
      $page: Int,
      $filter: CouponsFilterWhereConditions,
      $orderBy: [OrderByClause!]
    ){
      coupons(
        first: $first,
        page: $page,
        filter: $filter,
        orderBy: $orderBy
      ){
        ${PAGINATOR}
        data{
          ${COUPON_DATA}
        }
      }
    }
  `;
  return useQuery(QUERY, {
    variables: {
      first,
      page,
      filter,
      orderBy: [
        {
          field: "CREATED_AT",
          order: "DESC"
        }
      ]
    },
    skip: false,
    fetchPolicy: "no-cache",
  });
};

const useCouponIndicators = () => {
  let QUERY = gql`
    query{
      couponIndicators{
        ${COUPON_INDICATORS}
      }
    }
  `;
  return useQuery(QUERY, {
    skip: false,
    fetchPolicy: "no-cache",
  });
};

const useGetCouponById = () => {

  /**
   *  + `
          usages{
            customer_id
            user_id
            used_times
            avaible
            updated_at
            customer{
              id
              name
              email
              lover{
                name
              }
            }
            user{
              id
              name
              email
            }
          }
        `
   */
  const QUERY = gql`
    query coupon($id: String){
      coupon(id: $id){
        ${COUPON_DATA}
      }
    }
  `;

  const [getResults, { loading, error, data }] = useLazyQuery(QUERY, {
    variables: { id: "" },
    skip: false,
    fetchPolicy: 'no-cache'
  });

  async function handleQuery(id = "") {
    await getResults({ variables: { id } });
  }

  return {
    handleQuery,
    loading,
    error,
    data
  }

};

const useUpdateCoupon = () => {
  const MUTATION = gql`
    mutation updateCoupon(
      $coupon: CouponInput!,
      $audiences: [CouponAudienceInput],
      $object: [CouponObjectInput],
    ) {
      updateCoupon(
        input: { coupon: $coupon, audiences: $audiences, object: $object }
      ) {
        ${COUPON_DATA}
      }
    }
  `;
  return useMutation(MUTATION);
};

const useCloseCoupon = () => {
  const MUTATION = gql`
    mutation CloseCoupon($external_id: String!) {
      closeCoupon(external_id: $external_id) { external_id closed_at }
    }
  `;
  return useMutation(MUTATION);
};
const usePublishCoupon = () => {
  const MUTATION = gql`
    mutation publishCoupon($external_id: String!, $send_notifications: Boolean) {
      publishCoupon(external_id: $external_id, send_notifications: $send_notifications) { ${COUPON_DATA} }
    }
  `;
  return useMutation(MUTATION);
};

const useSendCouponNotification = () => {
  const MUTATION = gql`
    mutation SendCouponNotification($external_id: String!) {
      sendCouponNotification(external_id: $external_id) { external_id }
    }
  `;
  return useMutation(MUTATION);
};

export {
  usePublishCoupon,
  useIndexCoupons,
  useGetCouponById,
  useCouponIndicators,
  useUpdateCoupon,
  useCloseCoupon,
  useSendCouponNotification
};
