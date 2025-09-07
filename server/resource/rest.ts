import express from "express";
import {StatusCodes as http} from "http-status-codes";
import {InvalidResource, NotFoundError, Resource, ResourceContent, ResourceFactory} from "./resource.ts";

export class Rest<T extends ResourceContent, U extends Resource<T>> {
    factory: ResourceFactory<T, U>;

    constructor(factory: ResourceFactory<T, U>) {
        this.factory = factory;
    }

    async get(req: express.Request, res: express.Response) {
        try {
            const resource = await this.factory.load(req.params.id!);
            res.status(http.OK).send(resource.toRest(req.baseUrl));
            console.debug(`Retrieved ${this.factory.type}:${resource.id.id}`);
        }
        catch (error) {
            if (error instanceof NotFoundError) {
                res.status(http.NOT_FOUND).send({error: error.message});
                console.debug(error.message);
            }
            else {
                res.status(http.INTERNAL_SERVER_ERROR).send(this.formatError("GET", error));
            }
        }
    }

    async getAll(req: express.Request, res: express.Response) {
        try {
            const resources = await this.factory.loadAll();
            res.status(http.OK).send(resources.map(resource => resource.toRest(req.baseUrl)));
            console.debug(`Retrieved ${this.factory.type}:*`);
        }
        catch (error: unknown) {
            res.status(http.INTERNAL_SERVER_ERROR).send(this.formatError("GET", error));
        }
    }

    async post(req: express.Request, res: express.Response) {
        try {
            const resource = await this.factory.create(req.body);
            res.status(http.OK).send(resource.toRest(req.baseUrl));
            console.debug(`Added ${this.factory.type}:${resource.id.id}`);
        }
        catch (error: unknown) {
            if (error instanceof InvalidResource) {
                res.status(http.BAD_REQUEST).send(this.formatError("PUT", error));
            }
            res.status(http.INTERNAL_SERVER_ERROR).send(this.formatError("POST", error));
        }
    }

    async put(req: express.Request, res: express.Response) {
        try {
            const resource = await this.factory.save(req.params.id!, req.body);
            res.status(http.OK).send(resource.toRest(req.baseUrl));
            console.debug(`Updated ${this.factory.type}:${resource.id.id}`);
        }
        catch (error: unknown) {
            if (error instanceof InvalidResource) {
                res.status(http.BAD_REQUEST).send(this.formatError("PUT", error));
            }
            res.status(http.INTERNAL_SERVER_ERROR).send(this.formatError("PUT", error));
        }
    }

    async delete(req: express.Request, res: express.Response) {
        try {
            await this.factory.delete(req.params.id!);
            res.status(http.NO_CONTENT).send();
            console.debug(`Deleted ${this.factory.type}:${req.params.id}`);
        }
        catch (error: unknown) {
            res.status(http.INTERNAL_SERVER_ERROR).send(this.formatError("DELETE", error));
        }
    }

    formatError(verb: string, error: unknown) {
        console.error(error);
        if (error instanceof Error)
            return {error: `Unexpected ${verb} error: ${error?.message}`};
        else
            return {error: `Unknown ${verb} error`};
    }
}
