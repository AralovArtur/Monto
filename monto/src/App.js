import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./authentication/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import LoginProtected from "./authentication/LoginProtected";
import Transactions from "./pages/Transactions";
import Settings from "./pages/UserSettingsPage";

class App extends Component {
  state = {};

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact={true} component={Home} />
          <LoginProtected path="/login" exact={true} component={LoginPage} />
          <LoginProtected
            path="/register"
            exact={true}
            component={RegisterPage}
          />
          <ProtectedRoute
            path="/dashboard"
            exact={true}
            component={Dashboard}
          />
          <ProtectedRoute
            path="/transactions"
            exact={true}
            component={Transactions}
          />
          <ProtectedRoute
              path="/settings"
              exact={true}
              component={Settings}
          />
          {/*<ProtectedRoute path="/categories" exact={true} component={CategoriesView} />*/}
          {/*<ProtectedRoute path="/accounts" exact={true} component={AccountsView} />*/}
          <Route path="*" component={() => "404 NOT FOUND"} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
