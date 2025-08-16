import { createClient } from 'redis';

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

    static get(id: string) {
        return client.get(`user:${id}`).then(user => JSON.parse(user));
    }

    static set(id: string, user: object) {
        return client.set(`user:${id}`, JSON.stringify(user));
    }

    static delete(id: string) {
        return client.del(`user:${id}`);
    }
}
