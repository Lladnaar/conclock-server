import express from 'express';
import { router as timeRouter} from './time.ts';

const app = express();
const port = 9000;
const appfiles = 'app';

// use the json middleware
app.use(express.json());

app.get('/', (req: express.Request, res: express.Response) => {
  res.send({
    'time': {'url': `${req.protocol}://${req.host}/time`}
  });
});

app.use('/app', express.static(appfiles));
app.use('/time', timeRouter);

app.all('/{*any}', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(404).send('Resource not found');
});

// start server
app.listen(port, () => {
  console.info(`api listening at http://localhost:${port}`);
});
