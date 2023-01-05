import { useState } from "react";

const useForm = (INITIAL_STATE = {}) => {
  const [inputs, setInputs] = useState(INITIAL_STATE);

  const handleInputChange = event => {
    event.persist();
    setInputs(inputs => ({
      ...inputs,
      [event.target.name]: [event.target.value]
    }));
  };

  const handleRadioChange = event => {
    event.persist();

    setInputs(inputs => ({
      ...inputs,
      [event.target.name]: event.target.value
    }));
  };

  const handleValueChange = event => {
    event.persist();
    setInputs(inputs => ({
      ...inputs,
      [event.target.name]: event.target.value,
      change: true
    }));
  };
  const handleTargetValueChange = (target, value) => {
    setInputs(inputs => ({
      ...inputs,
      [target]: value,
      change: true
    }));
  };

  const handleChecked = event => {
    event.persist();
    setInputs(inputs => ({
      ...inputs,
      [event.target.name]: event.target.checked,
      change: true
    }));
  };

  return {
    handleInputChange,
    handleRadioChange,
    handleValueChange,
    handleTargetValueChange,
    handleChecked,
    inputs
  };
};

const useFormGroup = (INITIAL_STATE = []) => {
  const [inputs, setInputs] = useState(INITIAL_STATE);

  const handleChange = (event, index, channelIndex , channelName) => {
    event.persist();
    let newArr = [...inputs];
    newArr[channelIndex][channelName][index][event.target.name] = event.target.value;
    setInputs(newArr);
  };

  const handleChangeDefinedValue = (event, index, value, channelIndex, channelName) => {
    event.persist();
    let newArr = [...inputs];
    newArr[channelIndex][channelName][index][event.target.name] = value;
    setInputs(newArr);
  };

  const updateState = () => {
    let newArr = [...inputs];
    setInputs(newArr);
  };

  return {
    handleChange,
    handleChangeDefinedValue,
    updateState,
    setInputs,
    inputs
  };
};

export { useFormGroup };
export default useForm;
