import React from "react";
import Input from "./Input";
const Form = props => {
  const { children } = props;

  return <form {...props}>{children}</form>;
};

export default Form;
export { Input };
