import express from "express";
import {StatusCodes as http} from "http-status-codes";
import * as data from "../data/redis.ts";

// REST router

const router = express.Router();
router.get("/", getEventAll);
router.get("/:id", getEvent);
router.post("/", postEvent);
router.put("/:id", putEvent);
router.delete("/:id", deleteEvent);
export default router;

// Event resource

type RestEvent = {
    id?: string;
    name?: string;
    startDate?: string;
    endDate?: string;
    url?: string;
};

class Event {
    id?: string;
    name?: string;
    startDate: Date | undefined;
    endDate: Date | undefined;

    static fromBody(body: RestEvent) {
        const event = new Event();
        event.name = body.name ?? "";
        event.startDate = body.startDate ? new Date(body.startDate) : undefined;
        event.endDate = body.endDate ? new Date(body.endDate) : undefined;
        return event;
    }

    static fromId(id: string, body: RestEvent = {}) {
        const event = Event.fromBody(body);
        event.id = id;
        return event;
    }

    static async getAll() {
        const ids = await data.list("event");
        return ids.map(id => Event.fromId(id));
    }

    async save() {
        if (this.id)
            await data.set("event", this.id, this.toData());
        else
            this.id = await data.add("event", this.toData());
        return this;
    }

    async load() {
        const content = await data.get("event", this.id!);
        this.name = content?.name;
        this.startDate = content.startDate ? new Date(content.startDate) : undefined;
        this.endDate = content.endDate ? new Date(content.endDate) : undefined;
        return this;
    }

    async delete() {
        await data.del("event", this.id!);
        return undefined;
    }

    toData() {
        return {
            name: this.name,
            startDate: this.startDate,
            endDate: this.endDate,
        };
    }

    toRest(baseUrl: string): RestEvent {
        const event: RestEvent = {};
        if (this.id) {
            event.id = this.id;
            event.url = `${baseUrl}/${this.id}`;
        }
        if (this.name) event.name = this.name;
        if (this.startDate) event.startDate = this.startDate.toDateString();
        if (this.endDate) event.endDate = this.endDate.toDateString();

        return event;
    }
}

// REST verb definitions

async function postEvent(req: express.Request, res: express.Response) {
    try {
        const event = await Event.fromBody(req.body).save();
        res.status(http.CREATED).send(event.toRest(req.baseUrl));
        console.debug(`Added event:${event.id}`);
    }
    catch (error: unknown) {
        res.status(http.INTERNAL_SERVER_ERROR).send(formatError("POST", error));
    }
}

async function getEventAll(req: express.Request, res: express.Response) {
    try {
        const events = await Event.getAll();
        res.status(http.OK).send(events.map(event => event.toRest(req.baseUrl)));
        console.debug("Retrieved event:*");
    }
    catch (error: unknown) {
        res.status(http.INTERNAL_SERVER_ERROR).send(formatError("GET", error));
    }
}

async function getEvent(req: express.Request, res: express.Response) {
    try {
        const event = await Event.fromId(req.params.id!).load();
        res.status(http.OK).send(event.toRest(req.baseUrl));
        console.debug(`Retrieved event:${event.id}`);
    }
    catch (error: unknown) {
        if (error instanceof data.NotFoundError) {
            res.status(http.NOT_FOUND).send({error: error.message});
            console.debug(error.message);
        }
        else {
            res.status(http.INTERNAL_SERVER_ERROR).send(formatError("GET", error));
        }
    }
}

async function putEvent(req: express.Request, res: express.Response) {
    try {
        const event = await Event.fromId(req.params.id!, req.body).save();
        res.status(http.OK).send(event.toRest(req.baseUrl));
        console.debug(`Updated event:${event.id}`);
    }
    catch (error: unknown) {
        res.status(http.INTERNAL_SERVER_ERROR).send(formatError("PUT", error));
    }
}

async function deleteEvent(req: express.Request, res: express.Response) {
    try {
        await Event.fromId(req.params.id!).delete();
        res.status(http.NO_CONTENT).send();
        console.debug(`Deleted event:${req.params.id}`);
    }
    catch (error: unknown) {
        res.status(http.INTERNAL_SERVER_ERROR).send(formatError("DELETE", error));
    }
}

function formatError(verb: string, error: unknown) {
    console.error(error);
    if (error instanceof Error)
        return {error: `Unexpected ${verb} error: ${error?.message}`};
    else
        return {error: "Unknown ${verb} error"};
}
