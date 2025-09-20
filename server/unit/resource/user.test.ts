import { describe, expect, test, beforeAll } from "vitest";
import type {User} from "../../resource/user.ts";
import {UserFactory} from "../../resource/user.ts";

const userFactory = new UserFactory();

beforeAll(async () => {
    console.log("Starting tests");
});

describe("Password tests", () => {
    const password = "correcthorsebatterystaple";
    let user: User;

    test.sequential("Create user", async () => {
        user = await userFactory.create(userFactory.newContent({
            name: "Jane",
            username: "userName",
        })) as User;
        expect(user).toBeTypeOf("object");
    });

    test.sequential("Blocked login before password set", async () => {
        const validPassword = await userFactory.checkPassword(user, password);
        expect(validPassword).toBeFalsy();
    });

    test.sequential("Set password", async () => {
        expect(await userFactory.setPassword(user, password)).toBeUndefined();
    });

    test.sequential("Successful login 1", async () => {
        const validPassword = await userFactory.checkPassword(user, password);
        expect(validPassword).toBeTruthy();
    });

    test.sequential("Unsuccessful login", async () => {
        const validPassword = await userFactory.checkPassword(user, "password");
        expect(validPassword).toBeFalsy();
    });

    test.sequential("Update user", async () => {
        user = await userFactory.save(user.id, user) as User;
        expect(user).toBeTypeOf("object");
    });

    test.sequential("Successful login 2", async () => {
        const validPassword = await userFactory.checkPassword(user, password);
        expect(validPassword).toBeTruthy();
    });

    test.sequential("Unset password", async () => {
        expect(await userFactory.unsetPassword(user)).toBeUndefined();
    });

    test.sequential("Blocked login after password unset", async () => {
        const validPassword = await userFactory.checkPassword(user, password);
        expect(validPassword).toBeFalsy();
    });
});
