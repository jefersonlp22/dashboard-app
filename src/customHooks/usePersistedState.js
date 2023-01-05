import { useState, useEffect } from 'react';


function usePersistedState(key, initialState) {

  const [state, setState] = useState(() => {
    const storagedValue = localStorage.getItem(key);
    return storagedValue ? storagedValue : initialState;
  });

  const getItem = (key) => {    
    return localStorage.getItem(key);
  }

  useEffect(() => {
    localStorage.setItem(key, state);
  }, [key, state]);

  return [
    state,
    setState,
    getItem
  ];
};

export { usePersistedState };
