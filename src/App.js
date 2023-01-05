import React, { useEffect, useState } from "react";
import TotalStorage from "total-storage";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import ReactGA from "react-ga";

import store from "./store";
import {
  privateRoutes,
  publicRoutes,
  welcomeRoute,
  registerRoutes,
  chooseTenantRoute,
  registerOwner
} from "./services/routesProvider";
import { MainTheme } from "./themes";

import { checkAccesLevel } from "./components/HelperFunctions";

import { SessionProvider } from "./contexts/Session.ctx";
import { CouponProvider } from "./contexts/Coupon.ctx";
import { ContextController } from "./controllers/ContextController";

function returnMe() {
  let localUser = localStorage.getItem("USER");
  return JSON.parse(localUser);
}
function initializeReactGA(path) {
  ReactGA.initialize("UA-153602337-1");
  ReactGA.pageview(path);
}

async function initializeConpass() {
  let me = returnMe();
  if (me && window.Conpass) {
    window.Conpass.init({
      name: me.name,
      email: me.email
    });
  }
}

function isRegister() {
  return Boolean(TotalStorage.get("REGISTER_STATE"));
}

function isOwner() {
  const IS_TENANT = Boolean(TotalStorage.get("TENANT"));
  const ACTIVEOWNER = Boolean(TotalStorage.get("ACTIVEOWNER"));
  const IS_AUTH = Boolean(TotalStorage.get("ACCESS_TOKEN"));
  return IS_AUTH && ACTIVEOWNER && IS_TENANT ? true : false;
}

function tenantEmpty() {
  return TotalStorage.get("TENANT") === "empty" || TotalStorage.get("TENANT") === null;
}

// function checkTenant() {
//   const IS_TOKEN = Boolean(TotalStorage.get("ACCESS_TOKEN"));
//   if (IS_TOKEN) {
//     if (TotalStorage.get("TENANT") === "empty" || TotalStorage.get("TENANT") === null) {
//       return false;
//     } else {
//       return false;
//     }
//   }
//   return false;
// }

function isAuth() {
  return Boolean(TotalStorage.get("ACCESS_TOKEN"));
}

const ambassadorPaths = [
  "/",
  "/people",
  "/people/convites",
  "/people/lovers",
  "/people/lovers/detalhes",
  "/people/indicacoes",
  "/people/lovers/grupos",
  "/people/lovers/novo-grupo",
  "/people/clientes",
  "/pedidos/:id",
  "/pedidos",
  "/mais/contrato-lover",
  "/mais/politica-privacidade"
];

function App() {
  const [, setCurrentUser] = useState();

  useEffect(() => {
    let localUser = returnMe();
    setCurrentUser(localUser);
  // eslint-disable-next-line
  }, []);

  return (
    <ContextController
      components={[SessionProvider, CouponProvider]}
    >
    <Provider store={store}>
      <Router>
        <Switch>

          <Route
            path={welcomeRoute.path}
            exact={welcomeRoute.exact}
            key={`welcomeRoute$`}
          >
            {welcomeRoute.component}
          </Route>

          {publicRoutes.map((route, index) =>
            !isAuth() ? (
              <Route
                path={route.path}
                exact={route.exact}
                key={`loginRoute${index}`}
              >
                {route.component}
              </Route>
            ) : null
          )}

          <Route
            path={[
              "/register-name",
              "/register-phone",
              "/register-password",
              "/register-confirm-password"
            ]}
            render={() =>
              isRegister() ? (
                <>
                  {registerRoutes.map((route, index) => (
                    <Route
                      path={route.path}
                      exact={route.exact}
                      key={`registerRoute${index}`}
                    >
                      {route.component}
                    </Route>
                  ))}
                </>
              ) : (
                <Redirect
                  to={{
                    pathname: "/login"
                  }}
                />
              )
            }
          />
          <Route
            path={[
              "/register-company",
              "/register-bank",
              "/register-address",
              "/register-contact",
              "/register-visual"
            ]}
            render={() =>
              isOwner() ? (
                <Switch>
                  {registerOwner.map((route, index) => (
                    <Route
                      key={`owner${index}`}
                      exact={route.exact}
                      path={route.path}
                    >
                      {route.component}
                    </Route>
                  ))}
                </Switch>
              ) : (
                <Redirect
                  to={{
                    pathname: "/login"
                  }}
                />
              )
            }
          />
          <Route
            path={["/choose-tenant"]}
            render={() =>
              isAuth() ? (
                <Route
                  exact={chooseTenantRoute.exact}
                  path={chooseTenantRoute.path}
                >
                  {chooseTenantRoute.component}
                </Route>
              ) : (
                <Redirect
                  to={{
                    pathname: "/login"
                  }}
                />
              )
            }
          />

          <Route
            path="/"
            render={() =>
              // eslint-disable-next-line
              isAuth() && !tenantEmpty() ? (
                <MainTheme>
                  <Switch>
                    {
                    // eslint-disable-next-line
                    privateRoutes.map((route, index) => {
                      if (checkAccesLevel(["admin"])) {
                        return (
                          <PrivateRoute
                            key={`authThemeRoutes${index}`}
                            exact={route.exact}
                            path={route.path}
                          >
                            {route.component}
                          </PrivateRoute>
                        );
                      } else if (
                        checkAccesLevel(["ambassador"]) &&
                        ambassadorPaths.includes(route.path)
                      ) {
                        return (
                          <PrivateRoute
                            key={`authThemeRoutes${index}`}
                            exact={route.exact}
                            path={route.path}
                          >
                            {route.component}
                          </PrivateRoute>
                        );
                      } else if (
                        checkAccesLevel(["ambassador"]) &&
                        route.path === "/"
                      ) {
                        return (
                          <Redirect
                            to={{
                              pathname: "/"
                            }}
                          />
                        );
                      }
                    })}
                  </Switch>
                </MainTheme>
              ) : (
                <Redirect
                  to={{
                    pathname: isAuth() ? '/choose-tenant' : '/login'
                  }}
                />
              )
            }
          />
        </Switch>
      </Router>
    </Provider>
    </ContextController>
  );
}

function PrivateRoute({ children, path, exact }) {
  initializeReactGA(path);
  initializeConpass();
  return (
    <Route
      exact={exact}
      render={({ location }) =>
        isAuth() && children ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login"
            }}
          />
        )
      }
    />
  );
}

export default App;
