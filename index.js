// src/server.ts
import { OpenAPIBackend } from 'openapi-backend';
import express from 'express';

const api = new OpenAPIBackend({
  definition: './conclock.api.json',
});

api.init();

// handler for getPets operation in openapi.yml
api.register('getTime', (c, req, res) =>
  res.status(200).json([{ time: '0000-00-00T00:00:00Z' }])
)
// return 400 when request validation fails
api.register('validationFail', (c, req, res) =>
  res.status(400).json({ err: c.validation.errors }),
)
// return 404 when route doesn't match any operation in openapi.yml
api.register('notFound', (c, req, res) =>
  res.status(404).json({ err: 'not found' }),
)

const app = express();

// use the json middleware
app.use(express.json());

// use openapi-backend to handle requests
app.use((req, res) => api.handleRequest(req, req, res));

// start server
app.listen(9000, () => console.info('api listening at http://localhost:9000'));
