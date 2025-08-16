// user resource definition

import express from 'express';
import {client, User} from './data_redis.ts';

const router = express.Router();

// Resource and verb definitions 

router.get('/:userid', async (req: express.Request, res: express.Response) => {
    try {
        var user = await User.get(req.params.userid);
        if (user) {
            res.send(user);
            console.debug(`User ${req.params.userid} retrieved`);
        }
        else {
            res.status(404).send();
            console.debug(`User ${req.params.userid} not found`);
        }
    }
    catch (e: any) {
        console.error(e);
        res.status(500).send({'error':'Unexpeceted fetch error'});
    }
});

router.put('/:userid', async (req: express.Request, res: express.Response) => {
    try {
        await User.set(req.params.userid, req.body);
        res.status(201).send(req.body);
        console.debug(`User ${req.params.userid} updated`);
    }
    catch (e: any) {
        console.error(e);
        res.status(500).send({'error':'Unexpected upsert error'});
    }
});

router.delete('/:userid', async (req: express.Request, res: express.Response) => {
    try {
        await User.delete(req.params.userid);
        res.status(204).send();
        console.debug(`User ${req.params.userid} deleted`);
    }
    catch (e: any) {
        console.error(e);
        res.status(500).send({'error':'Unexpected delete error'});
    }
});

export default router;
