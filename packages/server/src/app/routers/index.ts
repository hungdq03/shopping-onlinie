import { Router } from 'express';
import auth from './auth';
import user from './user';
import brand from './brand';

const router = Router();

export default (): Router => {
    auth(router);
    user(router);
    brand(router);

    return router;
};
