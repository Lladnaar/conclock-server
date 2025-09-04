import { createClient } from "redis";
import {v7 as uuid} from "uuid";
import config from "../config.ts";

export class NotFoundError extends Error {};
export class FormatError extends Error {};

const client = createClient({ url: config.redis.url });
client.on("error", err => console.error("Redis Client Error: ", err));
await client.connect();
console.info("Connected to Redis data server");

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
    await client.set(`${resource}:${id}`, JSON.stringify(content));
    return content;
}

export async function del(resource: string, id: string) {
    return await client.del(`${resource}:${id}`);
}
