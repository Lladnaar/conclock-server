// index.ts
import express from 'express';

const app = express();
const port = 9000;

// use the json middleware
app.use(express.json());

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello');
});

// start server
app.listen(port, () => {
  console.info(`api listening at http://localhost:${port}`);
});
