import { useState } from "react";
import client from "../../services/GraphQlRequest";

// import { Container } from './styles';

const UseStateList = props => {
  const [loadStates, setLoadStates] = useState(false);
  const [stateList, setStateList] = useState([]);
  const cli = client();

  const getStateList = async () => {
    const query = `query{
      stateList{
        uf_id
        uf_nome
        uf_sigla
        location_range{
          from_cep
          to_cep
          id
        }
      }
    }`;
    try {
      setLoadStates(true);
      let result = await cli.request(query);
      setStateList(result.stateList ? result.stateList : []);
      setLoadStates(false);
    } catch (e) {
      console.log("Error ao buscar o Canal", e);
    }
  };
  return {
    loadStates,
    getStateList,
    stateList
  };
};

export { UseStateList };
