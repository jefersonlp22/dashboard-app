import React from "react";
import {
  useRouteMatch
} from "react-router-dom";

import Layout from "./Layout";

const General = () => {
  let match = useRouteMatch();

  return (
    <Layout>
      <h1>Página em desenvolvimento {match.path}</h1>
    </Layout>
  );
};

export default General;
