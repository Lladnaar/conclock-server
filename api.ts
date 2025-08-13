// time resource definition

import express from 'express';

const router = express.Router();

// Resource and verb definitions 

router.get('/', (req: express.Request, res: express.Response) => {
  res.send({
    'time': {'url': `${req.protocol}://${req.host}/api/time`}
  });
});

export default router;
