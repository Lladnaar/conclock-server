// user resource definition

import express from 'express';
import { createClient } from 'redis';

const router = express.Router();

const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();

// Resource and verb definitions 

router.get('/:userid', (req: express.Request, res: express.Response) => {
    console.debug(`User ${req.params.userid} requested`);
    var exists = client.exists(`user:{req.params.userid}`).then(() => {
        if (exists === 1) {
            res.send({
                'url': `${req.protocol}://${req.host}${req.baseUrl}/${req.params.userid}`,
                'userid': req.params.userid,
                'value': value
            });
        }
        else {
            res.status(404).send();
        }
    })
});

router.put('/:userid', (req: express.Request, res: express.Response) => {
    console.debug(`User ${req.params.userid} updated`);
    client.set(`user:{req.params.userid}`,'true').then(() => {
        res.status(201).send({
        'url': `${req.protocol}://${req.host}${req.baseUrl}/${req.params.userid}`,
        'userid': req.params.userid
        });
    });
});

router.delete('/:userid', (req: express.Request, res: express.Response) => {
    console.debug(`User ${req.params.userid} deleted`);
    client.del(`user:{req.params.userid}`).then(() => {
        res.status(204).send();
    })
});

export default router;
