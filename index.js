// src/server.ts
import express from 'express';

const app = express();

// use the json middleware
app.use(express.json());

// start server
app.listen(9000, () => console.info('api listening at http://localhost:9000'));
