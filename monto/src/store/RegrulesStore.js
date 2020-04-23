import { Client } from "../util/client";
import { action, decorate, observable } from "mobx";

export class RegrulesStore {
    regrules = [];

    async load() {
        this.regrules = (await Client.get("/api/regrules")).json;
    }

    async update(regrule) {
        await Client.put(`/api/regrules/${regrule.id}`, regrule );
    }

    async delete(regrule) {
        this.regrules.splice(this.regrules.indexOf(regrule), 1);
        await Client.delete(`/api/regrules/${regrule.id}`);
    }

    async add(reg, category) {
        this.regrules.splice(0, 0, (await Client.post("/api/regrules",
            { reg, category })).json);
    }
}

decorate(RegrulesStore, {
    load: action,
    delete: action,
    regrules: observable
});