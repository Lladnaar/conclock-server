// time resource definition

import express from 'express';

const router = express.Router();

// Resource and verb definitions 

router.get('/', (req: express.Request, res: express.Response) => {
    console.debug('Time requested');
    res.send({
      'url': `${req.protocol}://${req.host}${req.baseUrl}`,
      'time': new Date()
    });
});

export default router;
