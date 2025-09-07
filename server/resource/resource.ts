import * as data from "../data/redis.ts";

export class InvalidResource extends Error {}
export class NotFoundError extends Error {}

export class ResourceId {
    id: string;

    constructor(id: string) {
        this.id = id;
    }

    toRest(baseUrl: string): object {
        return {id: this.id, url: `${baseUrl}/${this.id}`};
    }
}

export class ResourceContent {
    toData() {
        return {...this};
    }
}

export class Resource<T extends ResourceContent> {
    id: ResourceId;
    content: T;

    constructor(id: ResourceId, content: T) {
        this.id = id;
        this.content = content;
    }

    toRest(baseUrl: string): object {
        return {...this.id.toRest(baseUrl), ...this.content};
    }

    toData() {
        return this.content.toData();
    }
}

export abstract class ResourceFactory<T extends ResourceContent, U extends Resource<T>> {
    type: string;

    constructor(type: string) {
        this.type = type;
    }

    newId(id: string) { return new ResourceId(id); }
    abstract newContent(content: object): T;
    abstract newResource(id: ResourceId, content: T): U;

    async loadAll(): Promise<ResourceId[]> {
        const ids = await data.list(this.type);
        return ids.map(id => this.newId(id));
    }

    async load(id: string) {
        try {
            const content = await data.get(this.type, id);
            return this.newResource(this.newId(id), this.newContent(content));
        }
        catch (error) {
            if (error instanceof data.NotFoundError)
                throw new NotFoundError(error.message);
            else
                throw error;
        }
    }

    async create(contentData: object) {
        const content = this.newContent(contentData);
        const id = await data.add(this.type, content.toData());
        return this.newResource(this.newId(id), content);
    }

    async save(id: string, content: object) {
        const resource = this.newResource(this.newId(id), this.newContent(content));
        await data.set(this.type, resource.id.id, resource.toData());
        return resource;
    }

    async delete(id: string): Promise<undefined> {
        await data.del(this.type, id);
        return undefined;
    }
}
