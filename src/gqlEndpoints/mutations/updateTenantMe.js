import client from "../../services/GraphQlRequest";

const useUpdateTenantMe = callback => {
  const cli = client();

  const updateTenantMe = async params => {
    const mutation = `mutation{
      updateTenantMe(
        input:{
          name:"${params.name}",
          image:"${params.image}",
          color: {primary:"${params.primaryColor}", secondary: "${params.secondaryColor}"},
          company_trade_name:  "${params.fantasyName}",
          company_name: "${params.companyName}",
          company_document: "${params.companyDocument}",
          company_state_registration: "${params.stateRegistration}",
          company_legal_nature: "${params.legalNature}",
          company_tax_regime: "${params.taxRegime}",
          bank_name: "${params.bankName}",
          bank_number: "${params.bankNumber}",
          bank_agency: "${params.agency}",
          bank_account: "${params.accountNumber}",
          account_type: "${params.accountType}",
          account_name: "${params.accountName}",
          account_document: "${params.accountDocument}",
          person_type: "${params.personType}",
          address:
            {
              name: "${params.name}",
              city: "${params.city}",
              state: "${params.state}",
              postal_code: "${params.postalCode}",
              addressee: "${params.name}",
              address: "${params.address}",
              number: "${params.number}",
              complement: "${params.complement}",
              district: "${params.district}",
              city_code: "${params.cityCode}",
            }
        }){
         id
         account_type
         person_type
         picture_url
      }
    }`;

    try {
      let result = await cli.request(mutation);
      return result || undefined;
    } catch (e) {
      console.error(`Error ao Salvar TenantMe`, e);
    }
  };

  const updateLayoutApp = async params => {
    const mutation = `mutation{
      updateTenantMe(
        input:{
          name:"${params.name}",
          image:"${params.image}",
          color: {primary:"${params.primaryColor}", secondary: "${params.secondaryColor}"}
        }){
         id
         account_type
         person_type
         picture_url
      }
    }`;

    try {
      let result = await cli.request(mutation);
      return result || undefined;
    } catch (e) {
      console.error(`Error ao Salvar TenantMe`, e);
    }
  };

  const updateByQuery = async queryString => {
    const mutation = `mutation{
      updateTenantMe(input: ${queryString}){
         id
         picture_url
         account_type
         person_type
      }
    }`;
    try {
      let result = await cli.request(mutation);
      return result || undefined;
    } catch (e) {
      console.log(`Error ao Salvar TenantMe`, e);
    }
  };

  return {
    updateTenantMe,
    updateByQuery,
    updateLayoutApp
  };
};

export { useUpdateTenantMe };
