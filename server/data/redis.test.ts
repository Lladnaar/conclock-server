import { describe, expect, test, jest } from "@jest/globals";
import { createClient, RedisClientType } from "redis";

jest.mock("redis", () => ({
    createClient: jest.fn().mockImplementation(() => mockClient),
}));

type MockClientType = jest.Mocked<RedisClientType>;
const mockClient: MockClientType = new MockClientType();
mockClient.on.mockReturnThis();

jest.mock("uuid", () => ({
    v7: jest.fn().mockReturnValue("456"),
}));

import * as data from "./redis";

describe("Redis", () => {
    test("Missing key", () => {
        return expect(data.exists("test", "123")).resolves.toBeFalsy();
    });
    test("Insert key", () => {
        const test = { one:1 };
        return expect(data.add("test", test)).resolves.toEqual("456");
    });
    test("Valid key", () => {
        const test = { one:1 };
        mockClient.get.mockResolvedValue("{ 'one':1 }");
        return expect(data.get("test", "456")).resolves.toEqual(test);
    });
});
