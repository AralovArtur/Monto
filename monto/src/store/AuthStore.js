import {action, computed, decorate, observable, reaction} from "mobx";
import {Client} from "../util/client";

const TOKEN = "authenticationToken";

export class AuthStore {
    token;

    constructor() {
        this.token = sessionStorage.getItem(TOKEN);

        reaction(() => this.token, () => {
            if (this.token === null) {
                sessionStorage.removeItem(TOKEN);
            } else {
                sessionStorage.setItem(TOKEN, this.token);
            }
        });
    }

    get authenticated() {
        return this.token !== null;
    }

    async login(email, password) {
        const {status, json} = await Client.post("/api/auth/login", {email, password});

        if (status === 200) {
            this.token = json.token;
            sessionStorage.setItem("user", email)
        } else {
            return status;
        }
    }

    async register(email, password) {
        const {status, json} = await Client.post("/api/auth/register", {email, password});

        if (status === 200) {
            this.token = json.token;
            sessionStorage.setItem("user", email)
        } else {
            return status;
        }
    }

    logout = async () => {
        this.token = null;
        sessionStorage.removeItem("user")
    };

    async delete(email) {
        const a = await Client.post("/api/users/email", {email});
        const status = await Client.delete(`/api/users/delete/${a.json}`, {email});
        if (status === 200) {
        } else {
            return status;
        }


    }
    async changeUsername(email, newEmail) {
        const {id} = await Client.post("/api/users/email", {email});

        const {status} = await Client.put(`/api/users/updateUsername/${id}`, {email, newEmail});

        if (status === 200) {
        } else {
            return status;
        }
    }


        async update(email, oldPassword, newPassword) {
        const {id} = await Client.post("/api/users/email", {email});

        const {status} = await Client.put(`/api/users/update/${id}`, {email, oldPassword, newPassword});
        if (status === 200) {
        } else {
            return status;
        }
    }

    get sesstionEmail() {
        return sessionStorage.getItem("user")
    }

    setSessionEmail(email) {
        sessionStorage.setItem("user", email)
    }

}

decorate(AuthStore, {
    token: observable,
    authenticated: computed,
    login: action,
    logout: action,
    update: action
});