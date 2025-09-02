import express from "express";
import * as data from "./data/redis.ts";

const router = express.Router();

class User {
    id?: string;
    username: string;
    password: string;
    name: string;
    
    static fromBody(body: any) {
        const user = new User();
        user.username = body.username;
        user.password = body.password;
        user.name = body.name;
        return user;
    }

    static fromId(id: string, body = {}) {
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
        this.id = undefined;
        return this;
    }

    toData() {
        return {
            username: this.username,
            password: this.password,
            name: this.name,
        };
    }

    toObject() {
        return {...this, url: "/api/user/" + this.id};
    }
}

// Resource and verb definitions 

router.post("/", async (req: express.Request, res: express.Response) => {
    try {
        const user = await User.fromBody(req.body).save();
        res.status(201).send(user.toObject());
        console.debug(`Added user:${user.id}`);
    }
    catch (error: any) {
        res.status(500).send({error: `Unexpected POST error: ${error.message}`});
        console.error(error);
    }
});

router.get("/", async (req: express.Request, res: express.Response) => {
    try {
        const users = await User.getAll();
        res.status(200).send(users.map(user => user.toObject()));
        console.debug("Retrieved user:*");
    }
    catch (error: any) {
        res.status(500).send({error: `Unexpected GET error: ${error.message}`});
        console.error(error);
    }
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
    try {
        const user = await User.fromId(req.params.id).load();
        res.status(200).send(user.toObject());
        console.debug(`Retrieved user:${user.id}`);
    }
    catch (error: any) {
        if (error instanceof data.NotFoundError) {
            res.status(404).send({error: error.message});
            console.debug(error.message);
        }
        else {
            res.status(500).send({error: `Unexpected GET error: ${error.message}`});
            console.error(error);
        }
    }
});

router.put("/:id", async (req: express.Request, res: express.Response) => {
    try {
        const user = await User.fromId(req.params.id, req.body).save();
        res.status(201).send(user.toObject());
        console.debug(`Updated user:${user.id}`);
    }
    catch (error: any) {
        res.status(500).send({error: `Unexpected PUT error: ${error.message}`});
        console.error(error);
    }
});

router.delete("/:id", async (req: express.Request, res: express.Response) => {
    try {
        await User.fromId(req.params.id).delete();
        res.status(204).send();
        console.debug(`Deleted user:${req.params.id}`);
    }
    catch (error: any) {
        res.status(500).send({error: `Unexpected DELETE error: ${error.message}`});
        console.error(error);
    }
});

export default router;
