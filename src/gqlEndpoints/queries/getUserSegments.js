import { useState } from 'react';
import client from "../../services/GraphQlRequest";

const useUserSegments = callback => {  
  const cli = client();

  const [userSegmentsResult, setUserSegments] = useState([]);

  const loadUserSegments = async first => {
    const query = `query{
      userSegments(
        first:${first}         
        ){
        data{     
          id     
          name
          total_users
          total_users_updated_at
        }
      }
    }`;
    try {
      let result = await cli.request(query);            
      setUserSegments(result.userSegments ? result.userSegments.data : []);      
    } catch (e) {
      console.log("Error ao buscar User Segments", e);
    }
  };

  return {
    loadUserSegments,
    userSegmentsResult
  };
};

export { useUserSegments };
