import express from "express";
import * as data from "../data/redis.ts";

// REST router

const router = express.Router();
router.get("/", getUserAll);
router.get("/:id", getUser);
router.post("/", postUser);
router.put("/:id", putUser);
router.delete("/:id", deleteUser);
export default router;

// User resource

type RestUser = {
    id?: string;
    username?: string;
    password?: string;
    name?: string;
    url?: string;
};

class User {
    id?: string;
    username?: string;
    password?: string;
    name?: string;

    static fromBody(body: RestUser) {
        const user = new User();
        user.username = body.username ?? "";
        user.password = body.password ?? "";
        user.name = body.name ?? "";
        return user;
    }

    static fromId(id: string, body: RestUser = {}) {
        const user = User.fromBody(body);
        user.id = id;
        return user;
    }

    static async getAll() {
        const ids = await data.list("user");
        return ids.map(id => User.fromId(id));
    }

    async save() {
        if (this.id)
            await data.set("user", this.id, this.toData());
        else
            this.id = await data.add("user", this.toData());
        return this;
    }

    async load() {
        const content = await data.get("user", this.id!);
        this.username = content?.username;
        this.password = content?.password;
        this.name = content?.name;
        return this;
    }

    async delete() {
        await data.del("user", this.id!);
        return undefined;
    }

    toData() {
        return {
            username: this.username,
            password: this.password,
            name: this.name,
        };
    }

    toRest(baseUrl: string): RestUser {
        return {...this, url: `${baseUrl}/${this.id}`};
    }
}

// REST verb definitions

async function postUser(req: express.Request, res: express.Response) {
    try {
        const user = await User.fromBody(req.body).save();
        res.status(201).send(user.toRest(req.baseUrl));
        console.debug(`Added user:${user.id}`);
    }
    catch (error: unknown) {
        res.status(500).send(formatError("POST", error));
    }
}

async function getUserAll(req: express.Request, res: express.Response) {
    try {
        const users = await User.getAll();
        res.status(200).send(users.map(user => user.toRest(req.baseUrl)));
        console.debug("Retrieved user:*");
    }
    catch (error: unknown) {
        res.status(500).send(formatError("GET", error));
    }
}

async function getUser(req: express.Request, res: express.Response) {
    try {
        const user = await User.fromId(req.params.id!).load();
        res.status(200).send(user.toRest(req.baseUrl));
        console.debug(`Retrieved user:${user.id}`);
    }
    catch (error: unknown) {
        if (error instanceof data.NotFoundError) {
            res.status(404).send({error: error.message});
            console.debug(error.message);
        }
        else {
            res.status(500).send(formatError("GET", error));
        }
    }
}

async function putUser(req: express.Request, res: express.Response) {
    try {
        const user = await User.fromId(req.params.id!, req.body).save();
        res.status(201).send(user.toRest(req.baseUrl));
        console.debug(`Updated user:${user.id}`);
    }
    catch (error: unknown) {
        res.status(500).send(formatError("PUT", error));
    }
}

async function deleteUser(req: express.Request, res: express.Response) {
    try {
        await User.fromId(req.params.id!).delete();
        res.status(204).send();
        console.debug(`Deleted user:${req.params.id}`);
    }
    catch (error: unknown) {
        res.status(500).send(formatError("DELETE", error));
    }
}

function formatError(verb: string, error: unknown) {
    console.error(error);
    if (error instanceof Error)
        return {error: `Unexpected ${verb} error: ${error?.message}`};
    else
        return {error: "Unknown ${verb} error"};
}
