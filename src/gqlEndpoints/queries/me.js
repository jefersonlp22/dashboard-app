import client from "../../services/GraphQlRequest";

const useMe = callback => {
  const getMe = async () => {
    const query = `query{
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
          data {
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
            }
            payment_methods{
              working_days_to_expire_transaction
              payment_type
              max_installments
              min_amount_per_installment
              order_approve_juridical_person
              order_approve_natural_person
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
            ambassador_contract
            webhooks{
              secret
              order_created
              order_approved
              order_canceled
              order_paid
            }
          }
          picture_url
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
    }`;
    try {
      let result = await client().request(query);
      return result.me || undefined;
    } catch (e) {
      console.log("Error ao buscar usuários", e);
    }
  };

  return { getMe };
};

export { useMe };
