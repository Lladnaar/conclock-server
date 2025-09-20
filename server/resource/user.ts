import express from "express";
import type {ResourceId, ResourceContent} from "./resource.ts";
import {ResourceFactory, InvalidResourceError} from "./resource.ts";
import {Rest} from "./rest.ts";
import bcrypt from "bcrypt";
import * as data from "../data/redis.ts";

// Types

export type UserContent = ResourceContent & {
    username: string;
    password: string | undefined;
};

export type User = ResourceId & UserContent;

// Factory

export class UserFactory extends ResourceFactory {
    constructor() { super("user"); }

    newContent(content: object): UserContent {
        if (!this.isValid(content)) throw new InvalidResourceError("Invalid user");

        return {
            ...super.newContent(content),
            username: content.username,
            password: content.password,
        };
    }

    isValid(item: object): item is UserContent {
        let validity = super.isValid(item);
        validity &&= "username" in item && typeof item.username === "string";
        validity &&= !("password" in item) || ("password" in item && (typeof item.password === "string" || typeof item.password == "undefined"));
        return validity;
    }

    async save(id: string, user: {password: string | undefined}) {
        if (typeof user.password === "string")
            user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());
        else {
            const existingUser = await data.get(this.type, id);
            user.password = existingUser.password;
        }
        return super.save(id, user);
    }

    async setPassword(user: ResourceId, password: string): Promise<void> {
        const hash = await bcrypt.hash(password, await bcrypt.genSalt());
        await data.update(this.type, user.id, {password: hash});
    }

    async checkPassword(user: ResourceId, password: string): Promise<boolean> {
        const userData = await data.get(this.type, user.id);
        if ("password" in userData && typeof userData.password === "string")
            return bcrypt.compare(password, userData.password);
        else
            return false;
    }

    async unsetPassword(user: ResourceId): Promise<void> {
        await data.update(this.type, user.id, {password: undefined});
    }
}

// Router

const userRest = new Rest(new UserFactory());

const router = express.Router();
router.get("/", userRest.getAll.bind(userRest));
router.get("/:id", userRest.get.bind(userRest));
router.post("/", userRest.post.bind(userRest));
router.put("/:id", userRest.put.bind(userRest));
router.delete("/:id", userRest.delete.bind(userRest));
export default router;
