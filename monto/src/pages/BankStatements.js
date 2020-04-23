import React, { Component } from "react";
import AppNav from "../AppNav";
import {Button, Container, Table} from "reactstrap";
import { inject, observer } from "mobx-react";
import { Client } from "../util/client";
import Transactions from "./Transactions";

class BankStatements extends Component {
  cellsTypes = [];
  processedBankStatements = [];

  state = {
    statementValuesAreSelected: false,
    statementTypesAreSelected: false,
    accountsSelected: false
  };

  componentDidMount() {
    this.props.accounts.load();
  }

  handleSelectedValueChange = event => {
    this.cellsTypes[event.target.id] = event.target.value;
  };

  handleBankStatementTypeChange = event => {
    this.processedBankStatements[event.target.id][
      this.processedBankStatements[event.target.id].length - 1
    ] = event.target.value;
  };

  handleSelectedAccountChange = event => {
    this.processedBankStatements[this.processedBankStatements.length - 1] = [
      event.target.value
    ];
  };

  getCellType(initialCellType) {
    if (initialCellType === "Kuupäev" || initialCellType === "Date") {
      return "Date";
    } else if (initialCellType === "Saaja/Maksja" || initialCellType === "Beneficiary/Payer") {
      return "Category";
    } else if (initialCellType === "Selgitus" || initialCellType === "Details") {
      return "Description";
    } else if (initialCellType === "Summa" || initialCellType === "Amount") {
      return "Sum";
    } else {
      return "Type not specified";
    }
  }

  checkIfDuplicateExists(values) {
    return new Set(values).size !== values.length;
  }

  controlTypesSubmit = event => {
    if (
      !(
        this.cellsTypes.includes("Date") &&
        this.cellsTypes.includes("Description") &&
        this.cellsTypes.includes("Sum") &&
        this.cellsTypes.includes("Category")
      )
    ) {
      alert(
        "All types should be specified (Date, Category, Description, Sum)!"
      );
    } else if (
      this.checkIfDuplicateExists(
        this.cellsTypes.filter(value => {
          return value !== "Type not specified";
        })
      )
    ) {
      alert("Duplicate types are not allowed!");
    } else {
      this.setState({ statementValuesAreSelected: true });
    }
  };

  controlSubmitBankStatements = event => {
    this.setState({ statementTypesAreSelected: true });
  };

  controlSaveBankStatements = event => {
    this.saveBankStatements(this.processedBankStatements);
    this.loadBankStatements();
    this.setState({ accountsSelected: true });
  };

  async saveBankStatements() {
    await Client.post(`/api/bankStatements`, this.processedBankStatements);
  }

  async loadBankStatements() {
    await Client.get("/api/transactions").json;
  }

  render() {
    if (this.state.accountsSelected) {
      return <Transactions />;
    }
    if (this.state.statementTypesAreSelected) {
      let accountName = "";
      try {
        accountName = this.props.accounts.accounts[0].name;
      }
      catch (e) {
        alert("This user has no accounts!");
      }
      this.processedBankStatements.push([accountName]);
      const accountList = this.props.accounts.accounts.map(account => (
        <option value={account.name} key={account.id}>
          {account.name}
        </option>
      ));
      const selectList = (
        <tr>
          <td>
            <select
              id={accountList}
              onChange={this.handleSelectedAccountChange}
              defaultValue={-1}
              className="form-control"
            >
              {accountList}
            </select>
          </td>
        </tr>
      );
      return (
        <div>
          <AppNav />
          <Container style={{width: 400, alignItems: 'center', justifyContent: 'center'}}>
            <h1 style={{color: "#000000", margin: 75, fontFamily: "Arial", fontSize: 30 }}>Choose account</h1>
          <Table className="mt-4">
            <thead>
              <tr>
                <th>Accounts</th>
              </tr>
            </thead>
            <tbody>{selectList}</tbody>
          </Table>
          <div align={"center"}>
            <Button
              color="success"
              size="sm"
              icon="plus"
              onClick={this.controlSaveBankStatements}
            >
              Save
            </Button>
          </div>
          </Container>
        </div>
      );
    }

    if (this.state.statementValuesAreSelected) {
      let rows = [];
      let processedBankStatements = [];
      const bankStatements = this.props.bankStatements;
      const numberOfStatements = bankStatements.length;

      const cellsTypes = this.cellsTypes;
      const dateIndex = cellsTypes.indexOf("Date");
      const categoryIndex = cellsTypes.indexOf("Category");
      const descriptionIndex = cellsTypes.indexOf("Description");
      const sumIndex = cellsTypes.indexOf("Sum");

      const bankStatementTypes = [
        "Expense", "Income"
      ].map(type => (
          <option value={type} key={type}>
            {type}
          </option>));

      for (let i = 0; i < numberOfStatements; i++) {
        const bankStatement = bankStatements[i];
        const bankStatementValues = Object.values(bankStatement);
        let processedBankStatement = [];
        processedBankStatement.push(bankStatementValues[dateIndex]);
        processedBankStatement.push(bankStatementValues[categoryIndex]);
        processedBankStatement.push(bankStatementValues[descriptionIndex]);
        processedBankStatement.push(bankStatementValues[sumIndex]);
        if (bankStatement["Transaction type"] === "K" || bankStatement["Tehingu tüüp"] === "K" || bankStatementValues[sumIndex] < 0) {
          processedBankStatement.push("Expense");
        }
        else {
          processedBankStatement.push("Income");
        }
        processedBankStatements.push(processedBankStatement);
        let values = [];
        for (let j = 0; j < processedBankStatement.length; j++) {
          const value = processedBankStatement[j];
          if (value !== "Income" && value !== "Expense") {
            values.push(<td key={j + value}>{value}</td>)
          }
        }
        rows.push(
          <tr key={i}>
            {values}
            <td>
              <select
                id={i}
                onChange={this.handleBankStatementTypeChange}
                defaultValue={processedBankStatement[processedBankStatement.length - 1]}
                className={"form-control"}
              >
                {bankStatementTypes}
              </select>
            </td>
          </tr>
        );
      }
      this.processedBankStatements = processedBankStatements;
      return (
        <div>
          <AppNav />
          <Container style={{alignItems: 'center', justifyContent: 'center'}}>
            <h1 style={{color: "#000000", margin: 75, fontFamily: "Arial"}}>Choose type of bankstatement values</h1>
          <Table className="mt-4" key="Bank statements">
            <thead>
              <tr>
                <th>Bank statements</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </Table>
          </Container>
          <div align={"center"}>
            <Button
                color="success"
                size="sm"
                icon="plus"
                onClick={this.controlSubmitBankStatements}
            >
              Submit
            </Button>
          </div>
        </div>
      );
    }

    const cellTypes = [
      "Date",
      "Description",
      "Sum",
      "Category",
      "Type not specified"
    ].map(type => (
      <option value={type} key={type}>
        {type}
      </option>
    ));

    let rows = [];

    if (this.props.fileFormat === "CSV") {
      const bankStatement = this.props.bankStatements[0];
      const cellsKeys = Object.keys(bankStatement);
      const cellsValues = Object.values(bankStatement);
      const numberOfCells = cellsValues.length;

      for (let i = 0; i < numberOfCells; i++) {
        const cellValue = cellsValues[i];
        const cellType = this.getCellType(cellsKeys[i]);
        cellsKeys[i] = cellType;
        if (cellValue !== "") {
          rows.push(
            <tr key={i}>
              <td>{cellValue}</td>
              <td>
                <select
                  id={i}
                  onChange={this.handleSelectedValueChange}
                  defaultValue={cellType}
                  className="form-control"
                >
                  {cellTypes}
                </select>
              </td>
            </tr>
          );
        }
      }
      this.cellsTypes = cellsKeys;
    }

    if (this.props.fileFormat === "XLS") {
      const bankStatement = this.props.bankStatements[0];
      const cellsKeys = [];
      const cellsValues = Object.values(bankStatement);
      const numberOfCells = cellsValues.length;
      for (let i = 0; i < numberOfCells; i++) {
        cellsKeys.push("Type not specified");
        const cellValue = cellsValues[i];
        if (cellValue !== "") {
          rows.push(
              <tr key={i}>
                <td>{cellValue}</td>
                <td>
                  <select
                      id={i}
                      onChange={this.handleSelectedValueChange}
                      defaultValue="Type not specified"
                      className="form-control"
                  >
                    {cellTypes}
                  </select>
                </td>
              </tr>
          );
        }
      }
      this.cellsTypes = cellsKeys;
    }

    return (
      <div>
        <AppNav />
        <Container style={{alignItems: 'center', justifyContent: 'center'}}>
        <h1 style={{color: "#000000", margin: 75, fontFamily: "Arial"}}>Choose type of bankstatement values</h1>
        <Table className="mt-4" key="Statement values">
          <thead>
            <tr>
              <th>Statement values</th>
              <th>Value type</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </Table>
        </Container>
        <div align={"center"}>
          <Button
              color="success"
              size="sm"
              icon="plus"
              onClick={this.controlTypesSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    );
  }
}

export default inject("accounts")(observer(BankStatements));
