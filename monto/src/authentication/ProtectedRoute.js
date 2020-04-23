import React, {Component} from "react";
import {Redirect, Route} from "react-router-dom";
import {inject, observer} from "mobx-react";

export default inject("auth")(observer(
  class ProtectedRoute extends Component {
    render() {
      if (this.props.auth.authenticated) {
        return <Route {...this.props} />;
      } else {
        return <Redirect to="/login"/>;
      }
    }
  }
))