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

class RegrulesView extends Component {
    values = {
        id: 105,
        reg: "",
        category: null
    };

    addingRegrule = false;
    isEditing = false;
    editableRegrule = null;

    componentDidMount() {
        this.props.regrules.load();
        this.props.categories.load();
        // console.log(this.props.regrules.regrules)
        // console.log(this.props.regrules)
    }

    handleSubmit = async event => {
        event.preventDefault();
        await this.props.regrules.add(
            this.values.reg,
            this.values.category
        );
        this.hideModal();
    };

    handleUpdate = async event => {
        event.preventDefault();

        this.editableRegrule.reg = this.values.reg;
        this.editableRegrule.category = this.values.category;

        await this.props.regrules.update(this.editableRegrule);
        this.hideModal();
    };

    handleChange = event => {
        this.values[event.target.name] = event.target.value;
    };

    handleCategoryChange = event => {
        this.values.category = this.props.categories.categories[event.target.value];
    };

    hideModal = () => {
        this.addingRegrule = false;
        this.isEditing = false;

        this.values.reg = "";
        this.values.category = null;
    };

    render() {
        if (this.props.regrules.regrules === undefined) {
            return <AppNav></AppNav>;
        }

        let categoryList = this.props.categories.categories.map(category => (
            <option
                value={this.props.categories.categories.indexOf(category)}
                key={category.id}
            >
                {category.name}
            </option>
        ));

        let rows = this.props.regrules.regrules.map(regrule => (
            <tr key={regrule.id}>
                <td>{regrule.reg}</td>
                <td>{regrule.category
                    ? regrule.category.name
                    : "No category"}</td>
                <td>
                    <button className="delete-button"
                        onClick={() => this.props.regrules.delete(regrule)}
                    >
                        Delete
                    </button>
                </td>
                <td>
                    <button
                        className="edit-button"
                        onClick={() => {
                            this.editableRegrule = regrule;
                            this.isEditing = true;
                            this.values.reg = this.editableRegrule.reg;
                            this.values.category = this.editableRegrule.category;
                        }}
                    >
                        Edit
                    </button>
                </td>
            </tr>
        ));

        return (
            <div align={"center"}>
                <AppNav />
                <h1 style={{color: "#000000", margin: 75, fontFamily: "Arial"}}>Add new regular rules</h1>
                <Container style={{width: 800, alignItems: 'center', justifyContent: 'center', margin: 75}}>
                    <div>
                        <div>
                            <Button
                                color="success"
                                size="sm"
                                icon="plus"
                                onClick={() => (this.addingRegrule = true)}
                            >
                                Add rule
                            </Button>
                        </div>
                    </div>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th> Regrule</th>
                            <th> Category</th>
                            <th width="10%"></th>
                            <th width="10%"></th>
                        </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </Table>
                    <Modal
                        isOpen={this.addingRegrule || this.isEditing}
                        toggle={this.hideModal}
                        className={this.props.className}
                    >
                        <Form onSubmit={this.isEditing ? this.handleUpdate : this.handleSubmit} noValidate>
                            <ModalHeader>
                                {this.isEditing ? "Add new regrule" : "Edit the regrule"}
                            </ModalHeader>
                            <ModalBody>
                                <FormGroup>
                                    <Label for="reg">Name</Label>
                                    <Input
                                        type="text"
                                        name="reg"
                                        id="reg"
                                        value={this.values.reg}
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="category">Category</Label>
                                    <div className="select-row">
                                        <select
                                            onChange={this.handleCategoryChange}
                                            className="form-control"
                                        >
                                            <option selected value={-1}>
                                                No category
                                            </option>
                                            {categoryList}
                                        </select>
                                    </div>
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
                    <div>
                        <Button
                            color="success"
                            size="sm"
                            icon="plus"
                            onClick={this.props.editRegrules}
                        >
                            Go back
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }
}

decorate(RegrulesView, {
    addingRegrule: observable,
    isEditing: observable,
    values: observable
});

export default inject("regrules", "categories")(
    observer(RegrulesView)
);