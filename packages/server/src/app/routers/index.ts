import { Router } from 'express';
import auth from './auth';
import user from './user';
import brand from './brand';
import upload from './upload';

const router = Router();

export default (): Router => {
    auth(router);
    user(router);
    brand(router);
    upload(router);

    return router;
};
