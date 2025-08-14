// user resource definition

import express from 'express';

const router = express.Router();
var user = new Set();

// Resource and verb definitions 

router.get('/:userid', (req: express.Request, res: express.Response) => {
    console.debug(`User ${req.params.userid} requested`);
    if (user.has(req.params.userid)) {
        res.send({
            'url': `${req.protocol}://${req.host}${req.baseUrl}/${req.params.userid}`,
            'userid': req.params.userid
        });
    }
    else {
        res.status(404).send();
    }
});

router.put('/:userid', (req: express.Request, res: express.Response) => {
    console.debug(`User ${req.params.userid} updated`);
    user.add(req.params.userid);
    res.status(201).send({
      'url': `${req.protocol}://${req.host}${req.baseUrl}/${req.params.userid}`,
      'userid': req.params.userid
    });
});

router.delete('/:userid', (req: express.Request, res: express.Response) => {
    console.debug(`User ${req.params.userid} deleted`);
    user.delete(req.params.userid);
    res.status(204).send();
});

export default router;
