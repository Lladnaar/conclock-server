import { createClient } from 'redis';
const client = createClient();

client.on('error', err => console.error('Redis Client Error', err));
await client.connect();
console.info('Connected to Redis data server');

export default client;