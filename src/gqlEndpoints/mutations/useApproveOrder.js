import client from "../../services/GraphQlRequest";

const useApproveOrder = () => {
  const cli = client();
  const approveOrder = async id => {
    const mutation = `mutation{
      approveOrder(input: {id: "${id}"}){
        id
        external_id
      }
    }`;
    try {
      let result = await cli.request(mutation);
      return result.approved_at;
    } catch (e) {
      console.log(`Error ao liberar pedido #${id}`, e);
    }
  };

  const reproveOrder = async (id, reason) => {
    const mutation = `mutation{
      disapproveOrder(input: {
          id:"${id}",
          disapproval: "${reason}"
      }){
        id
        external_id
      }
    }`;
    try {
      let result = await cli.request(mutation);
      return result;
    } catch (e) {
      console.error(`Error ao cancelar pedido #${id}`, e);
    }
  };

  const shippedOrder = async (id, shipping_code, track_url) => {
    const mutation = `mutation{
      shippedOrder(input: {
          id:"${id}",
          ${shipping_code || shipping_code !== ''? `,shipping_code: "${shipping_code}"` : ''}
          ${track_url || track_url !== '' ? `,track_url: "${track_url}"` : ''}
      }){
        id
        external_id
      }
    }`;
    try {
      let result = await cli.request(mutation);
      return result;
    } catch (e) {
      console.error(`Error ao confirmar envio do pedido #${id}`, e);
    }
  };

  const deliveredOrder = async (id) => {
    const mutation = `mutation{
      deliveredOrder(input: {
          id:"${id}"
      }){
        id
        external_id
      }
    }`;
    try {
      let result = await cli.request(mutation);
      return result;
    } catch (e) {
      console.log(`Error ao confirmar Entrega do pedido #${id}`, e);
    }
  };


  return {
    approveOrder,
    reproveOrder,
    shippedOrder,
    deliveredOrder
  };
};

export { useApproveOrder };
