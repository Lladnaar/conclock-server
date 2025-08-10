// time resource definition

import express from 'express';

const router = express.Router();

// Resource and verb definitions 

router.get('/', (req: express.Request, res: express.Response) => {
  res.send({
    'url': `${req.protocol}://${req.get('host')}/time`,
    'time': new Date()
  });
});

export { router };
