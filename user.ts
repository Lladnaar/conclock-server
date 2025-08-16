// user resource definition

import express from 'express';
import {client, User} from './data_redis.ts';

const router = express.Router();

// Resource and verb definitions 

router.get('/:userid', (req: express.Request, res: express.Response) => {
    User.exists(req.params.userid).then((exists) => {
        if (exists === 1) {
            res.send({
                'url': `${req.protocol}://${req.host}${req.baseUrl}/${req.params.userid}`,
                'userid': req.params.userid
            });
            console.debug(`User ${req.params.userid} retrieved`);
        }
        else {
            res.status(404).send();
            console.debug(`User ${req.params.userid} not found`);
        }
    }).catch(() => {
        console.error('Unexpected User fetch error');
        res.status(500).send({'error':'Unexpeceted fetch error'});
    });
});

router.put('/:userid', (req: express.Request, res: express.Response) => {
    User.set(req.params.userid, {'true':'true'}).then(() => {
        res.status(201).send({
            'url': `${req.protocol}://${req.host}${req.baseUrl}/${req.params.userid}`,
            'userid': req.params.userid
        });
        console.debug(`User ${req.params.userid} updated`);
    }).catch(() => {
        console.error('Unexpected User upsert error');
        res.status(500).send({'error':'Unexpected upsert error'});
    });
});

router.delete('/:userid', async (req: express.Request, res: express.Response) => {
    try {
        await User.delete(req.params.userid);
        res.status(204).send();
        console.debug(`User ${req.params.userid} deleted`);
    }
    catch {
        console.error('Unexpected User delete error');
        res.status(500).send({'error':'Unexpected delete error'});
    }
});

export default router;
