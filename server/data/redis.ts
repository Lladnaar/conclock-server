import {createClient} from "redis";
import {v7 as uuid} from "uuid";
import config from "../config.ts";

export class NotFoundError extends Error {}
export class FormatError extends Error {}

const client = createClient({url: config.redis.url});
client.on("connect", () => console.info("Connecing to Redis..."));
client.on("ready", () => console.info("Redis connected."));
client.on("error", error => console.error(`Redis Error: ${error.message || error.code}`));
client.on("reconnecting", () => console.info("Reconnecting to Redis..."));
client.connect();

export async function list(resource: string) {
    return (await client.keys(`${resource}:*`))
        .map(string => string.slice(resource.length + 1));
}

export async function exists(resource: string, id: string) {
    return await client.exists(`${resource}:${id}`);
}

export async function get(resource: string, id: string) {
    const jsonContent = await client.get(`${resource}:${id}`);
    if (jsonContent) {
        try {
            const content = JSON.parse(jsonContent);
            return content;
        }
        catch {
            throw new FormatError(`Data for ${resource}:${id} is corrupted`);
        }
    }
    else
        throw new NotFoundError(`No data found for ${resource}:${id}`);
}

export async function add(resource: string, content: object) {
    const id = uuid();
    await client.set(`${resource}:${id}`, JSON.stringify(content));
    return id;
}

export async function set(resource: string, id: string, content: object) {
    const jsonContent = JSON.stringify(content);
    await client.set(`${resource}:${id}`, jsonContent);
    return content;
}

export async function update(resource: string, id: string, newContent: object) {
    const existingContent = await get(resource, id);
    const updatedContent = {...existingContent, ...newContent};
    return await set(resource, id, updatedContent);
}

export async function del(resource: string, id: string) {
    return await client.del(`${resource}:${id}`);
}
