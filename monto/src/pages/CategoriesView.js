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
import RegrulesView from "./RegrulesView";

class CategoriesView extends Component {
  values = {
    id: 105,
    name: ""
  };

  addingCategory = false;
  isEditing = false;
  editableCategory = null;

  constructor(props) {
    super(props);

    this.state = {
      regrulesEdit: false
    };
    this.editRegrules = this.editRegrules.bind(this);
  }

  componentDidMount() {
    this.props.categories.load();
  }

  handleSubmit = async event => {
    event.preventDefault();
    await this.props.categories.add(
        this.values.name
    );
    await this.componentDidMount();
    this.hideModal();
  };

  handleUpdate = async event => {
    event.preventDefault();

    this.editableCategory.name = this.values.name;

    await this.props.categories.update(this.editableCategory);
    this.hideModal();
  };

  handleChange = event => {
    this.values[event.target.name] = event.target.value;
  };

  hideModal = () => {
    this.addingCategory = false;
    this.isEditing = false;

    this.values.name = "";
  };

  editRegrules() {
    this.setState({ regrulesEdit: !this.state.regrulesEdit });
  }

  render() {
    if (this.props.categories.categories === undefined) {
      return <AppNav></AppNav>;
    }

    if (this.state.regrulesEdit) {
      return (
          <div>
            <RegrulesView editRegrules={this.editRegrules} />
          </div>
      );
    }

    let rows = this.props.categories.categories.map(category => (
      <tr key={category.id}>
        <td>{category.name}</td>
        <td>
          <button
            className="delete-button"
            onClick={() => this.props.categories.delete(category)}
          >
            Delete
          </button>
        </td>
        <td>
          <button
              className="edit-button"
              size="sm"
              onClick={() => {
                this.editableCategory = category;
                this.isEditing = true;
                this.values.name = this.editableCategory.name;
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
        <h1 style={{color: "#000000", margin: 75, fontFamily: "Arial"}}>Add new categories</h1>
        <Container style={{width: 400, alignItems: 'center', justifyContent: 'center', margin: 75}}>
            <div style={{ display: "flex", float: "left" }}>
              <Button
                  color="success"
                  size="sm"
                  icon="plus"
                  onClick={() => (this.addingCategory = true)}
              >
                Add category
              </Button>
              </div>
              <div style={{ display: "flex" }}>
              <Button
                  style={{ marginLeft: "auto", float: "right" }}
                  size="sm"
                  onClick={() => this.editRegrules()}
              >
                Edit rules
              </Button>
              </div>
          <Table className="mt-4">
            <thead>
              <tr>
                <th>Category</th>
                <th width="10%"></th>
                <th width="10%"></th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
          <Modal
              isOpen={this.addingCategory || this.isEditing}
              className={this.props.className}
          >
            <Form onSubmit={this.isEditing ? this.handleUpdate : this.handleSubmit} noValidate>
              <ModalHeader>
                {this.isEditing ? "Add new category" : "Edit the category"}
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
                onClick={this.props.editCategories}
            >
              Go back
            </Button>
          </div>
        </Container>
      </div>
    );
  }
}

decorate(CategoriesView, {
  addingCategory: observable,
  isEditing: observable,
  values: observable
});

export default inject("categories")(
    observer(CategoriesView)
);