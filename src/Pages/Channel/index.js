import React from "react";
import { Tab, TabItem } from "../../components/Tab";
import General from "./General";
import List from "./List";
import Invite from "./Invite";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useRouteMatch
} from "react-router-dom";
import ReactGA from "react-ga";
function initializeReactGA(path) {
  ReactGA.initialize("UA-153602337-1");
  ReactGA.pageview(path);
}
const Channel = () => {
  let match = useRouteMatch();
  let location = useLocation();

  initializeReactGA(location.pathname);
  return (
    <>
      <Router>
        <Tab>
          <TabItem to={`/canal/convites`} title="Convites" />
          <TabItem />
        </Tab>

        <Switch>
          <Route path={`/canal/convites`}>
            <Invite />
          </Route>
          <Route path={`${match.path}/list`}>
            <List />
          </Route>
          <Route path={match.path}>
            <General />
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default Channel;
