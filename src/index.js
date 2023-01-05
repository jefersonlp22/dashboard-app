import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "normalize.css";
import "../src/sass/style.scss";
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'styled-components';
import MainTheme from './themes/main';
import { FilterProvider } from './components/FilterNew';
import client from './services/apollo';

ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={MainTheme}>
      <FilterProvider>
        <App />
      </FilterProvider>
    </ThemeProvider>
  </ApolloProvider>,
document.getElementById("root"));
