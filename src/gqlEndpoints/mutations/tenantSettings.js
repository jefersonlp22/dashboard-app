import client from "../../services/GraphQlRequest";

const useTenantSettings = callback => {
  const cli = client();

  const updateSettings = async obj => {
    let mutationInstruction;

    try {
      mutationInstruction = JSON.stringify(obj[0]).replace(
        /"([^("!\\)"]+)":/g,
        "$1:"
      );
    } catch (error) {
      mutationInstruction = JSON.stringify(obj).replace(
        /"([^("!\\)"]+)":/g,
        "$1:"
      );
    }

    const mutation = `mutation{
      settings(input:${mutationInstruction}){
        color{
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
    }`;

    try {
      let result = await cli.request(mutation);
      return result || undefined;
    } catch (e) {
      console.error(`Error ao atualizar tenant`, e);
    }
  };

  const updateHmacKey = async obj => {

    const query = `query{
      generateWebhookSecret{
       secret
       suffix
      }
    }`;

    try {
      let result = await cli.request(query);
      return result || undefined;
    } catch (e) {
      console.error(`Error ao atualizar tenant`, e);
    }
  };

  const updateLoverTerms = async contract => {
    let inputValues = contract.replace(
      /\r?\n|\r/g,
      ""
    );

    const mutation = `mutation{
      updateTenantMe(input:{ambassador_contract:"${inputValues}"}){ambassador_contract}
    }`;

    try {
      let result = await cli.request(mutation);
      return result || undefined;
    } catch (e) {
      console.error(`Error ao Salvar TenantMe`, e);
    }
  };

  return {
    updateSettings,
    updateHmacKey,
    updateLoverTerms
  };
};

export { useTenantSettings };
