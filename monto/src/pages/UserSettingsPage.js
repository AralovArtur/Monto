import React from "react";
import AppNav from "../AppNav";
import {
    Button,
    Container,
    Form,
    FormGroup,
    FormText,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader, Table
} from "reactstrap";
import {inject, observer} from "mobx-react";

class UserSettingsPage extends React.Component {


    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            changePassword: undefined,

            password: "",
            passwordError: false,

            repeatedPassword: "",
            repeatedPasswordError: false,

            repeatedPassword2: "",
            repeatedPasswordError2: false,

            deleteUser: false,
            changeUsername: false,

            username: undefined,
            new_username: undefined,
            changeUsernameError: undefined,
            changeNewUsernameError: undefined
        };
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            passwordError: "",
            repeatedPasswordError: "",
            repeatedPasswordError2: ""
        });
    }

    hideModal = () => {
        this.setState({
            changePassword: undefined
        });
        this.clearValues();
    };

    hideModalDeleteUser = () => {
        this.setState({
            deleteUser: false
        });
        this.clearValues();
    };

    hideModalChangeUsername = () => {
        this.setState({
            changeUsername: false
        });
        this.clearChangeUsernameValues();
    };

    clearValues = () => {
        this.setState({
            password: "",
            passwordError: false,

            repeatedPassword: "",
            repeatedPasswordError: false,

            repeatedPassword2: "",
            repeatedPasswordError2: false
        })
    };

    clearChangeUsernameValues = () => {
        this.setState({
            username: undefined,
            new_username: undefined,
            changeUsernameError: undefined,
            changeNewUsernameError: undefined,
            changeUsername: false
        })
    };

    handleDeleteSubmit = async event => {
        event.preventDefault();

        const status = await this.props.auth.delete(this.props.auth.sesstionEmail);
        if (status === undefined) {
            alert("Something went wrong")
        } else {
            this.setState({
                deleteUser: false,
            });
            this.props.auth.logout()
        }
    };


    handleSubmit = async event => {

        event.preventDefault();

        if (this.state.password.length < 8) {
            this.setState({
                passwordError: "Password must be at least 8 characters long"
            });
            return;
        }

        if (this.state.repeatedPassword.length < 8) {
            this.setState({
                repeatedPasswordError: "Password must be at least 8 characters long"
            });
            return;
        }

        if (this.state.repeatedPassword2.length < 8) {
            this.setState({
                repeatedPasswordError2: "Password must be at least 8 characters long"
            });
            return;
        }

        if (this.state.repeatedPassword !== this.state.repeatedPassword2) {
            this.setState({
                repeatedPasswordError: "Entered passwords do not match",
            });
            return;
        }
        if ((this.state.password === this.state.repeatedPassword)) {
            this.setState({
                passwordError: "Old password is the same as new password",
            });
            return;
        }

        var email = this.props.auth.sesstionEmail;

        const status = await this.props.auth.update(email, this.state.password, this.state.repeatedPassword);

        this.clearValues();

        if (status !== undefined) {
            this.setState({
                passwordError: "Entered credentials are invalid",

            });
        } else {
            this.setState({
                changePassword: undefined,
            });
            setTimeout(() => {
                alert("Password changed successfully")
            }, 10);
        }

    };

    handleChangeUsernameSubmit = async event => {
        event.preventDefault();

        this.setState({
            changeUsernameError: undefined,
            changeNewUsernameError: undefined
        });

        var email = this.props.auth.sesstionEmail;


        if (this.state.username !== email) {
            this.setState({
                changeUsernameError: "Wrong email",
            });
            return
        }
        if (this.state.username === undefined) {
            this.setState({
                changeUsernameError: "Please enter old email address"
            });
            return
        }
        if (this.state.new_username === undefined) {
            this.setState({
                changeNewUsernameError: "Please enter new email address"
            });
            return
        }

        const status = await this.props.auth.changeUsername(this.state.username, this.state.new_username);

        if (status !== undefined) {
            if (status === 401)
                alert("New email already exists");
            else
                alert("Something went wrong");
            this.clearChangeUsernameValues();
            return;
        }

        this.props.auth.setSessionEmail(this.state.new_username);
        this.hideModalChangeUsername();
        alert("Email changed")
    };

    render() {
        let passwordRow = (
            <tr key={"User settings"}>
                <td>Password</td>
                <td>
                    <button
                        className="edit-button"
                        onClick={() => this.setState({changePassword: true})}
                    >
                        Change password
                    </button>
                </td>
            </tr>);
        let emailRow = (
            <tr>
                <td>Email</td>
                <td>
                    <button
                        className="edit-button"
                        onClick={() => this.setState({changeUsername: true})}
                    >
                        Change email
                    </button>
                </td>
                </tr>
            );
        let userRow = (
                <tr>
                <td>User</td>
                <td>
                    <button
                        className="edit-button"
                        onClick={() => this.setState({deleteUser: true})}
                    >
                        Delete user
                    </button>
                </td>
                </tr>
        );
        return (
            <div align={"center"}>
                <AppNav />
                <h1 style={{color: "#000000", margin: 75, fontFamily: "Arial"}}>Change user settings</h1>
                <Container style={{width: 300, alignItems: 'center', justifyContent: 'center'}}>
                    <Table className="mt-4">
                        <thead>
                            <tr>
                                <th>User settings</th>
                            </tr>
                        </thead>
                        <tbody>
                        {passwordRow}
                        {emailRow}
                        {userRow}
                        </tbody>
                    </Table>
                </Container>
                <Modal
                    isOpen={this.state.changePassword !== undefined}
                    toggle={this.hideModal}
                    className={this.props.className}
                >
                    <ModalHeader>
                        Change password
                    </ModalHeader>

                    <ModalBody>
                        <Form noValidate={true} onSubmit={this.handleSubmit}>
                            {this.state.passwordError &&
                            <FormText color="danger">{this.state.passwordError}</FormText>}

                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input type="password" name="password" id="password" placeholder="Password"
                                       value={this.state.password}
                                       onChange={this.handleChange}
                                />

                            </FormGroup>

                            <FormGroup>
                                <Label for="repeatedPassword">New password</Label>
                                <Input type="password" name="repeatedPassword" id="repeatedPassword"
                                       placeholder="New password"
                                       value={this.state.repeatedPassword}
                                       onChange={this.handleChange}
                                />
                                {this.state.repeatedPasswordError &&
                                <FormText color="danger">{this.state.repeatedPasswordError}</FormText>}
                            </FormGroup>

                            <FormGroup>
                                <Label for="repeatedPassword2">Repeat new password</Label>
                                <Input type="password" name="repeatedPassword2" id="repeatedPassword2"
                                       placeholder="Repeat new password"
                                       value={this.state.repeatedPassword2}
                                       onChange={this.handleChange}
                                />
                                {this.state.repeatedPasswordError2 &&
                                <FormText color="danger">{this.state.repeatedPasswordError2}</FormText>}
                            </FormGroup>

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
                    </ModalBody>
                </Modal>
                <Modal
                    isOpen={this.state.deleteUser === true}
                    className={this.props.className}
                >
                    <ModalHeader>
                        Delete user
                    </ModalHeader>

                    <ModalBody onSubmit={this.handleDeleteSubmit}>
                        <Form>

                            <FormText color="danger">Are you sure that your want to delete your user?</FormText>
                            <FormText color="danger">It is impossible to recover your user</FormText>

                            <ModalFooter>
                                <Button color="primary" type="submit"> Delete user </Button>
                                <Button color="secondary" onClick={() => this.hideModalDeleteUser()}>
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </Form>

                    </ModalBody>
                </Modal>
                <Modal
                    isOpen={this.state.changeUsername === true}
                    className={this.props.className}
                    toggle={this.hideModalChangeUsername}
                >
                    <ModalHeader>
                        Change email address
                    </ModalHeader>

                    <ModalBody onSubmit={this.handleChangeUsernameSubmit}>

                        <Form>
                            <FormGroup>
                                {this.state.changeUsernameError &&
                                <FormText color="danger">{this.state.changeUsernameError}</FormText>}
                                <Label for="username">Old email address</Label>
                                <Input type="email" name="username" id="username" placeholder="Old email address"
                                       value={this.state.username}
                                       onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                {this.state.changeNewUsernameError &&
                                <FormText color="danger">{this.state.changeNewUsernameError}</FormText>}
                                <Label for="new_username">New email address</Label>
                                <Input type="email" name="new_username" id="new_username" placeholder="New email address"
                                       value={this.state.new_username}
                                       onChange={this.handleChange}
                                />
                            </FormGroup>
                            <ModalFooter>
                                <Button color="primary">Change email address</Button>
                                <Button color="secondary" onClick={() => this.hideModalChangeUsername()}>
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}


export default inject("auth")(observer(UserSettingsPage));

