import { rootStore } from "../store/RootStore";

export class Client {
  static async fetch(url, method, body) {
    const headers = new Headers({
      "Content-Type": "application/json"
    });

    if (rootStore.auth.authenticated) {
      headers.append("Authorization", "Bearer " + rootStore.auth.token);
    }
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body)
    });

    let json;

    try {
      json = await response.json();
    } catch (e) {
      // ignore
    }

    return { status: response.status, json };
  }

  static async get(url, body) {
    return Client.fetch(url, "GET", body);
  }

  static async post(url, body) {
    return Client.fetch(url, "POST", body);
  }

  static async delete(url, body) {
    return Client.fetch(url, "DELETE", body);
  }

  static async put(url, body) {
    return Client.fetch(url, "PUT", body);
  }
}
