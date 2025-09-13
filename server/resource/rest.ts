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
    }

    async getAll(req: express.Request, res: express.Response) {
        const resources = await this.factory.loadAll();
        res.status(http.OK).send(resources.map(resource => resource.toRest(req.baseUrl)));
    }

    async post(req: express.Request, res: express.Response) {
        const resource = await this.factory.create(req.body);
        res.status(http.OK).send(resource.toRest(req.baseUrl));
    }

    async put(req: express.Request, res: express.Response) {
        const resource = await this.factory.save(req.params.id!, req.body);
        res.status(http.OK).send(resource.toRest(req.baseUrl));
    }

    async delete(req: express.Request, res: express.Response) {
        await this.factory.delete(req.params.id!);
        res.status(http.NO_CONTENT).send();
    }
}
