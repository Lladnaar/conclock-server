// Core HTTP server definition

import express from 'express';
import { router as timeRouter} from './time.ts';

// Server parameters

const server = express();
const port = 9000;
const appfiles = 'app';

// Use JSON middleware

server.use(express.json());

// HATEOAS discovery

server.get('/', (req: express.Request, res: express.Response) => {
  res.send({
    'time': {'url': `${req.protocol}://${req.host}/time`}
  });
});

// Resource definitions

server.use('/app', express.static(appfiles));
server.use('/time', timeRouter);

server.all('/{*any}', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(404).send('Resource not found');
});

// Start server

server.listen(port, () => {
  console.info(`Listening at http://localhost:${port}`);
});
