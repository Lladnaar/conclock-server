import { createClient } from 'redis';
import {v7 as uuid} from 'uuid';
import settings from '../settings.ts';

const client = createClient({ url: settings.redis.url });
client.on('error', err => console.error('Redis Client Error: ', err));
await client.connect();
console.info('Connected to Redis data server');

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
        const content = JSON.parse(jsonContent)
        return content;
    }
    else
        return null;
}

export async function add(resource: string, content: any) {
    const id = uuid();
    await client.set(`${resource}:${id}`, JSON.stringify(content));
    return id;
}

export async function set(resource: string, id: string, content: any) {
    await client.set(`${resource}:${id}`, JSON.stringify(content));
    return content;
}

export async function del(resource: string, id: string) {
    return await client.del(`${resource}:${id}`);
}

