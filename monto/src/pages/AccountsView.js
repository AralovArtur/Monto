import React, { Component } from "react";
import {
  Button,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
import AppNav from "../AppNav";
import {decorate, observable} from "mobx";
import {inject, observer} from "mobx-react";

class AccountsView extends Component {
  values = {
    id: 105,
    name: "",
    type: ""
  };

  addingAccount = false;
  isEditing = false;
  editableAccount = null;

  componentDidMount() {
    this.props.accounts.load();
  }

  handleSubmit = async event => {
    event.preventDefault();
    await this.props.accounts.add(
        this.values.name,
        this.values.type
    );
    await this.componentDidMount();
    this.hideModal();
  };

  handleUpdate = async event => {
    event.preventDefault();

    this.editableAccount.name = this.values.name;
    this.editableAccount.type = this.values.type;

    await this.props.accounts.update(this.editableAccount);
    this.hideModal();
  };

  handleChange = event => {
    this.values[event.target.name] = event.target.value;
  };

  hideModal = () => {
    this.addingAccount = false;
    this.isEditing = false;

    this.values.name = "";
    this.values.type = "";
  };

  render() {
    if (this.props.accounts.accounts === undefined) {
      return <AppNav></AppNav>;
    }

    let rows = this.props.accounts.accounts.map(account => (
        <tr key={account.id}>
          <td>{account.name}</td>
          <td>{account.type}</td>
          <td>
            <Button
                size="sm"
                color="danger"
                onClick={() => this.props.accounts.delete(account)}
            >
              Delete
            </Button>
          </td>
          <td>
            <Button
                size="sm"
                onClick={() => {
                  this.editableAccount = account;
                  this.isEditing = true;
                  this.values.name = this.editableAccount.name;
                  this.values.type = this.editableAccount.type;
                }}
            >
              Edit
            </Button>
          </td>
        </tr>
    ));

    return (
        <div>
          <AppNav />
          <Container style={{width: 600, alignItems: 'center', justifyContent: 'center'}}>
            <h1 style={{color: "#000000", margin: 75, fontFamily: "Arial", fontSize: 30 }}>Add account</h1>
            <div>
                <Button
                    color="success"
                    size="sm"
                    icon="plus"
                    onClick={() => (this.addingAccount = true)}
                >
                  Add account
                </Button>
            </div>
            <Table className="mt-4">
              <thead>
              <tr>
                <th> Account</th>
                <th> Type</th>
                <th width="10%"></th>
                <th width="10%"></th>
              </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
            <Modal
                isOpen={this.addingAccount || this.isEditing}
                toggle={this.hideModal}
                className={this.props.className}
            >
              <Form onSubmit={this.isEditing ? this.handleUpdate : this.handleSubmit} noValidate>
                <ModalHeader toggle={this.hideModal}>
                  {this.isEditing ? "Add new account" : "Edit the account"}
                </ModalHeader>
                <ModalBody>
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Input
                        type="text"
                        name="name"
                        id="name"
                        value={this.values.name}
                        onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="type">Type</Label>
                    <Input
                        type="text"
                        name="type"
                        id="type"
                        value={this.values.type}
                        onChange={this.handleChange}
                    />
                  </FormGroup>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" type="submit">
                    Save
                  </Button>
                  <Button
                      color="secondary"
                      onClick={() =>
                          this.hideModal()
                      }
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </Form>
            </Modal>
            <div align={"center"}>
              <Button
                  color="success"
                  size="sm"
                  icon="plus"
                  onClick={this.props.editAccounts}
              >
                Go back
              </Button>
            </div>
          </Container>
        </div>
    );
  }
}

decorate(AccountsView, {
  addingAccount: observable,
  isEditing: observable,
  values: observable
});

export default inject("accounts")(
    observer(AccountsView)
);