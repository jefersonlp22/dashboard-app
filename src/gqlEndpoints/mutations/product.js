import client from "../../services/GraphQlRequest";

const useProduct = callback => {
  const cli = client();

  const product = async (obj, featured) => {
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

    // let finalInstruction = '{ featured_image: "'+featured+'",'+mutationInstruction.slice(1);

    const mutation = `mutation{
      saveProduct(input:${mutationInstruction}){ id  name quantity_items type featured_asset{
          url
        }}
    }`;

    try {
      let result = await cli.request(mutation);

      return result || undefined;
    } catch (e) {
      console.log(`Error ao salvar produto`, e);
    }
  };

  const packVariants = async obj => {
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
      syncPackVariants(input:${mutationInstruction}){
        id
        quantity
        product_variant_id
        setted_price
        price
        subtotal
        final_price
      }
    }`;

    try {
      let result = await cli.request(mutation);

      return result || undefined;
    } catch (e) {
      console.log(`Error ao salvar produto`, e);
    }
  };

  const deleteProduct = async id => {
    const mutation = `mutation{
        deleteProduct(id:${id}){ id  name }
      }`;

    try {
      let result = await cli.request(mutation);
      return result || undefined;
    } catch (e) {
      console.log(`Error ao remover o produto`, e);
    }
  };

  return {
    product,
    packVariants,
    deleteProduct
  };
};

export { useProduct };
