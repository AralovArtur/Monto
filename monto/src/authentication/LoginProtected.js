import React, {Component} from "react";
import {Redirect, Route} from "react-router-dom";
import {inject, observer} from "mobx-react";

//this page is only for directory ".../login" and ".../register. If user is authenticated he cant go to login or register page, so this class direct user to ".../" page. If user is not authenticated he will go to "../login" page to log in
export default inject("auth")(observer(
  class LoginProtected extends Component {
    render() {
      if (this.props.auth.authenticated) {
        return <Redirect to="/"/>;
      } else {
        return <Route {...this.props} />;
      }
    }
  }
))
