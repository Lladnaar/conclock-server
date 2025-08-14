import { createClient } from 'redis';
import {v7 as uuid} from 'uuid';

export const client = createClient();
client.on('error', err => console.error('Redis Client Error', err));
await client.connect();
console.info('Connected to Redis data server');

export function list(resource: string) {
    return client.keys(`${resource}:*`);
}

export function exists(resource: string, id: string) {
    return client.exists(`${resource}:${id}`);
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

export function del(resource: string, id: string) {
    return client.del(`${resource}:${id}`);
}

