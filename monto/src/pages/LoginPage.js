import { action, decorate, observable } from "mobx";
import { inject, observer } from "mobx-react";
import React from "react";
import { Button, Container, Form, FormGroup, FormText, Input, Label } from "reactstrap";
import AppNav from "../AppNav";

class LoginPage extends React.Component {
  email = "";
  emailError = undefined;

  password = "";
  passwordError = undefined;

  render() {
    return (
      <>
        <AppNav/>

        <Container className="col-md-4 mt-5">
          <Form noValidate={true} onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="email" name="email" id="email" placeholder="Email" value={this.email}
                     onChange={this.handleChange}/>
              {this.emailError && <FormText color="danger">{this.emailError}</FormText>}
            </FormGroup>

            <FormGroup>
              <Label for="password">Password</Label>
              <Input type="password" name="password" id="password" placeholder="Password" value={this.password}
                     onChange={this.handleChange}/>
              {this.passwordError && <FormText color="danger">{this.passwordError}</FormText>}
            </FormGroup>

            <Button color="primary" block>Log in</Button>
          </Form>
        </Container>
      </>
    );
  }

  handleChange = event => {
    this[event.target.name] = event.target.value;
  };

  handleSubmit = async event => {
    event.preventDefault();

    this.emailError = this.email.length === 0 && "Please enter an email.";
    this.passwordError = this.password.length === 0 && "Please enter a password.";

    if (this.emailError || this.passwordError) {
      return;
    }

    const status = await this.props.auth.login(this.email, this.password);

    if (status !== undefined) {
      this.emailError = "Entered credentials are invalid.";
      this.passwordError = "Entered credentials are invalid.";
    }
    else {
      sessionStorage.setItem("user", this.email)
    }
  };
}

decorate(LoginPage, {
  email: observable,
  emailError: observable,
  password: observable,
  passwordError: observable,
  error: observable,
  handleChange: action
});

export default inject("auth")(observer(LoginPage));