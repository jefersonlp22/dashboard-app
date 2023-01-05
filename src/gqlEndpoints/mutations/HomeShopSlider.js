import client from "../../services/GraphQlRequest";

const useSaveShopSlider = callback => {
  const cli = client();

  const saveShopSlider = async (id, slider) => {
    console.log(id,'===', slider)
    const mutation = `mutation{
      saveHomeShopSlider(
        input:{
          ${id ? `id:${id}` : ""}
          title: "${slider.title}",
          link: "${slider.link}",
          ${slider?.channel ? `,channel:"${slider?.channel}"` : ""}
          ${slider?.device ? `,device:"${slider?.device}"` : ""}
          description:"${slider.description}"
          ${slider.image ? `,image:"${slider.image}"` : ""}
        }
      ){
        id
      }
    }`;
    try {
      let result = await cli.request(mutation);
      console.log("result", result);
      return result;
    } catch (e) {
      console.log("Erro ao criar convite", e);
    }
  };

  const deleteHomeShopSlider = async id => {
    const mutation = `mutation{
      deleteHomeShopSlider(id:${id}){
        id
      }
    }`;
    try {
      console.log("mutation:", mutation);
      let result = await cli.request(mutation);
      return result;
    } catch (e) {
      console.log("Erro ao deletar Home Shop Slider", e);
    }
  };

  return {
    saveShopSlider,
    deleteHomeShopSlider
  };
};

export { useSaveShopSlider };
