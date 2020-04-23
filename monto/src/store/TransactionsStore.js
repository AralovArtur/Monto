import { Client } from "../util/client";
import { action, decorate, observable } from "mobx";

export class TransactionsStore {
  transactions = undefined;

  async load() {
    this.transactions = (await Client.get("/api/transactions")).json;
  }

  async update(transaction) {
    await Client.put(`/api/transactions/${transaction.id}`, transaction );
  }

  async delete(transaction) {
    this.transactions.splice(this.transactions.indexOf(transaction), 1);
    await Client.delete(`/api/transactions/${transaction.id}`);
  }

  async add(description, date, sum, category, account) {
    this.transactions.splice(0, 0, (await Client.post("/api/transactions", { description, date, sum, category, account })).json);
  }
}

decorate(TransactionsStore, {
  load: action,
  delete: action,
  transactions: observable
});