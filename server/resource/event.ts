import express from "express";
import {Resource, ResourceId, ResourceContent, ResourceFactory} from "./resource.ts";
import {Rest} from "./rest.ts";
import {BadRequestError} from "../error.ts";

class EventContent extends ResourceContent {
    name: string;
    startDate: Date;
    endDate: Date;
    constructor(eventContentMaybe: object) {
        super();
        if (this.isValid(eventContentMaybe)) {
            this.name = eventContentMaybe.name;
            this.startDate = eventContentMaybe.startDate;
            this.endDate = eventContentMaybe.endDate;
        }
        else
            throw new BadRequestError("Invalid Event data.");
    }

    isValid(eventContentMaybe: object): eventContentMaybe is EventContent {
        return "name" in eventContentMaybe
            && "startDate" in eventContentMaybe
            && "endDate" in eventContentMaybe;
    }
}

class Event extends Resource<EventContent> {}

class EventFactory extends ResourceFactory<EventContent, Event> {
    constructor() { super("event"); }

    newContent(content: object): EventContent {
        return new EventContent(content);
    }
    newResource(id: ResourceId, content: EventContent) {
        return new Event(id, content);
    }
}

// REST router

const event = new Rest<EventContent, Event>(new EventFactory());

const router = express.Router();
router.get("/", event.getAll.bind(event));
router.get("/:id", event.get.bind(event));
router.post("/", event.post.bind(event));
router.put("/:id", event.put.bind(event));
router.delete("/:id", event.delete.bind(event));
export default router;
