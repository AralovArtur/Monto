import * as React from "react";

import { Card, Grid, Page, StatsCard, Table } from "tabler-react";
import "tabler-react/dist/Tabler.css";

import C3Chart from "react-c3js";
import 'c3/c3.css';

import AppNav from "../AppNav";
import { inject, observer } from "mobx-react";
import CardBody from "reactstrap/es/CardBody";

const toPrettyNumber = number => {
  const negative = number < 0;
  number = Math.abs(number);

  if (number < 1) {
    return (negative ? "-" : "") + number.toFixed(2) + "€";
  }

  const exponent = Math.floor(number).toString().length;
  const mantissa = Math.round(number / Math.pow(10, exponent - 3)).toString();

  let fraction = exponent % 3 === 0 ? mantissa : mantissa.slice(0, exponent % 3) + "," + mantissa.slice(exponent % 3);

  let suffix;

  if (exponent <= 3) {
    suffix = "";
  } else if (3 < exponent && exponent <= 6) {
    suffix = "k";
  } else if (6 < exponent && exponent <= 9) {
    suffix = "m";
  } else if (9 < exponent && exponent <= 12) {
    suffix = "b";
  } else {
    fraction = "XXX";
    suffix = "";
  }

  return (negative ? "-" : "") + fraction + suffix + "€";
};

class Dashboard extends React.Component {
  componentDidMount() {
    this.props.transactions.load();
    this.props.categories.load();
    this.props.accounts.load();

  }

  render() {
    const {transactions} = this.props.transactions;

    if (transactions === undefined) {
      return <AppNav/>; // Transactions are still being loaded
    }

    const incomeSum = transactions.reduce((sum, transaction) => sum + (transaction.sum > 0 ? transaction.sum : 0), 0);
    const expenseSum = transactions.reduce((sum, transaction) => sum + (transaction.sum < 0 ? -transaction.sum : 0), 0);

    const names = [];
    for (const name of this.props.categories.categories)
      names.push(name);
    const categoriesNumber = this.props.categories.categories.length;
    const accountsNumber = this.props.accounts.accounts.length;
    const categories = this.props.transactions.transactions.map(transaction => transaction.category).filter(category => category)
    const counter = categories.reduce((counter, category) => {
      if (!(category.name in counter)) {
        counter[category.name] = 0
      }
      counter[category.name] += 1
      return counter;
    }, {});
    const sorted = Object.entries(counter).sort((entry, other) => other[1] - entry[1]);
    const topThreeCategoryNames = sorted.map(entry => entry[0]).slice(0, 3);
    const topTenCategories = sorted.map(entry => entry[0].slice(0,10));

    const accounts = this.props.transactions.transactions.map(transaction => transaction.account).filter(account => account)
    const accountCounter = accounts.reduce((accountCounter, account) => {
      if (!(account.name in accountCounter)) {
        accountCounter[account.name] = 0
      }
      accountCounter[account.name] += 1
      return accountCounter;
    }, {});
    const sortedAccounts = Object.entries(accountCounter).sort((entry, other) => other[1] - entry[1]);
    const topTenAccounts = sortedAccounts.map(entry => entry[0].slice(0,10));

    return (
      <>
        <AppNav/>
        <Page.Content title="Dashboard">
          <Grid.Row cards>
            <Grid.Col width={4}>
              <StatsCard layout={1} movement={0} total={toPrettyNumber(incomeSum)} label="Monthly income"/>
            </Grid.Col>
            <Grid.Col width={4}>
              <StatsCard layout={1} movement={0} total={toPrettyNumber(expenseSum)} label="Monthly expenses"/>
            </Grid.Col>
            <Grid.Col width={4}>
              <StatsCard layout={1} movement={0} total={toPrettyNumber(incomeSum - expenseSum)}
                         label="Monthly savings"/>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row>
            <Grid.Col width={4}>
              <StatsCard layout={1} movement={0} total={categoriesNumber} label="Number of categories"/>
            </Grid.Col>
            <Grid.Col width={4}>
              <StatsCard layout={1} movement={0} total={incomeSum === 0 ? 0 : Math.round((incomeSum - expenseSum) / incomeSum * 100) + "%"} label="Saving proportion"/>
            </Grid.Col>
            <Grid.Col width={4}>
              <StatsCard layout={1} movement={0} total={accountsNumber} label="Number of accounts"/>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row cards>
            <Grid.Col width={18} sm={4} lg={6}>
              <Card>
                <Card.Header>
                  <Card.Title>Top 3 categories</Card.Title>
                </Card.Header>
                  <CardBody> {topThreeCategoryNames.toString()} </CardBody>
              </Card>
            </Grid.Col>

            <Grid.Col width={18} sm={4} lg={6}>
              <Card>
                <Card.Header>
                  <Card.Title>Incomes and Expenses</Card.Title>
                </Card.Header>
                <Card.Body>
                  <C3Chart
                    style={{height: "16rem"}}
                    data={{
                      columns: [
                        ["data1", incomeSum],
                        ["data2", expenseSum],
                      ],
                      type: "donut",
                      colors: {
                        data1: "#00DC6E",
                        data2: "#c82333"
                      },
                      names: {
                        data1: "Incomes",
                        data2: "Expenses",
                      },
                    }}
                    legend={{
                      show: false
                    }}
                    padding={{
                      bottom: 0,
                      top: 0,
                    }}
                  />
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row>
            <Grid.Col lg={12}>
              <Card>
                <Card.Header>
                  <Card.Title>Accounts</Card.Title>
                </Card.Header>
                <Table>
                  <Table.Header>
                    <Table.ColHeader>Name</Table.ColHeader>
                  </Table.Header>
                  <Table.Body>
                      {topTenAccounts.map(account => <Table.Row key={account}><Table.Col>{account}</Table.Col></Table.Row>)}
                  </Table.Body>
                </Table>
              </Card>
              <Card>
                <Card.Header>
                  <Card.Title>Categories</Card.Title>
                </Card.Header>
                <Table>
                  <Table.Header>
                    <Table.ColHeader>Name</Table.ColHeader>
                  </Table.Header>
                    <Table.Body>
                      {topTenCategories.map(category => <Table.Row key={category}><Table.Col>{category}</Table.Col></Table.Row>)}
                  </Table.Body>
                </Table>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Page.Content>
      </>
    );
  }
}

export default inject("transactions", "categories", "accounts")(observer(Dashboard));