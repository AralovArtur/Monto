import { Client } from "../util/client";
import { action, decorate, observable } from "mobx";

export class CategoriesStore {
    categories = [];

    async load() {
        this.categories = (await Client.get("/api/categories")).json;
    }

    async update(category) {
        await Client.put(`/api/categories/${category.id}`, category );
    }

    async delete(category) {
        this.categories.splice(this.categories.indexOf(category), 1);
        await Client.delete(`/api/categories/${category.id}`);
    }

    async add(name) {
        this.categories.splice(0, 0, (await Client.post("/api/categories", { name })).json);
    }
}

decorate(CategoriesStore, {
    load: action,
    delete: action,
    categories: observable
});