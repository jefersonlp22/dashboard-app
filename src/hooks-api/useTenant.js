import { gql, useLazyQuery, useQuery, useMutation } from '@apollo/client';
import ADDRESS from './queryStrings/address';
import PAGINATOR from './queryStrings/paginator';

const TENANT_DATA = {
  color: `color{ primary secondary }`,
  freight_methods: 'freight_methods',
  legality_settings: `
    legality_settings{
      lover{
        mandatory_age
        minimum_age
      }
      customer{
        mandatory_age
        minimum_age
      }
    }
  `,
  notification: `
    notification{
      order_created{
        email
      }
      order_approved{
        email
      }
      order_paid{
        email
      }
      order_canceled{
        email
      }
      auto_invite{
        email
      }
    }`,
  payment_methods: `
    payment_methods{
      working_days_to_expire_transaction
      payment_type
      max_installments
      min_amount_per_installment
      order_approve_juridical_person
      order_approve_natural_person
      min_transaction_value
    }
  `,
  bonus: `
    bonus{
      bonus_type
      split_payment
      bonus_payment_type
      bonus_rules{
        depth
        type
        value
      }
    }
  `,
  webhooks: `
    webhooks{
      secret
      order_created
      order_approved
      order_canceled
      order_paid
    }
  `,
};

const TENANT_FULL_DATA = `
  ${TENANT_DATA.color}
  ${TENANT_DATA.legality_settings}
  ${TENANT_DATA.freight_methods}
  ${TENANT_DATA.notification}
  ${TENANT_DATA.payment_methods}
  ${TENANT_DATA.bonus}
  ${TENANT_DATA.webhooks}
`;


const TENANT = `
  id
  external_id
  name
  role_id
  data{
    ${TENANT_FULL_DATA}
  }
  term_of_use
  typeof_terms
  picture_url
  lp_banner_image
  company_name
  company_trade_name
  company_document
  company_state_registration
  company_legal_nature
  company_tax_regime
  account_type
  person_type
  bank_number
  bank_account
  bank_agency
  bank_name
  account_name
  account_document
  ambassador_contract
  ${ADDRESS}
`;

export const useUpdateSettings = ({data}) =>{
  const MUTATION = gql`
    mutation Settings(
        $notification: NotificationEmailsInput,
        $payment_methods: PaymentMethodsInput,
        $bonus: BonusInput,
        $webhooks: HooksInput,
        $freight_methods: Boolean,
        $legality_settings: LegalitySettingsInput
    ){
      settings(input:{
        notification: $notification,
        payment_methods: $payment_methods,
        bonus: $bonus,
        webhooks: $webhooks,
        freight_methods: $freight_methods,
        legality_settings: $legality_settings
      }){
        ${data && data !== 'all'? TENANT_DATA[data]: TENANT_FULL_DATA}
      }
    }
  `;
  return useMutation(MUTATION);
}


export const useGenerateWebhookSecret = () => {
  const QUERY = gql`
    query GenerateWebhookSecret{
      generateWebhookSecret{
        secret
        suffix
      }
    }
  `;
  return useLazyQuery(QUERY)
};

export const useUpdateTenant = ({data = null}) => {
  const MUTATION = gql`
    mutation updateTenantMe(
      $name: String,
      $image: String,
      $lp_banner: String,
      $color: TenantColorInput,
      $company_name: String,
      $company_trade_name: String,
      $company_document: String,
      $company_state_registration: String,
      $company_legal_nature: String,
      $company_tax_regime: String,
      $account_type: String,
      $person_type: String,
      $bank_number: String,
      $bank_account: String,
      $bank_agency: String,
      $bank_name: String,
      $account_name: String,
      $account_document: String,
      $address: AddressInput,
      $ambassador_contract: String
      $term_of_use: String
      $typeof_terms: String
    ){
      updateTenantMe(
        input:{
          name: $name,
          image: $image,
          lp_banner: $lp_banner,
          color: $color,
          company_name: $company_name,
          company_trade_name: $company_trade_name,
          company_document: $company_document,
          company_state_registration: $company_state_registration,
          company_legal_nature: $company_legal_nature,
          company_tax_regime: $company_tax_regime,
          account_type: $account_type,
          person_type: $person_type,
          bank_number: $bank_number,
          bank_account: $bank_account,
          bank_agency: $bank_agency,
          bank_name: $bank_name,
          account_name: $account_name,
          account_document: $account_document,
          address: $address,
          ambassador_contract: $ambassador_contract
          term_of_use: $term_of_use,
          typeof_terms: $typeof_terms
        }
      ){
        ${data && data !== 'all' ? data : TENANT}
      }
    }
  `;

  return useMutation(MUTATION);
};

export const useIndexTenantAdmins = ({ first = 900, page = 1 }) => {
  const QUERY_INDEX = gql`
    query Admins($first: Int!, $page: Int){
      admins(
        first: $first,
        page: $page
      ){
        ${PAGINATOR}
        data{
          name
          email
        }
      }
    }
  `;
  return useQuery(QUERY_INDEX,{
    variables: {
      first,
      page
    },
    skip: false,
    fetchPolicy: 'no-cache'
  });
};
