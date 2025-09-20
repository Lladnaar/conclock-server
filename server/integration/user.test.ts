import { describe, expect, test, beforeAll } from "vitest";
import axios from "axios";
import config from "../config.ts";

const baseUrl = `http://localhost:${config.server.port}/api`;
let userUrl: string;
let loginUrl: string;

beforeAll(async () => {
    const response = await axios.get(baseUrl);
    userUrl = new URL(response.data.user.url, baseUrl).href;
});

describe("Postman user sequence test", () => {
    const user = {
        id: "USERID",
        url: "URL",
        name: "Jane",
        username: "userName",
    };

    test.sequential("POST to create", async () => {
        const response = await axios.post(userUrl, user);
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty("id");
        expect(response.data).toHaveProperty("url");
        expect(response.data).toHaveProperty("name", user.name);
        expect(response.data).toHaveProperty("username", user.username);

        user.id = response.data.id;
        user.url = response.data.url;
    });

    test.sequential("GET to check", async () => {
        const response = await axios.get(new URL(user.url, baseUrl).href);
        expect(response.status).toBe(200);
        expect(response.data).toEqual(user);
    });

    test.sequential("PUT to update", async () => {
        user.username = "jane42";

        const response = await axios.put(new URL(user.url, baseUrl).href, user);
        expect(response.status).toBe(200);
        expect(response.data).toEqual(user);
    });

    test.sequential("GET to list", async () => {
        const response = await axios.get(userUrl);
        expect(response.status).toBe(200);
        expect(response.data).toEqual(expect.arrayContaining([expect.objectContaining({ id: user.id })]));
    });

    test.sequential("DELETE to remove", async () => {
        const response = await axios.delete(new URL(user.url, baseUrl).href);
        expect(response.status).toBe(204);
    });

    test.sequential("GET to find missing", async () => {
        await expect(axios.get(new URL(user.url, baseUrl).href)).rejects.toThrowError();
    });
});

describe.todo("Standard user authorisation test", () => {
    const user = {
        id: "",
        url: "",
        name: "Jane",
        username: "userName",
    };
    let passwordUrl = "";
    const password = "correcthorsebatterystaple";

    test.sequential("POST to create", async () => {
        const response = await axios.post(userUrl, user);
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty("id");
        expect(response.data).toHaveProperty("url");
        expect(response.data).toHaveProperty("name", user.name);
        expect(response.data).toHaveProperty("username", user.username);
        expect(response.data).toHaveProperty("password");
        expect(response.data.password).toHaveProperty("url");

        user.id = response.data.id;
        user.url = response.data.url;
        passwordUrl = response.data.password.url;
    });

    test.sequential("Login declined with any password", async () => {
        await expect(axios.put(
            loginUrl, {},
            { auth: { username: user.username, password: password } },
        )).rejects.toThrowError(expect.objectContaining({ status: 401 }));
    });

    test.sequential("PUT to set password", async () => {
        const response = await axios.put(passwordUrl, password);
        expect(response.status).toBe(200);
    });

    test.sequential("Login to check password", async () => {
        const response = await axios.put(
            loginUrl, {},
            { auth: { username: user.username, password: password } },
        );
        expect(response.status).toBe(200);
        expect(response.headers).toHaveProperty("Session-Token");
    });

    test.sequential("Login declined with wrong password", async () => {
        await expect(axios.put(
            loginUrl, {},
            { auth: { username: user.username, password: "password" } },
        )).rejects.toThrowError(expect.objectContaining({ status: 401 }));
    });
});
