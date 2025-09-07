import express from "express";
import {InvalidResource, Resource, ResourceId, ResourceContent, ResourceFactory} from "./resource.ts";
import {Rest} from "./rest.ts";

class UserContent extends ResourceContent {
    username: string;
    password: string;
    name: string | undefined;

    constructor(userContentMaybe: object) {
        super();
        if (this.isValid(userContentMaybe)) {
            this.username = userContentMaybe.username;
            this.password = userContentMaybe.password;
            this.name = userContentMaybe.name;
        }
        else
            throw new InvalidResource();
    }

    isValid(userContentMaybe: object): userContentMaybe is UserContent {
        return "username" in userContentMaybe
            && "password" in userContentMaybe;
    }
}

class User extends Resource<UserContent> {}

class UserFactory extends ResourceFactory<UserContent, User> {
    constructor() { super("user"); }

    newContent(content: object): UserContent {
        return new UserContent(content);
    }
    newResource(id: ResourceId, content: UserContent) {
        return new User(id, content);
    }
}

// REST router

const user = new Rest<UserContent, User>(new UserFactory());

const router = express.Router();
router.get("/", user.getAll.bind(user));
router.get("/:id", user.get.bind(user));
router.post("/", user.post.bind(user));
router.put("/:id", user.put.bind(user));
router.delete("/:id", user.delete.bind(user));
export default router;
