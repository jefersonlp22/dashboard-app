import React, { createContext, useEffect, useState } from "react";

const FreightContext = createContext({});

function FreightProvider({ children }) {
  const [updateData, setUpdatedata] = useState({
    id: "",
    name:"",
    description: "",
    active: false,
    settings: [],
    canRefresh: true,
  });


  return (
    <FreightContext.Provider
      value={{
        updateData,
        setUpdatedata,
      }}
    >
      {children}
    </FreightContext.Provider>
  );
}

export { FreightContext, FreightProvider };
