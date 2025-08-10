// Core HTTP server definition

import express from 'express';
import settings from './settings.ts';
import { router as timeRouter} from './time.ts';

// Server parameters

const server = express();

// Use JSON middleware

server.use(express.json());

// HATEOAS discovery

server.get('/', (req: express.Request, res: express.Response) => {
  res.send({
    'time': {'url': `${req.protocol}://${req.host}/time`}
  });
});

// Resource definitions

server.use('/app', express.static(settings.appfiles));
server.use('/time', timeRouter);

server.all('/{*any}', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(404).send('Resource not found');
});

// Start server

server.listen(settings.port, () => {
  console.info(`Listening at http://localhost:${settings.port}`);
});
