import { Router } from 'express';
import auth from './auth';
import user from './user';
import brand from './brand';
import upload from './upload';
import category from './category';
import product from './product';
import post from './post';

const router = Router();

export default (): Router => {
    auth(router);
    user(router);
    brand(router);
    upload(router);
    category(router);
    product(router);
    post(router);

    return router;
};
