import { createClient } from 'redis';

export const client = createClient();
client.on('error', err => console.error('Redis Client Error', err));
await client.connect();
console.info('Connected to Redis data server');

export class User {
    static list() {

    }
    
    static exists(id: string) {
        return client.exists(`user:${id}`);
    }

    static get(id: string) {

    }

    static set(id: string, content: object) {
        return client.set(`user:${id}`, 'true');
    }

    static delete(id) {
        return client.del(`user:${id}`);
    }
}
