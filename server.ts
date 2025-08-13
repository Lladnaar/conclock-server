// Core HTTP server definition

import express from 'express';
import settings from './settings.ts';
import apiRouter from './api.ts';
import timeRouter from './time.ts';

// Server parameters

const server = express();

// Use JSON middleware

server.use(express.json());

// Resource definitions

server.use('/', express.static(settings.appfiles));
server.use('/api', apiRouter);
server.use('/api/time', timeRouter);

server.all('/{*any}', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(404).send('Resource not found');
});

// Start server

server.listen(settings.port, () => {
  console.info(`Listening at http://localhost:${settings.port}`);
});
