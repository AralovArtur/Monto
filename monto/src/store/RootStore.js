import { AuthStore } from "./AuthStore";
import { TransactionsStore } from "./TransactionsStore";
import { CategoriesStore } from "./CategoriesStore";
import { AccountsStore } from "./AccountsStore";
import {RegrulesStore} from "./RegrulesStore";

export class RootStore {
  constructor() {
    this.auth = new AuthStore();
    this.transactions = new TransactionsStore();
    this.categories = new CategoriesStore();
    this.accounts = new AccountsStore();
    this.regrules = new RegrulesStore();
  }
}

export const rootStore = new RootStore();