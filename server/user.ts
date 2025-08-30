// user resource definition

import express from "express";
import * as data from "./data/redis.ts";

const router = express.Router();

class User {
    id?: string;
    username: string;
    password: string;
    name: string;
    
    static fromBody(body: any) {
        let user = new User();
        user.username = body.username;
        user.password = body.password;
        user.name = body.name;
        return user;
    }

    static fromId(id: string, body = {}) {
        let user = User.fromBody(body);
        user.id = id;
        return user;
    }

    static async getAll() {
        let ids = await data.list("user");
        return ids.map(id => User.fromId(id))
    }

    async save() {
        if (this.id)
            await data.set("user", this.id, this.toData());
        else
            this.id = await data.add("user", this.toData());
        return this;
    }

    async load() {
        let content = await data.get("user", this.id!);
        this.username = content?.username;
        this.password = content?.password;
        this.name = content?.name;
        return this;
    }

    async delete() {
        await data.del("user", this.id!);
        this.id = undefined;
        return this;
    }

    toData() {
        return {
            username: this.username,
            password: this.password,
            name: this.name
        };
    }

    toObject() {
        return {...this, url: "/api/user/" + this.id};
    }
}

// Resource and verb definitions 

router.post("/", async (req: express.Request, res: express.Response) => {
    try {
        let user = await User.fromBody(req.body).save();
        res.status(201).send(user.toObject());
        console.debug(`User ${user.id} added`);
    }
    catch (e: any) {
        console.error(e);
        res.status(500).send({error:"Unexpected add error"});
    }
});

router.get("/", async (req: express.Request, res: express.Response) => {
    try {
        let users = await User.getAll();
        res.status(200).send(users.map(user => user.toObject()));
        console.debug(`User list retrieved`);
    }
    catch (e: any) {
        console.error(e);
        res.status(500).send({error:"Unexpected fetch error"});
    }
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
    try {
        let user = await User.fromId(req.params.id).load();
        res.status(200).send(user.toObject());
        console.debug(`User ${user.id} retrieved`);
    }
    catch (e: any) {
        console.error(e);
        res.status(500).send({error:"Unexpected fetch error"});
    }
});

router.put("/:id", async (req: express.Request, res: express.Response) => {
    try {
        let user = await User.fromId(req.params.id, req.body).save();
        res.status(201).send(user.toObject());
        console.debug(`User ${user.id} updated`);
    }
    catch (e: any) {
        console.error(e);
        res.status(500).send({error:"Unexpected update error"});
    }
});

router.delete("/:id", async (req: express.Request, res: express.Response) => {
    try {
        await User.fromId(req.params.id).delete();
        res.status(204).send();
        console.debug(`User ${req.params.id} deleted`);
    }
    catch (e: any) {
        console.error(e);
        res.status(500).send({error:"Unexpected delete error"});
    }
});

export default router;
