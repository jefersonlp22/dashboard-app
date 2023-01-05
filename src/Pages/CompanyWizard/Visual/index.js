import React from "react";
import ConfigMark from "./Visual";
import { AuthLayout } from "../../../Layouts/AuthLayout";

import "./style.scss";

function Visual() {
  return (
    <AuthLayout
      layoutClassName="configMark"
      contentClassName="configMark__clearWidth"
      formClassName="configMark__clearWidth"
      submit={e => e.preventDefault()}
    >
      <ConfigMark />
    </AuthLayout>
  );
}

export { Visual };
