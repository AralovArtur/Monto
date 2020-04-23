import { action, decorate, observable } from "mobx";
import { inject, observer } from "mobx-react";
import React from "react";
import { Button, Container, Form, FormGroup, FormText, Input, Label } from "reactstrap";
import AppNav from "../AppNav";

class RegisterPage extends React.Component {
  email = "";
  emailError = false;

  password = "";
  passwordError = false;

  repeatedPassword = "";
  repeatedPasswordError = false;

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
              <FormText color={this.passwordError ? "danger" : "muted"}>Password must be at least 8 characters
                long.</FormText>
            </FormGroup>

            <FormGroup>
              <Label for="repeatedPassword">Repeat the password</Label>
              <Input type="password" name="repeatedPassword" id="repeatedPassword"
                     placeholder="Repeat the password"
                     value={this.repeatedPassword}
                     onChange={this.handleChange}/>
              {this.repeatedPasswordError && <FormText color="danger">{this.repeatedPasswordError}</FormText>}
            </FormGroup>

            <Button color="primary" block>Register</Button>
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

    this.error = undefined;

    this.emailError = this.email.length === 0 && "Please enter an email";
    this.passwordError = this.password.length < 8 && "Password must be at least 8 characters long";
    this.repeatedPasswordError = !this.passwordError && this.password !== this.repeatedPassword && "Entered passwords do not match.";

    if (this.emailError || this.passwordError || this.repeatedPasswordError) {
      return;
    }

    const status = await this.props.auth.register(this.email, this.password);

    if (status === 409 /* Conflict */) {
      this.emailError = "This email address is already in use.";
    }
  };
}

decorate(RegisterPage, {
  email: observable,
  emailError: observable,
  password: observable,
  passwordError: observable,
  repeatedPassword: observable,
  repeatedPasswordError: observable,
  error: observable,
  handleChange: action
});

export default inject("auth")(observer(RegisterPage));