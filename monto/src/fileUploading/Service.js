import axios from "axios";
import { rootStore } from "../store/RootStore";
class Service {
  constructor() {
    console.log("Service is constructed");
  }

  getRestClient() {
    if (!this.serviceInstance) {
      this.serviceInstance = axios.create({
        baseURL: "https://montoapp.herokuapp.com/",
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + rootStore.auth.token
        }
      });
    }
    return this.serviceInstance;
  }
}

export default new Service();
