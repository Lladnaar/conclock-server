// user resource definition

import express from 'express';
import * as data from './data/redis.ts';

const router = express.Router();

class Resource {
    static validate(resource: any, schema: any): any {
        return resource;
    }

    static decorate(resource: any, id: string, urlbase: string) {
        resource.id = id;
        resource.url = `${urlbase}/${id}`
    }
}

// Resource and verb definitions 

router.get('/:id', async (req: express.Request, res: express.Response) => {
    try {
        var user = await data.get('user', req.params.id);
        if (user) {
            Resource.decorate(user, req.params.id, `${req.protocol}://${req.host}${req.baseUrl}`);
            res.send(user);
            console.debug(`User ${req.params.id} retrieved`);
        }
        else {
            res.status(404).send();
            console.debug(`User ${req.params.id} not found`);
        }
    }
    catch (e: any) {
        console.error(e);
        res.status(500).send({'error':'Unexpected fetch error'});
    }
});

router.post('/', async (req: express.Request, res: express.Response) => {
    try {
        var id = await data.add('user', req.body);
        var user = req.body;
        Resource.decorate(user, id, `${req.protocol}://${req.host}${req.baseUrl}`)
        res.status(201).send(user);
        console.debug(`User ${id} added`);
    }
    catch (e: any) {
        console.error(e);
        res.status(500).send({'error':'Unexpected add error'});
    }
});

router.put('/:id', async (req: express.Request, res: express.Response) => {
    try {
        var user = await data.set('user', req.params.id, req.body);
        Resource.decorate(user, req.params.id, `${req.protocol}://${req.host}${req.baseUrl}`);
        res.status(201).send(user);
        console.debug(`User ${req.params.id} updated`);
    }
    catch (e: any) {
        console.error(e);
        res.status(500).send({'error':'Unexpected update error'});
    }
});

router.delete('/:id', async (req: express.Request, res: express.Response) => {
    try {
        await data.del('user', req.params.id);
        res.status(204).send();
        console.debug(`User ${req.params.id} deleted`);
    }
    catch (e: any) {
        console.error(e);
        res.status(500).send({'error':'Unexpected delete error'});
    }
});

export default router;
