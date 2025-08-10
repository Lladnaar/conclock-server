// index.ts
import express from 'express';

const app = express();
const port = 9000;

// use the json middleware
app.use(express.json());

app.get('/', (req: express.Request, res: express.Response) => {
  res.send({
    'time': {'url': `${req.protocol}://${req.get('host')}/time`}
  });
});

app.all('/{*any}', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(404).send('Resource not found');
});

// start server
app.listen(port, () => {
  console.info(`api listening at http://localhost:${port}`);
});
