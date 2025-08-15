// user resource definition

import express from 'express';
import { createClient } from 'redis';

const router = express.Router();

const client = createClient();
client.on('error', err => console.error('Redis Client Error', err));
await client.connect();
console.info('Connected to Redis data server');

// Resource and verb definitions 

router.get('/:userid', (req: express.Request, res: express.Response) => {
    console.debug(`User ${req.params.userid} requested`);
    client.exists(`user:${req.params.userid}`).then((exists) => {
        if (exists === 1) {
            res.send({
                'url': `${req.protocol}://${req.host}${req.baseUrl}/${req.params.userid}`,
                'userid': req.params.userid
            });
        }
        else {
            res.status(404).send();
        }
    }).catch(() => {
        console.error('Unexpeceted User fetch error');
        res.status(500).send({'error':'Unexpeceted fetch error'});
    });
});

router.put('/:userid', (req: express.Request, res: express.Response) => {
    console.debug(`User ${req.params.userid} updated`);
    client.set(`user:${req.params.userid}`,'true').then(() => {
        res.status(201).send({
        'url': `${req.protocol}://${req.host}${req.baseUrl}/${req.params.userid}`,
        'userid': req.params.userid
        });
    }).catch(() => {
        console.error('Unexpeceted User upsert error');
        res.status(500).send({'error':'Unexpected upsert error'});
    });
});

router.delete('/:userid', (req: express.Request, res: express.Response) => {
    console.debug(`User ${req.params.userid} deleted`);
    client.del(`user:${req.params.userid}`).then(() => {
        res.status(204).send();
    }).catch(() => {
        console.error('Unexpeceted User delete error');
        res.status(500).send({'error':'Unexpected delete error'});
    });
});

export default router;
