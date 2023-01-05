import { gql, useLazyQuery } from '@apollo/client';

const QUERY = gql`
  query{
    me {
      id
      name
      email
      roles{
        name
      }
      apps{
        name
      }
      network{
        level
      }
      is_super_admin
      tenants{
        id
        external_id
        name
        ambassador_contract
        term_of_use
        typeof_terms
        data {
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
          color {
              primary
              secondary
          }
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
          }
          payment_methods{
            working_days_to_expire_transaction
            payment_type
            max_installments
            min_amount_per_installment
            order_approve_juridical_person
            order_approve_natural_person
            min_transaction_value
          }
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
          webhooks{
            secret
            order_created
            order_approved
            order_canceled
            order_paid
          }
          freight_methods
        }
        picture_url
        lp_banner_image
        company_name
        company_document
        company_state_registration
        company_trade_name
        company_tax_regime
        company_legal_nature
        account_type
        person_type
        bank_name
        bank_agency
        bank_account
        bank_number
        account_name
        account_document
        address{
          id
          address
          name
          number
          city
          city_code
          complement
          postal_code
          local_reference
          state
          district
          addressee
        }
      }

    }
  }
`;

const useMe = () => useLazyQuery(QUERY, { skip: false, fetchPolicy: 'no-cache' });

export { useMe };
