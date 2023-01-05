import React, { useState, createContext, useContext } from "react";
import FilterLayout from "./Filter";

const FilterContext = createContext({});

function FilterProvider({ children }) {
  const [filter, setFilter] = useState(null);
  const [action, setAction] = useState(null);

  return (
    <FilterContext.Provider value={{ filter, setFilter, action, setAction }}>
      {children}
    </FilterContext.Provider>
  );
}

function Filter({ config, children, ...props }) {
  const { ...filterProps } = useContext(FilterContext);
  return (
    <div {...props}>
      <FilterLayout {...config} contextState={filterProps} />
      {children}
    </div>
  );
}

export { FilterContext, FilterProvider, Filter };
