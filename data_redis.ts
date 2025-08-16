import { createClient } from 'redis';
import {v7 as uuid} from 'uuid';

export const client = createClient();
client.on('error', err => console.error('Redis Client Error', err));
await client.connect();
console.info('Connected to Redis data server');

export class User {
    static list() {
        return client.keys('user:*');
    }

    static exists(id: string) {
        return client.exists(`user:${id}`);
    }

    static async get(id: string) {
        const userString = await client.get(`user:${id}`);
        if (userString) {
            var user = JSON.parse(userString)
            return user;
        }
        else
            return userString;
    }

    static async add(user: any) {
        var id = uuid();
        await client.set(`user:${id}`, JSON.stringify(user));
        return id;
    }

    static async set(id: string, user: any) {
        await client.set(`user:${id}`, JSON.stringify(user));
        return user;
    }

    static delete(id: string) {
        return client.del(`user:${id}`);
    }
}
