// user resource definition

import express from 'express';

const router = express.Router();

// Resource and verb definitions 

router.get('/:userid', (req: express.Request, res: express.Response) => {
    console.debug(`User ${req.params.userid} requested`);
    res.send({
      'url': `${req.protocol}://${req.host}${req.baseUrl}/${req.params.userid}`,
      'userid': req.params.userid
    });
});

router.put('/:userid', (req: express.Request, res: express.Response) => {
    console.debug(`User ${req.params.userid} updated`);
    res.status(201).send({
      'url': `${req.protocol}://${req.host}${req.baseUrl}/${req.params.userid}`,
      'userid': req.params.userid
    });
});

router.delete('/:userid', (req: express.Request, res: express.Response) => {
    console.debug(`User ${req.params.userid} deleted`);
    res.status(204).send();
});

export default router;
