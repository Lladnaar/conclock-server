import express from "express";
import {StatusCodes as http} from "http-status-codes";
import {Resource, ResourceContent, ResourceFactory} from "./resource.ts";

export class Rest<T extends ResourceContent, U extends Resource<T>> {
    factory: ResourceFactory<T, U>;

    constructor(factory: ResourceFactory<T, U>) {
        this.factory = factory;
    }

    async get(req: express.Request, res: express.Response) {
        const resource = await this.factory.load(req.params.id!);
        res.status(http.OK).send(resource.toRest(req.baseUrl));
        console.debug(`Retrieved ${this.factory.type}:${resource.id.id}`);
    }

    async getAll(req: express.Request, res: express.Response) {
        const resources = await this.factory.loadAll();
        res.status(http.OK).send(resources.map(resource => resource.toRest(req.baseUrl)));
        console.debug(`Retrieved ${this.factory.type}:*`);
    }

    async post(req: express.Request, res: express.Response) {
        const resource = await this.factory.create(req.body);
        res.status(http.OK).send(resource.toRest(req.baseUrl));
        console.debug(`Added ${this.factory.type}:${resource.id.id}`);
    }

    async put(req: express.Request, res: express.Response) {
        const resource = await this.factory.save(req.params.id!, req.body);
        res.status(http.OK).send(resource.toRest(req.baseUrl));
        console.debug(`Updated ${this.factory.type}:${resource.id.id}`);
    }

    async delete(req: express.Request, res: express.Response) {
        await this.factory.delete(req.params.id!);
        res.status(http.NO_CONTENT).send();
        console.debug(`Deleted ${this.factory.type}:${req.params.id}`);
    }
}
