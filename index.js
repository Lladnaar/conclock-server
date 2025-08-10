// index.js
import express from 'express';

const app = express();

// use the json middleware
app.use(express.json());

// use openapi-backend to handle requests
//app.use((req, res) => api.handleRequest(req, req, res));

// start server
app.listen(9000, () => console.info('api listening at http://localhost:9000'));
